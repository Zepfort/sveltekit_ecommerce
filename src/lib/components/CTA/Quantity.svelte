<script lang="ts">
  import type { Product } from '$lib/types/product';
  import Icon from "@iconify/svelte";
  import { createEventDispatcher, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher<{
    change: { qty: number }
  }>();

  let { product, quantity = $bindable(1) }: { product: Product; quantity: number } = $props();
  let qty = $state(quantity);

  $effect(() => {
    quantity = qty;
    dispatch('change', { qty });
  });

  function increment() {
    qty = Math.min(qty + 1, 99);
  }
  function decrement() {
    qty = Math.max(qty - 1, 1);
  }
</script>

<div class="flex items-center justify-center border-[1px] rounded-sm h-8 w-28 select-none">
  <button
    onclick={decrement}
    disabled={qty <= 1}
    class="flex flex-1 h-full rounded-l-lg border-r items-center justify-center
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
    class="flex flex-1 h-full rounded-r-lg border-l items-center justify-center
           text-xl font-light text-gray-700
           hover:bg-gray-200 active:bg-gray-300
           transition"
  >
    <Icon icon="ic:baseline-plus" width="20" height="20" />
  </button>
</div>
