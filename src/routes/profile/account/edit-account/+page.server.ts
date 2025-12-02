import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const load: PageServerLoad = async (event) => {
  const supabase = createSupabaseServerClient(event);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect(303, '/login');
  }

  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', user.id)
    .single();

  if (profileErr) {
    console.error('Error fetching profile:', profileErr);
    return { userProfile: null, error: 'Gagal memuat data profil' };
  }

  return { userProfile: profile };
};

export const actions: Actions = {
  default: async (event) => {
    const supabase = createSupabaseServerClient(event);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return fail(401, { error: 'Anda harus login.' });
    }

    const form = await event.request.formData();
    const name = (form.get('name') as string | null) ?? '';
    const newPassword = (form.get('password-confirmation') as string | null) ?? '';

    if (!name) {
      return fail(400, { error: 'Nama wajib diisi.' });
    }

    // Update nama di public.users
    const { error: updateProfileErr } = await supabase
      .from('users')
      .update({ name })
      .eq('id', user.id);

    if (updateProfileErr) {
      console.error('Update profile failed:', updateProfileErr);
      return fail(500, { error: 'Gagal memperbarui profil.' });
    }

    // 2) Jika ada password baru → update password di Auth
    if (newPassword) {
      const { error: authErr } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (authErr) {
        console.error('Update auth failed:', authErr);
        return fail(500, { error: 'Gagal memperbarui sandi.' });
      }
      // await supabase.auth.signOut();

      return { success: true, message: 'Profil & sandi berhasil diperbarui.' };
    }

    // Hanya update nama
    return { success: true, message: 'Profil berhasil diperbarui.' };
  }
};
