<script lang="ts">
  import type { PageData } from './$types';
  import Icon from "@iconify/svelte";
  import ProductPurchase from '$lib/components/wrapper/ProductPurchase.svelte';

  let { data }: { data: PageData } = $props();
  const { product } = data;
</script>

<div class="mx-auto max-w-5xl px-4 pb-8 pt-4 md:grid md:grid-cols-2 md:gap-20 md:px-6 md:py-8 lg:px-8">
  <!-- === GAMBAR  === -->
<div class="w-full">
  <img
    src={product.image_url}
    alt={product.name}
    class="w-full max-h-[50vh] md:max-h-[600px] rounded-sm object-contain"
  />
</div>

  <!-- === INFO PRODUK === -->
  <div class="md:pl-8">
    <!-- Nama + rating -->
    <h1 class="text-xl font-bold text-gray-900 md:text-2xl">{product.name}</h1>
    <p class="mt-1 text-sm text-gray-600 md:text-base">
      Terjual {product.sold}+ • {product.rating} ⭐ (500+ rating)
    </p>

    <!-- Harga -->
    <p class="mt-3 text-2xl font-bold text-gray-900 md:text-4xl">
      Rp{product.price.toLocaleString('id-ID')}
    </p>

    <!-- Chip kondisi & min order -->
    <div class="mt-3 flex flex-wrap gap-2">
      <span class="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">Baru</span>
      <span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">Min. {product.min_order} pcs</span>
    </div>

    <!-- Garis pembatas -->
    <hr class="my-4 border-gray-200" />

    <!-- Deskripsi -->
    <details class="group" open>
      <summary class="flex cursor-pointer items-center justify-between py-2 text-sm font-semibold md:text-base">
        Deskripsi
        <Icon icon="mdi:chevron-down" width="20" class="transition group-open:rotate-180" />
      </summary>
      <p class="mt-2 text-sm text-gray-700 md:text-base">{product.description}</p>
    </details>

    <!-- Atur jumlah & catatan -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold md:text-xl">Atur Jumlah dan Catatan</h2>
      <div class="mt-2">
        <ProductPurchase {product} />
      </div>
    </div>
  </div>
</div>
