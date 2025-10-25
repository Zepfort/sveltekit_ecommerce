import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  // baca query parameters (opsional)
  const url = event.url;
  const slug = url.searchParams.get('slug');
  const qtyParam = url.searchParams.get('qty');
  const qty = qtyParam ? parseInt(qtyParam) : 1;

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
        // convert price jika perlu
        price: typeof data.price === 'number' ? data.price : parseFloat(data.price ),
        qty
      }
    ];
  } else {
    // mode keranjang: kita harus dapat data keranjang dari client side atau session/cookie
    // Karena store `cart` di client, tidak langsung bisa di server side
    // Salah satu cara: kamu bisa membuat API atau endpoint untuk kirim data cart ke server
    // Untuk contoh, kita redirect ke homepage / error atau kosong
    // Bisa juga abort jika keranjang kosong
    // Berikut contoh redirect jika tidak ada slug dan tidak ada keranjang
    // (kamu sesuaikan berdasarkan implementasimu)
    // return { items: [] }
  }

  // hitung total
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return {
    items,
    total
  };
};
