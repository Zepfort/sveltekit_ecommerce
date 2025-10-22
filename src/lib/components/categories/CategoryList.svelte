<script lang="ts">
  import type { Category } from '$lib/types/category';

  const { mainCategories, onHover, onSelect } = $props<{
    mainCategories: Category[];
    onHover: (id: string) => void;
    onSelect: (slug: string) => void;
  }>();
</script>

<ul class="space-y-2">
  {#each mainCategories as cat}
    <li>
      <a
        href={`/product/category/${cat.slug}`}
        class="block px-3 py-1 text-sm font-semibold rounded hover:bg-gray-200 transition"
        onmouseenter={() => onHover(cat.id)}
      >
        {cat.name}
      </a>
    </li>
  {/each}
</ul>


