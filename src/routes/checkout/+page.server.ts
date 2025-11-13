// src/routes/checkout/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';
import { MIDTRANS_SERVER_KEY } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const url = event.url;
	const slug = url.searchParams.get('slug');
	const qtyParam = url.searchParams.get('qty');
	const qty = qtyParam ? parseInt(qtyParam) : 1;
	let fromCart = false;

	let items: Array<{ id: string; name: string; image_url: string; price: number; qty: number }> =
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
				qty
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
				.select('id, name, image_url, price')
				.eq('id', it.product_id)
				.maybeSingle();
			if (!product) continue;

			items.push({
				id: product.id,
				name: product.name,
				image_url: product.image_url,
				price: Number(product.price),
				qty: it.qty
			});
		}
		fromCart = true;
	}

	const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
	return { items, total, fromCart };
};

/* ---------- ACTIONS ---------- */
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
				payment_type: 'midtrans'
			})
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

		const midtransUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions'; // <= tanpa spasi
		const serverKey = MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			console.error('MIDTRANS_SERVER_KEY tidak ditemukan di .env');
			throw error(500, 'Konfigurasi Midtrans tidak lengkap');
		}

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
					finish: 'https://renzmart.vercel.app/checkout/success',
					unfinish: 'https://renzmart.vercel.app/checkout/failed',
					error: 'https://renzmart.vercel.app/checkout/error'
				}
			})
		});

		const raw = await response.text();
		console.log('Midtrans response status:', response.status);
		console.log('Midtrans response body:', raw);

		let midtransData;
		try {
			midtransData = JSON.parse(raw);
		} catch (e) {
			console.error('Gagal parse JSON:', e);
			throw error(500, 'Response Midtrans tidak valid');
		}

		// cegah redirect kalau gagal (A) 
		if (!response.ok || !midtransData?.redirect_url) {
			console.error('Midtrans error:', midtransData);
			throw error(
				500,
				midtransData?.error_messages?.join(', ') || 'Gagal membuat token pembayaran'
			);
		}

		// simpan payment_id & redirect 
		await supabase
			.from('orders')
			.update({ payment_id: midtransData.transaction_id })
			.eq('id', orderId);

		throw redirect(303, midtransData.redirect_url);
	}
};
