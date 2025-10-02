import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  // Ambil daftar produk
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, price, stock, image_url, is_active, category_id')
    .order('created_at', { ascending: false });

  if (prodErr) {
    console.error('Error fetching products:', prodErr.message);
    // fallback ke array kosong agar UI tidak crash
  }

  // Ambil daftar kategori
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (catErr) {
    console.error('Error fetching categories:', catErr.message);
  }

  return {
    products: products ?? [],
    categories: categories ?? []
  };
};

export const actions: Actions = {
  default: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const fd = await event.request.formData();

    const name = String(fd.get('name') ?? '').trim();
    const description = String(fd.get('description') ?? '').trim();
    const price = Number(fd.get('price')) || 0;
    const stock = Number(fd.get('stock')) || 0;
    const category_id = String(fd.get('category_id') ?? '');
    const is_active = fd.get('is_active') === 'true';
    const image = fd.get('image') as File | null;

    // Validasi awal
    if (!name || price <= 0 || !category_id) {
      return fail(400, { message: 'Name, price, dan category wajib diisi' });
    }
    if (!image) {
      return fail(400, { message: 'Gambar produk harus diupload' });
    }

    // Buat slug sederhana
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Upload ke storage
    const fileExt = image.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image, { upsert: true });

    if (uploadError) {
      return fail(400, { message: 'Gagal upload gambar: ' + uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const image_url = publicUrlData.publicUrl;

    // Insert ke tabel products
    const { error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        stock,
        category_id,
        image_url,
        is_active
      });

    if (insertError) {
      return fail(400, { message: insertError.message });
    }

    // Setelah sukses, kita bisa “redirect” ke halaman produk agar load() dipanggil ulang
    throw redirect(303, '/admin/products');
  }
};
