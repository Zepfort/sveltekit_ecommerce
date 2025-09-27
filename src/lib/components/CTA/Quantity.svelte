<script lang="ts">
  import { selectedQuantity } from '$lib/stores/selectedQuantity';
  import type { Product } from '$lib/types/Product';
  import Icon from "@iconify/svelte";

  let { product, quantity = $bindable(1) }: { product: Product; quantity: number } = $props();

  // State lokal untuk menampilkan dan mengubah
  let qty = $state(quantity);

  // Subscribe ke store, agar jika store berubah (misalnya dari luar), qty ikut berubah
  const unsubscribe = selectedQuantity.subscribe((v) => {
    // hanya sinkronisasi jika berbeda
    if (v !== qty) {
      qty = v;
    }
  });

  // Efek: ketika qty berubah, kita sinkron ke store dan ke parent melalui bind
  $effect(() => {
    // sinkron ke store
    selectedQuantity.set(qty);
    quantity = qty;
  });

  function increment() {
    qty = Math.min(qty + 1, 99);
  }

  function decrement() {
    qty = Math.max(qty - 1, 1);
  }

  // optional cleanup
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="flex items-center justify-center border-[1px] border-gray-300 rounded-lg h-8 w-28 select-none">
  <button
    onclick={decrement}
    disabled={qty <= 1}
    class="flex flex-1 h-full rounded-l-lg items-center justify-center
           text-xl font-light text-gray-700
           hover:bg-gray-200 active:bg-gray-300
           disabled:text-gray-400 disabled:cursor-not-allowed
           transition"
  >
    <Icon icon="ic:baseline-minus" width="20" height="20" />
  </button>
  <span class="px-4 text-sm font-medium text-gray-900 tabular-nums">
    {qty}
  </span>
  <button
    onclick={increment}
    class="flex flex-1 h-full rounded-r-lg items-center justify-center
           text-xl font-light text-gray-700
           hover:bg-gray-200 active:bg-gray-300
           transition"
  >
    <Icon icon="ic:baseline-plus" width="20" height="20" />
  </button>
</div>
