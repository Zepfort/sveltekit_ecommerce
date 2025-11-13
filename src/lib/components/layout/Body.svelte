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
	<div class="flex w-full pt-16 pl-16">
		<h1 class="text-2xl font-bold text-gray-950">Produk Terbaru</h1>
	</div>
	<div class="product-list mx-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
		{#each products as p}
			<ProductCard
				product={{
					id: p.id,
					name: p.name,
					slug: p.slug,
					price: p.price,
					image_url: p.image_url, 
					sold: p.sold ?? 0
				}}
			/>
		{/each}
	</div>
</div>

<style>
	.product-list {
		padding: 1rem 0;
	}
</style>
