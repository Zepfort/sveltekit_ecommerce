import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  // Ambil data produk dari view
  const { data: productsRaw, error } = await supabase
    .from('products_with_category')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
  }

  const products = [];

  for (const row of productsRaw ?? []) {
    //  RPC untuk total sold
    const { data: soldCount, error: soldError } = await supabase.rpc(
      'get_product_sold',
      { product_uuid: row.id }
    );

    if (soldError) {
      console.error('Error RPC get_product_sold:', soldError.message);
    }

    products.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: typeof row.price === 'number' ? row.price : parseFloat(row.price),
      image_url: row.image_url ?? '',
      rating: row.rating ?? 0,
      sold: soldCount ?? 0 // ← hasil RPC
    });
  }

  return {
    products
  };
};
