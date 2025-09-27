<script lang="ts">
    import AddToCartButton from "../CTA/AddToCartButton.svelte";
	import BuyButton from "../CTA/BuyButton.svelte";
    import Quantity from "../CTA/Quantity.svelte";
    import type { PageData } from './$types'
    
    let { data }: { data: PageData } = $props()
    const { product } = data;
    let quantity = $state(1);
</script>

<div class="flex flex-col gap-2">
    <div class="flex flex-row items-center py-0.5 gap-6">
        <Quantity {product} {quantity} />
        <p class="text-lg font-normal text-gray-700">Stok: <span class="text-2xl font-semibold text-gray-950">xxx</span></p>
    </div>
    <p class="text-lg font-normal text-gray-700 py-0.5">Subtotal: <span class="text-2xl font-semibold text-gray-950">xxx</span></p>
    <AddToCartButton {product}/>
    <BuyButton {product}/>
</div>