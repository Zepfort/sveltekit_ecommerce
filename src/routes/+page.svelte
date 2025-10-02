<script lang="ts">
	import Body from '$lib/components/layout/Body.svelte';
  let { data } = $props();
  let products = data.products;
</script>

<div class="flex flex-col items-center w-full">
  <Body {products}/>
</div>


