import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

type Category = { id: string; name: string };

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { supabase, safeGetSession } = locals;

  // Jika ada parameter `code`, tukar menjadi session (OAuth / PKCE flow)
  const code = url.searchParams.get('code');
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
      throw redirect(303, url.pathname);
    } catch (err) {
      console.error('Error saat exchangeCodeForSession:', err);
    }
  }

  const { session } = await safeGetSession();
  const user = session?.user ?? null;

  let userProfile = null;

  // query untuk autentikasi
  if (session && user) {
    const { data: profile, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error mengambil profile:', error);
    } else {
      userProfile = profile;
    }
  }

  // query untuk categories 
  let categories: Category[] = [];
  try {
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (catError) throw catError;
    categories = catData ?? [];
  } catch (err) {
    console.error('Error mengambil categories:', err);
  }

  return {
    session,
    user,
    userProfile,
    categories 
  };
};
