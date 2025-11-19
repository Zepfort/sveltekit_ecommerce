// src/routes/checkout/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';
import { MIDTRANS_SERVER_KEY } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
	const { url, cookies } = event; 
	const supabase = createSupabaseServerClient(event);
	const slug = url.searchParams.get('slug');
	const qtyParam = url.searchParams.get('qty');
	const qty = qtyParam ? parseInt(qtyParam) : 1;
	let fromCart = false;
	const user = event.locals.session?.user;

	if (!user) throw redirect(303, '/login');

	const { data: addresses } = await supabase
		.from('addresses')
		.select('*')
		.eq('user_id', user.id)
		.order('is_default', { ascending: false });

	let items: Array<{ id: string; name: string; image_url: string; price: number; qty: number, slug: string }> =
		[];

	if (slug) {
		// mode beli langsung 
		const { data, error: fetchError } = await supabase
			.from('products')
			.select('*')
			.eq('slug', slug)
			.maybeSingle();

		if (fetchError || !data) throw error(404, 'Produk tidak ditemukan');

		items = [
			{
				id: data.id,
				name: data.name,
				image_url: data.image_url,
				price: Number(data.price),
				qty,
				slug: data.slug
			}
		];
		fromCart = false;
	} else {
		// mode keranjang
		const user = event.locals.session?.user;
		let parsed: any[] = [];

		if (user) {
			const { data: cartRow } = await supabase
				.from('carts')
				.select('id')
				.eq('user_id', user.id)
				.eq('status', 'active')
				.maybeSingle();

			if (cartRow) {
				const { data: cartRows } = await supabase
					.from('cart_items')
					.select('product_id, qty')
					.eq('cart_id', cartRow.id);
				parsed = cartRows || [];
			}
		}

		for (const it of parsed) {
			if (!it.product_id || !it.qty) continue;
			const { data: product } = await supabase
				.from('products')
				.select('id, name, image_url, price, slug')
				.eq('id', it.product_id)
				.maybeSingle();
			if (!product) continue;

			items.push({
				id: product.id,
				name: product.name,
				image_url: product.image_url,
				price: Number(product.price),
				qty: it.qty,
				slug: product.slug ?? undefined
			});
		}
		fromCart = true;
	}

	const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
	return { items, total, fromCart, addresses };
};

//  ACTIONS 
export const actions: Actions = {
	default: async (event) => {
		const supabase = createSupabaseServerClient(event);
		const user = event.locals.session?.user;
		if (!user) throw redirect(303, '/login');

		const formData = await event.request.formData();
		const items: Array<{ id: string; name: string; price: number; qty: number }> = JSON.parse(
			formData.get('items') as string
		);
		const total = parseFloat(formData.get('total') as string);
		const addressId = formData.get('address_id') as string;
		const slug = formData.get('slug') as string; // <-- baru
		const qty = formData.get('qty') as string;   //

		// order record 
		const orderId = crypto.randomUUID(); // PK (uuid)
		const orderNumber = `order-${Date.now()}`; // nomor untuk Midtrans (text)

		const { data: order, error: orderErr } = await supabase
			.from('orders')
			.insert({
				id: orderId,
				user_id: user.id,
				order_id: orderNumber,
				total_amount: total,
				status: 'pending',
				currency: 'IDR',
				payment_type: 'midtrans',
				address_id: addressId
			})
			.eq('order_id', orderId)
			.select()
			.single();

		if (orderErr || !order) {
			console.error(' Supabase order insert error:', orderErr);
			throw error(500, 'Gagal membuat order');
		}

		// insert order_items 
		for (const item of items) {
			await supabase.from('order_items').insert({
				order_id: orderId,
				product_id: item.id,
				quantity: item.qty,
				price_at_purchase: item.price
			});
		}

		//  parameter Midtrans  
		const itemDetails = items.map((it) => ({
			id: it.id,
			price: it.price,
			quantity: it.qty,
			name: it.name.slice(0, 50) // potong nama 
		}));
		const grossAmount = itemDetails.reduce((s, it) => s + it.price * it.quantity, 0);

		const midtransUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions'; 
		const serverKey = MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			console.error('MIDTRANS_SERVER_KEY tidak ditemukan di .env');
			throw error(500, 'Konfigurasi Midtrans tidak lengkap');
		}

		
		const finishUrl = `${event.url.origin}/checkout/success?orderId=${orderNumber}`;

		const response = await fetch(midtransUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + btoa(serverKey + ':')
			},
			body: JSON.stringify({
				transaction_details: {
					order_id: orderNumber,
					gross_amount: grossAmount
				},
				customer_details: { email: user.email },
				item_details: itemDetails,
				callbacks: {
					finish: finishUrl,
					unfinish: `${event.url.origin}/checkout/failed`,
					error: `${event.url.origin}/checkout/error`
				}
			})
		});

		const raw = await response.text();

		let midtransData;
		try {
			midtransData = JSON.parse(raw);
		} catch (e) {
			console.error('Gagal parse JSON:', e);
			throw error(500, 'Response Midtrans tidak valid');
		}

		// cegah redirect kalau gagal  
		if (!response.ok || !midtransData?.redirect_url) {
			console.error('Midtrans error:', midtransData);
			const params = slug && qty ? `?slug=${encodeURIComponent(slug)}&qty=${qty}` : '';
			throw redirect(
				303,
				`/checkout/error${params}&order_id=${orderNumber}&status_message=${
					midtransData?.error_messages?.join(', ') || 'Gagal membuat token pembayaran'
				}`
			);
		}

		// simpan payment_id & redirect 
		await supabase
			.from('orders')
			.update({ payment_id: midtransData.transaction_id })
			.eq('id', orderId);

			
		try{
			for (const item of items) {
				const { error: rpcErr } = await supabase.rpc('decrement_stock', {
					pid: item.id,
					qty: item.qty
				});
				if (rpcErr) throw rpcErr;
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			console.error('Gagal kurangi stok', e);
			await supabase.from('orders')
			.delete()
			.eq('id', orderId);

			throw error(409, e.message || 'Stok tidak cukup')
		}
		console.log('Will redirect to SNAP:', midtransData.redirect_url);
		throw redirect(303, midtransData.redirect_url);
	}
};
