// src/routes/categories/+page.server.ts
import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const { data: cats, error: err } = await supabase
    .from('categories')
    .select('id, name, slug, description, parent_id, is_active')
    .order('name', { ascending: true });

  if (err) throw error(500, 'Failed to load categories');

  // build parent map
  const map = Object.fromEntries((cats ?? []).map((c: any) => [c.id, c]));

  const categories = (cats ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    parent_id: c.parent_id,
    parent: c.parent_id ? map[c.parent_id]?.name : null,
    is_active: c.is_active
  }));

  return { categories };
};

export const actions: Actions = {
  create: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const name = String(form.get('name') ?? '').trim();
    const slug = String(form.get('slug') ?? '').trim();
    const description = String(form.get('description') ?? '').trim() || null;
    const parent_id = String(form.get('parent_id') ?? '') || null;
    const is_active = form.get('is_active') !== null;

    if (!name) {
      return { success: false, message: 'Name is required' };
    }

    const { error: insertErr } = await supabase
      .from('categories')
      .insert({ name, slug, description, parent_id, is_active, order_index: 0 });

    if (insertErr) {
      return { success: false, message: insertErr.message };
    }

    return { success: true, message: 'Kategori berhasil dibuat' };
  },

  update: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const id = String(form.get('id'));
    const name = String(form.get('name') ?? '').trim();
    const slug = String(form.get('slug') ?? '').trim();
    const description = String(form.get('description') ?? '').trim() || null;
    const parent_id = String(form.get('parent_id') ?? '') || null;
    const is_active = form.get('is_active') !== null;

    if (!id) {
      return { success: false, message: 'Category ID is required' };
    }

    const { error: updateErr } = await supabase
      .from('categories')
      .update({ name, slug, description, parent_id, is_active })
      .eq('id', id);

    if (updateErr) {
      return { success: false, message: updateErr.message };
    }

    return { success: true, message: 'Category updated' };
  },

  delete: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const form = await event.request.formData();
    const id = String(form.get('id'));

    if (!id) {
      return { success: false, message: 'Category ID is required' };
    }

    const { error: delErr } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (delErr) {
      return { success: false, message: delErr.message };
    }

    return { success: true, message: 'Category deleted' };
  }
};
