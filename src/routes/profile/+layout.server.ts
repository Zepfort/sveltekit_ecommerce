import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = locals;
  if (!session || !user) {
    throw redirect(303, '/login');
  }

  const { data: userProfile, error } = await locals.supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('id', user.id)
    .single();

  if (error || !userProfile) {
    console.error('Error fetch userProfile:', error);
    throw redirect(303, '/login');
  }

  return {
    userProfile
  };
};
