<script lang="ts">
	import ProductCard from '../ProductCard.svelte';
	import HeroSection from '../HeroSection.svelte';

	import type { ProductListItem } from '$lib/types/product';

	export let products: ProductListItem[];
</script>

<div class="container mx-0 flex flex-col items-center sm:px-4 md:px-16 lg:px-20 xl:px-24">
	<div class="z-1">
		<HeroSection />
	</div>
	<div class="flex w-full py-2 pl-2">
		<h1 class="text-2xl font-bold text-gray-950">For You</h1>
	</div>
	<div class="product-list grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
		{#each products as p}
			<ProductCard
				product={{
					id: p.id,
					name: p.name,
					slug: p.slug,
					price: p.price,
					image_url: p.image_url, // sudah sesuai tipe
					rating: p.rating ?? 0,
					sold: p.sold ?? 0
				}}
			/>
		{/each}
	</div>
</div>

<style>
	.product-list {
		padding: 0.5rem;
	}
</style>
