<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

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
			goto('/checkout'); // fallback keranjang
		}
		sessionStorage.removeItem('checkoutRedirect'); // bersihkan
	}

	const waNumber = '6285641133135';
	const waText = $derived(`Halo ReznMart, saya butuh bantuan untuk order ${orderId} :)`);
	const waLink = $derived(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`);
</script>

<svelte:head>
  <title>Pembayaran Error</title>
</svelte:head>

<section class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100">
	<div class="bg-[#FAFAFA]rounded-lg w-full max-w-md p-8 text-center shadow-lg">
		<h1 class="mb-4 text-2xl font-semibold text-red-600">Maaf, terjadi Gangguan Teknis.</h1>
		<p class="mb-1 text-gray-700">Ulangi lagi setelah beberap waktu</p>
		<p class="mb-6 text-gray-700">{errorMessage}</p>
		<div class="flex flex-col gap-4 space-x-4">
			<button
				class="w-full rounded bg-[#0443F2] px-6 py-2 text-gray-200 transition hover:bg-[#0433C2]"
				onclick={goToCheckout}
			>
				Kembali ke Checkout
			</button>
			<div
				class="rounded border border-[#0443F2] px-6 py-2 text-[#0433C2] transition hover:bg-blue-50"
			>
				<a href={waLink} target="_blank" rel="noopener noreferrer"> Anda butuh bantuan? </a>
			</div>
		</div>
	</div>
</section>

<style>
</style>
