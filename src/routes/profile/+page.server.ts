import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = locals;

  if (!session || !user) {
    throw redirect(303, '/login');
  }

  // Ambil profil
  const { data: userProfile, error } = await locals.supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      created_at,
      provinsi,
      kabupaten_kota,
      kecamatan,
      desa_kelurahan,
      alamat_jalan,
      kode_pos`)
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetch userProfile:', error);
    return {
      status: 500,
      error: new Error('Gagal memuat profil')
    };
  }
   return { userProfile };
};
