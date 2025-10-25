import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const url = event.url;
  const slug = url.searchParams.get('slug');
  const qtyParam = url.searchParams.get('qty');
  const qty = qtyParam ? parseInt(qtyParam) : 1;
  let fromCart = false;

  let items: Array<{ id: string; name: string; image_url: string; price: number; qty: number }> = [];

  if (slug) {
    // mode beli langsung: fetch produk berdasarkan slug
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching product for checkout:', fetchError);
      throw error(500, 'Error fetching product');
    }
    if (!data) {
      throw error(404, 'Produk tidak ditemukan');
    }

    items = [
      {
        id: data.id,
        name: data.name,
        image_url: data.image_url,
        price: typeof data.price === 'number' ? data.price : parseFloat(data.price ),
        qty
      }
    ];
    
    fromCart = false;
  } else {
    const cookieCart = event.cookies.get('cart');
    if (!cookieCart) {
      throw redirect(302, '/');
    }

    let parsed: any;
    try{
      parsed = JSON.parse(cookieCart)
    } catch (e) {
      console.error('Invalid cart cookie:', e);
      throw redirect(302, '/');
    }

    items = parsed.map((it: any) => ({
      id: it.id,
      name: it.name,
      image_url: it.image_url,
      price: it.price,
      qty: it.qty
    }))
    fromCart = true
  }
  // hitung total
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return {
    items,
    total,
    fromCart
  };
};
