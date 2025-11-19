<script lang="ts">
	import { goto } from "$app/navigation";
  import { page } from '$app/stores';
  import { onMount } from "svelte";

  let { orderId, errorMessage } = $props() as {
    orderId?: string;
    errorMessage?: string;
  };

  let slug = $page.url.searchParams.get('slug');
  let qty = $page.url.searchParams.get('qty');

  let redirect: { slug?: string; qty?: number } = {};
	onMount(() => {
		const raw = sessionStorage.getItem('checkoutRedirect');
		if (raw) redirect = JSON.parse(raw);
	});

	function goToCheckout() {
		if (redirect.slug && redirect.qty) {
			goto(`/checkout?slug=${encodeURIComponent(redirect.slug)}&qty=${redirect.qty}`);
		} else {
			goto('/checkout'); 
		}
		sessionStorage.removeItem('checkoutRedirect'); // bersihkan
	}

  const waNumber = '6285641133135'; 
  const waText = $derived(`Halo RenzMart, saya butuh bantuan untuk order ${orderId} :)`);
  const waLink = $derived(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`);
</script>

<section class="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
  <div class="max-w-md w-full bg-[#FAFAFA] rounded-lg shadow-lg p-8 text-center">
    <h1 class="text-2xl font-semibold text-red-700 mb-4">Pembayaran Gagal</h1>
    <div class="my-4">
      {#if orderId}
      <p>Nomor Order: <strong>{orderId}</strong></p>
    {/if}
    {#if errorMessage}
      <p>{errorMessage}</p>
    {:else}
      <p>Pembayaran ditolak. Periksa kembali data kartu atau gunakan metode lain.</p>
    {/if}
    </div>
    <div class="flex flex-col gap-4 space-x-4">
      <button 
        class="px-6 py-2 w-full bg-[#0443F2] text-white rounded hover:bg-[#0433C2] transition"
        onclick={goToCheckout}
      >
        Kembali ke Checkout
      </button>
       <div class="rounded border border-[#0443F2] px-6 py-2 text-[#0433C2] transition hover:bg-blue-50">
      Butuh bantuan? <a href='{waLink}'
      target="_blank" rel="noopener noreferrer"
       >
      Anda butuh bantuan?
    </a>
    </div>
    </div>
  </div>
</section>
