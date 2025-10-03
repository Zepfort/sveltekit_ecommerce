<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
  import { supabase } from '$lib/supabaseClient'
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { page } from '$app/state';
  import { invalidate } from '$app/navigation'

  let { data, children } = $props()
  // console.log('layout data:', data);
  let { session, user, } = $derived(data)
  

  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })
    return () => data.subscription.unsubscribe()
  })
  
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.url.pathname.startsWith('/login') || page.url.pathname.startsWith('/register') || page.url.pathname.startsWith('/profile') || page.url.pathname.startsWith('/admin')}

<div class="flex justify-center items-center h-screen">
	{@render children?.()}
</div>
{:else}
<div class="flex flex-col min-h-screen">
  <header class="sticky top-0 left-0 w-full z-50">
    <Navbar data={data} />
  </header>
  <main class="flex flex-grow pt-8 pb-16">
   {@render children?.()}  
  </main>
  <footer class="">
    <Footer />
  </footer>
</div>
{/if}

