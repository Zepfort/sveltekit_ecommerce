<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { ProductListItem } from "$lib/types/product";
  export let product: ProductListItem;
</script>

<a
  href={`/product/${product.slug}`}
  class="product-card my-2 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
>
  <!-- GAMBAR -->
  <div class="relative w-full shrink-0">
    <img
      src={product.image_url}
      alt={product.name}
      class="h-32 w-full object-contain object-center md:h-40"
    />
  </div>

  <!-- KONTEN -->
  <div class="flex flex-1 flex-col justify-between p-3">
    <h3 class="line-clamp-2 text-sm font-light text-gray-800 md:text-base">
      {product.name}
    </h3>

    <div class="mt-2">
      <p class="text-lg font-bold text-gray-900 md:text-xl">
        Rp{product.price.toLocaleString('id-ID')}
      </p>

      <!-- Rating & terjual -->
      <div class="mt-1 flex items-center gap-1 text-xs text-gray-600 md:text-sm">
        <Icon icon="meteocons:star-fill" class="text-yellow-400" width="16" height="16" />
        <span>{product.rating ?? 0}</span>
        <Icon icon="mdi:dot" width="12" height="12" />
        <span>{product.sold ?? 0} terjual</span>
      </div>
    </div>
  </div>
</a>

<style>
  /* jika belum ada utility line-clamp */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>