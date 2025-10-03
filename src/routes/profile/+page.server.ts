// src/routes/profile/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = locals;

  if (!session || !user) {
    throw redirect(303, '/login');
  }

  // Ambil profil dari tabel users
  const { data: userProfile, error } = await locals.supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetch userProfile:', error);
    return {
      status: 500,
      error: new Error('Gagal memuat profil')
    };
  }

  return {
    userProfile: {
    id: userProfile.id,
    name: userProfile.name,
    email: userProfile.email,
    created_at: userProfile.created_at  // pastikan ini
  }
  };
};
