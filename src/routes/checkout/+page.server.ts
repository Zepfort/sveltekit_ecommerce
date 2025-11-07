import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const url = event.url;
	const slug = url.searchParams.get('slug');
	const qtyParam = url.searchParams.get('qty');
	const qty = qtyParam ? parseInt(qtyParam) : 1;
	let fromCart = false;

	let items: Array<{ id: string; name: string; image_url: string; price: number; qty: number }> = [];

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

// Proses ketika user klik tombol "Bayar Sekarang"
export const actions: Actions = {
	default: async (event) => {
    try {

      const supabase = createSupabaseServerClient(event);
      const user = event.locals.session?.user;
      if (!user) throw redirect(303, '/login');
  
      const formData = await event.request.formData();
      const items = JSON.parse(formData.get('items') as string);
      const total = parseFloat(formData.get('total') as string);
      console.log('Items:', items, 'Total:', total, 'User:', user.id);
  
      // Buat record orders
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          currency: 'IDR',
          payment_method: 'midtrans'
        })
        .select()
        .single();
  
      if (orderErr || !order) throw error(500, 'Gagal membuat order');
  
      // Insert ke order_items
      for (const item of items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_purchase: item.price
        });
      }
  
      // Kirim ke Midtrans (Server key disimpan di env)
      const midtransUrl = 'https://api.sandbox.midtrans.com/v1/transactions';
      const response = await fetch(midtransUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_MIDTRANS_SERVER_KEY + ':')
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: order.id,
            gross_amount: total
          },
          customer_details: {
            email: user.email
          },
          item_details: items.map((it: any) => ({
            id: it.id,
            price: it.price,
            quantity: it.qty,
            name: it.name
          }))
        })
      });
  
      const midtransData = await response.json();
      if (!response.ok) {
        console.error(midtransData);
        throw error(500, 'Gagal membuat transaksi Midtrans');
      }
  
      // Simpan payment_id (transaction_id)
      await supabase
        .from('orders')
        .update({ payment_id: midtransData.transaction_id })
        .eq('id', order.id);
  
      // Redirect ke URL pembayaran
      throw redirect(303, midtransData.redirect_url);
    } catch (err) {
       console.error('❌ error in checkout action:', err);
      throw error(500, 'Internal server error');
    }
  }
};
