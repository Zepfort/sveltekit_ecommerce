import { createSupabaseServerClient } from '$lib/supabaseServer';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
  const { slug } = event.params;
  const supabase = createSupabaseServerClient(event);

  // Kategori utama berdasarkan slug
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (catError || !category) {
    throw error(404, `Kategori dengan slug "${slug}" tidak ditemukan.`);
  }

  // Semua subkategori dari kategori ini
  const { data: subcategories, error: subcatError } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', category.id);

  if (subcatError) {
    console.error('Error fetching subcategories:', subcatError.message);
  }

  const categoryIds = [category.id, ...(subcategories?.map((sc) => sc.id) ?? [])];

  // Semua produk dari kategori utama dan subkategori-nya
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (prodError) {
    console.error('Error fetching products:', prodError.message);
  }

  return { category, products };
};
