<script lang="ts">
  import AddToCartButton from "../CTA/AddToCartButton.svelte";
  import BuyButton from "../CTA/BuyButton.svelte";
  import Quantity from "../CTA/Quantity.svelte";
  import type { Product } from '$lib/types/product';
  import { cart, updateCartItem } from '$lib/stores/cart';

  let { product, quantity = $bindable(1) }: { product: Product; quantity?: number } = $props();
  let qty = $state(quantity);
  let cartItemId: string | null = null;

  let firstSync = true;

  cart.subscribe((items) => {
  const it = items.find(i => i.product_id === product.id);
   if (it) qty = it.qty;
    firstSync = false; // hanya sync sekali di awal
  }
);

  function handleQtyChange(event: CustomEvent<{ qty: number }>) {
    const newQty = event.detail.qty;
    qty = newQty;
    if (cartItemId) {
      updateCartItem(cartItemId, newQty);
    }
  }

  let subtotal = $derived(product ? product.price * qty : 0);
</script>

{#if product}
<div class="flex flex-col gap-2 sm:w-[8rem] md:w-[12rem] lg:w-[16rem]">
  <div class="flex flex-row items-center py-0.5 gap-6">
    <Quantity {product} quantity={quantity} on:change={handleQtyChange} />
    <p class="text-lg font-normal text-gray-700">
      Stok: <span class="text-lg font-semibold text-gray-950">{product.stock}</span>
    </p>
  </div>

  <p class="text-lg font-normal text-gray-700 py-0.5">
    Subtotal:
    <span class="text-2xl font-semibold text-gray-950">
      Rp{subtotal.toLocaleString('id-ID')}
    </span>
  </p>

  <AddToCartButton {product} qty={qty} />
  <BuyButton {product} qty={qty}/>
</div>
{:else}
<p class="text-gray-500">Memuat produk...</p>
{/if}
