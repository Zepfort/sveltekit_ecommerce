<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
   export let data: {
    category?: { name?: string; description: string };
    products?: Array<{ id: string; name: string; price: number; slug: string; image_url: string; rating?: number; sold?: number }>;
  };
</script>

<section class="flex flex-col items-center w-full">
  <div class="w-full md:container flex flex-col items-center sm:px-4 md:px-16 lg:px-20 xl:px-24">
    <h1 class="text-2xl font-bold mb-2">{data.category?.name}</h1>
    <p class="text-gray-600 mb-6">{data.category?.description}</p>
  
    {#if data.products?.length}
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {#each data.products as product}
          <ProductCard {product} />
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 italic">Belum ada produk di kategori ini.</p>
    {/if}
  </div>
</section>
