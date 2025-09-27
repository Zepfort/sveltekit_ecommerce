<script lang="ts">
  import { cart, type CartItem } from '$lib/stores/cart';
  import '/src/lib/style/utils.css'
  import type { Product } from '$lib/types/Product';

  let { product }: { product: Product } = $props();
  let loading = $state(false);

  function handleAddToCart() {
    if (!product) return;
    loading = true;
    cart.update((arr: CartItem[]) => {
      const idx = arr.findIndex((it) => it.id === product.id);
      if (idx !== -1) {
        const copy = [...arr];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      } else {
        return [...arr, { id: product.id, name: product.name, price: product.price, qty: 1 }];
      }
    });
    loading = false;
  }
</script>

<button
  onclick={handleAddToCart}
  class="flex items-center justify-center gap-2 rounded-md py-1.5 px-12 col-primary disabled:opacity-50"
  disabled={loading}
>
  {#if loading}
    Loading...
  {:else}
    +Keranjang
  {/if}
</button>
