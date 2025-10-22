<!-- CategoriesModal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import CategoryList from './CategoryList.svelte';
  import SubCategoryList from './SubCategoryList.svelte';
  import type { Category } from '$lib/types/category';

  const dispatch = createEventDispatcher();
  let { 
    mainCategories, 
    subCategories,
    }: {
    mainCategories: Category[];
    subCategories: Category[];
    
  } = $props();

  let hoveredParentId = $state<string | null>(null);

  function handleHover(id: string) {
    hoveredParentId = id;
  }

  function openCategory(slug: string) {
    goto(`/product/category/${slug}`);
  }

  function openSubCategory(slug: string) {
    goto(`/product/subcategory/${slug}`);
  }

</script>

<div
  class="top-full z-50 flex "
  tabindex="0"
  aria-label="Close modal"
  role="button"
  >
  <div 
    role="button"
    tabindex="0"
    class="flex w-[60%] min-w-[40rem] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200"
    onmouseleave={() => dispatch('close')}>
    <!-- Kategori utama -->
    <div class="w-1/3 border-r max-h-[400px] overflow-y-auto bg-gray-50 p-2">
      <h2 class="mb-4 text-lg font-bold text-gray-800">Kategori</h2>
      <CategoryList {mainCategories} onHover={handleHover} onSelect={openCategory} />
    </div>

    <!-- Subkategori -->
    <div class="w-2/3 max-h-[400px] overflow-y-auto p-2">
      <h2 class="mb-4 text-lg font-bold text-gray-800">Subkategori</h2>
      <SubCategoryList {subCategories} {hoveredParentId} onSelect={openSubCategory} />
    </div>
  </div>
</div>
