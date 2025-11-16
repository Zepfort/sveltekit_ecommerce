// src/routes/checkout/success/+page.server.ts
import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';
import type { Address } from '$lib/types/address';

export const load: PageServerLoad = async (event) => {
  const { url } = event;
  const orderId = url.searchParams.get('orderId');
  if (!orderId) throw error(400, 'Missing orderId');
  
  const supabase = createSupabaseServerClient(event);

  const { data: order, error: err } = await supabase
    .from('orders')
    .select(`
      order_id, 
      total_amount, 
      payment_type, 
      updated_at, 
      order_items (
        quantity, 
        price_at_purchase, 
        products (name)), 
      address:addresses!address_id(*)
    `)
    .eq('order_id', orderId)
    .single();

  if (err || !order) throw error(404, 'Order not found');
  
  // const addr = (order.address as any[]) ?? []; 
  const addr = order.address as unknown as Address | null;
  
  return {
    orderId: order.order_id,
    total: Number(order.total_amount),
    paidAt: new Date(order.updated_at).toLocaleString('id-ID'),
    paymentType: order.payment_type ?? '-',
    items: order.order_items.map((oi: any) => ({
      name: oi.products?.name ?? 'Produk tidak tersedia',
      qty: oi.quantity,
      price: Number(oi.price_at_purchase),
      subtotal: Number(oi.quantity) * Number(oi.price_at_purchase),
    })),
     address: addr,
  };


};