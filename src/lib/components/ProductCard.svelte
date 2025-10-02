<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Product {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        rating?: number;
        sold?: number;
    }

    let { products }: {products: Product} = $props()
</script>

<a href={`/product/${products.id}`} class="product-card my-2">
    <div class="card-image-container">
        <img src={products.imageUrl} alt={products.name} class="card-image"/>
    </div>
    <div class="p-2">
        <h3 class="font-light text-base m=0">{products.name}</h3>
        <p class="card-price">Rp{products.price}</p>
        <div class="flex py-0.5 pl-0 items-center"> 
            <Icon icon="meteocons:star-fill" width="28" height="28" />
            <p class="text-base">{products.rating ?? 0}</p>
            <Icon icon="mdi:dot" width="16" height="16" />
            <p class="text-base">{products.sold ?? 0} terjual</p>
        </div>
    </div>
</a>

<style>
    .product-card {
        border: 1px solid #ccc;
        width: 200px;
        height: 300px;
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.2 ease;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
    }

    .product-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-price {
        font-size: 1.125rem;
        color: #555;
        font-weight: 700;
    }

    .card-image-container {
        width: 100%;
        min-height: 180px;
        max-height: 180px;
        position: relative;
        overflow: hidden;
    }

    .card-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }

    .card-image-container img {
        margin: 0;
        padding: 0;
    }
</style>