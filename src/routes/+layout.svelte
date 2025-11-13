<script lang="ts">
	import '../app.css';
  import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
  import { supabase } from '$lib/supabaseClient'
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { page } from '$app/state';
  import { invalidate } from '$app/navigation'
  import { cart } from '$lib/stores/cart';
  import { loadCart } from '$lib/stores/cart';

  type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  order_index: number | null;
  is_active: boolean;
};

  let { data = {}, children } = $props<{
    data: {
      session: any;
      user: any;
      userProfile: any;
      mainCategories: Category[];
      subCategories: Category[];
    };
    children: any;
  }>();

  let { session, user, mainCategories = [], subCategories = [] } = $derived(data)
  
  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })
    return () => data.subscription.unsubscribe()
  })

   onMount(() => {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      loadCart();
    } else {
      cart.set([]);
    }
  });

  // Jika session.user sudah ada, langsung load
  if (session?.user) {
    loadCart();
  }

  return () => listener?.subscription.unsubscribe();
});
  
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if 
  page.url.pathname.startsWith('/login') || 
  page.url.pathname.startsWith('/register') || 
  page.url.pathname.startsWith('/profile') || 
  page.url.pathname.startsWith('/admin') || 
  page.url.pathname.startsWith('/checkout/error') ||
  page.url.pathname.startsWith('/checkout/success') ||
  page.url.pathname.startsWith('/checkout/failed') 
  }

<div class="flex justify-center items-center h-screen">
	{@render children?.()}
</div>
{:else}
<div class="flex flex-col min-h-screen">
  <header class="sticky top-0 left-0 w-full z-50">
    <Navbar 
    mainCategories={data.mainCategories}
	subCategories={data.subCategories}
	userProfile={data.userProfile}
  />
  </header>
  <main class="flex flex-grow pt-8 pb-12">
   {@render children?.()}  
  </main>
  <footer class="">
    <Footer />
  </footer>
</div>
{/if}

