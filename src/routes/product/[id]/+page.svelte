 <script lang="ts">
    import type { PageData } from './$types'
    import Icon from "@iconify/svelte";
    import ProductPurchase from '$lib/components/wrapper/ProductPurchase.svelte';
    import type { Product } from "$lib/data/products";

    let { data }: { data: PageData } = $props()
    
    const { product } = data;
</script>

<div class="grid grid-cols-2 gap-4 container px-32 mx-auto py-8">
    <div class="">
        <img 
            src={product.imageUrl} 
            alt={product.name} 
            class="w-full max-h-[600px] min-h-[600px} object-cover rounded-lg mb-4" />
    </div>
    <div class="w-full pl-16">
        <h1 class="text-2xl font-bold">
            {product.name}
        </h1>
        <p class="text-lg font-normal mt-2">
            <span class="font-semibold">Terjual:</span> {product.sold}+ &#x2022 {product.rating} <span class="text-gray-500">(500+ rating)</span>
        </p>
        <p class="text-4xl font-bold mt-4">
            Rp{product.price.toLocaleString('id-ID')}
        </p>
        <div class="mt-4">
            <button class="border-b-4 font-medium py-2 px-8">Detail</button>
            <!-- <button class="border-b-4 font-medium py-2 px-8">Spesifikasi</button> -->
        </div>
        <p class="text-lg font-semibold mt-2">
            <span class="font-normal">Kondisi:</span>  {product.condition}
        </p>
        <p class="text-lg font-semibold mt-0.5">
            <span class="font-normal">Minimal Pesan: </span> {product.min_order}
        </p>
        <p class="text-lg font-normal mt-4 text-justify">
            {product.description}
        </p>
        <div class="mt-4">
            <h2 class="text-2xl font-semibold">Atur Jumlah dan Catatan</h2>
            <div class="flex mt-2 items-center-safe">
                <ProductPurchase {data}/>
            </div>
        </div>
        <div class="mt-4">
            <h2 class="text-2xl font-semibold">Pengiriman</h2>
            <div class="flex mt-2 items-center-safe">
                <Icon icon="mdi:map-marker-outline" width="24" height="24" />
                <p class="font-semibold text-lg pl-2"> <span class="font-normal">Dikirim dari</span> {product.from}</p>
            </div>
        </div>
    </div>
</div>