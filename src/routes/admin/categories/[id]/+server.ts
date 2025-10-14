import { createSupabaseServerClient } from '$lib/supabaseServer';
import {json,type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const { id } = event.params;

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });

  return new Response(JSON.stringify({ success: true, message: 'Category deleted successfully' }));
};

export const PATCH: RequestHandler = async (event) => {
  const supabase = createSupabaseServerClient(event);
  const { id } = event.params;
  const body = await event.request.json();

  const { name, slug, description, is_active } = body;

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      slug,
      description,
      is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return json({ success: false, message: error.message }, { status: 400 });
  }

  return json({ success: true, message: 'Category updated successfully' });
};
