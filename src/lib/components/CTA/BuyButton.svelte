<svelte:options runes={true} />

<script lang="ts">
  import { goto } from '$app/navigation';
  import { selectedQuantity } from '$lib/stores/selectedQuantity';
  import type { Product } from '$lib/types/Product';

  let { product }: { product: Product } = $props();

  let qty = $state(1);

  const unsubscribe = selectedQuantity.subscribe((v) => {
    qty = v;
  });

  function handleBuyNow() {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      qty
    };
    localStorage.setItem('checkout-item', JSON.stringify(item));
    goto('/checkout');
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });
</script>

<button
  class="flex w-full items-center justify-center border col-background font-semibold py-1.5 rounded-lg"
  onclick={handleBuyNow}
>
  Beli Langsung (x{qty})
</button>
