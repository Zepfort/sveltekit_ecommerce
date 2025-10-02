import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  // Ambil produk dari view atau dari tabel produk + kategori
  const { data: products, error } = await supabase
    .from('products_with_category')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
  }

  return {
    products: products ?? []
  };
};
