import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = locals;
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { data: userAddress, error } = await locals.supabase
    .from('users')
    .select('provinsi, kabupaten_kota, kecamatan, desa_kelurahan, alamat_jalan, kode_pos')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetch userAddress:', error);
  }

  return { 
    address: userAddress
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = locals;
    const formData = await request.formData();
    const provinsi = formData.get('provinsi')?.toString() || null;
    const kabupaten_kota = formData.get('kabupaten_kota')?.toString() || null;
    const kecamatan = formData.get('kecamatan')?.toString() || null;
    const desa_kelurahan = formData.get('desa_kelurahan')?.toString() || null;
    const alamat_jalan = formData.get('alamat_jalan')?.toString() || null;
    const kode_pos = formData.get('kode_pos')?.toString() || null;

    const { error } = await locals.supabase
      .from('users')
      .update({
        provinsi,
        kabupaten_kota,
        kecamatan,
        desa_kelurahan,
        alamat_jalan,
        kode_pos
      })
      .eq('id', user?.id);

    if (error) {
      return { status: 500, error: new Error('Gagal simpan alamat') };
    }

    throw redirect(303, '/profile')
  }
};
