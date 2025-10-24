<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Banner1 from '../assets/Banner/Banner_1.png';
    import Banner2 from '../assets/Banner/Banner_2.png';
    import Banner3 from '../assets/Banner/Banner_3.png'
    // import Banner3 from '../assets/Banner/Banner_3.png';

    let currentImageIndex = 0;
    const images = [Banner1, Banner2, Banner3];
    let intervalId: ReturnType<typeof setInterval> | undefined;

    function changeImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    onMount(() => {
        intervalId = setInterval(changeImage, 3000); 
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<style>
    .banner-container {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .banner {
        display: flex;
        transition: transform 1s ease-in-out;
    }

    .banner img {
        min-width: 100%;
    }
</style>

<div class="banner-container">
  <div class="banner" style={currentImageIndex ? `transform: translateX(${-currentImageIndex * 100}%)` : ''}>
    {#each images as image, index}
      <img 
        src={image} 
        alt="Promo Banner" 
        class="w-[400px] h-[200px] rounded object-cover"
      />
    {/each}
  </div>
</div>
