// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'

export const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

// const { data, error } = await supabase.auth.signInWithPassword({
//   email: 'adminreznMart@gmail.com',
//   password: 'Admin_ReznMart'
// });
// console.log('signIn data', data);
// console.log('signIn error', error);

// if (error) {
//   // tampilkan pesan error.text lengkap di UI
//   throw new Error(error.message || 'Sign-in failed');
// }