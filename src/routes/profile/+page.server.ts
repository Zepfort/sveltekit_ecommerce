import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types'

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

export const actions: Actions = {
  delete: async ({locals}) => {
    const {user} = locals;

    const { error } = await locals.supabase
      .from('users')
      .update({
        provinsi: null,
        kabupaten_kota: null,
        kecamatan: null,
        desa_kelurahan: null,
        alamat_jalan: null,
        kode_pos: null
      })
      .eq('id', user?.id);

      if (error) {
        console.log('Error deleting address:', error);
        return { success: false, message: 'Gagal menghapus alamat' };
      }
      throw redirect(303,'/profile');
  }
}
