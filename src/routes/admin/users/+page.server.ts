// src/routes/admin/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const load: PageServerLoad = async (event) => {
    const supabase = createSupabaseServerClient(event);

    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

    // console.log('Supabase client created?', !!supabase);
    // const { data: { user } } = await supabase.auth.getUser();
    // console.log('Logged in as:', user?.id);

    if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Gagal memuat data pengguna');
    }

    return {users:  users ?? [] };
};
