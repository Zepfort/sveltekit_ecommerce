import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });
  
  if ('suppressGetSessionWarning' in event.locals.supabase.auth) {
  // @ts-expect-error — internal flag
  event.locals.supabase.auth.suppressGetSessionWarning = true;
}

  event.locals.safeGetSession = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    if (error || !user) {
      return { session: null, user: null };
    }
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    // if (!session) {
    //   return { session: null, user: null };
    // }
    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  const pathname = event.url.pathname;

  // /admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!session || !user) {
      throw redirect(303, '/login');
    }
    // cek role dari public.users
    const { data: profile, error: profileError } = await event.locals.supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || profile.role !== 'admin') {
      throw redirect(303, '/login');
    }
  } else {
    // route non admin
    if (session && user) {
      // cek role
      const { data: profile, error: profileError } = await event.locals.supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role?.toLowerCase() ?? 'customer';
      if (role === 'admin') {
        if (!pathname.startsWith('/admin')) {
          throw redirect(303, '/admin/dashboard');
        }
      }
    }
  }

  return resolve(event);
};

export const handle: Handle = sequence(supabaseHandle, authGuard);
