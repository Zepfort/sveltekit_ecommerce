<script lang="ts">
	import type { Category } from '$lib/types/category';

	const { subCategories, hoveredParentId, onSelect } = $props<{
		subCategories: Category[];
		hoveredParentId: string | null;
		onSelect: (slug: string) => void;
	}>();

	// Derived store: otomatis update saat salah satu dependency berubah
	const filtered = $derived.by<Category[]>(() =>
    (subCategories ?? []).filter((sub: any)  => sub.parent_id === hoveredParentId)
	);
</script>   

{#if hoveredParentId}
	<ul class="space-y-1">
		{#each filtered as sub (sub.id)}
			<li>
				<a
					href={`/product/subcategory/${sub.slug}`}
					class="block cursor-pointer px-3 py-1 font-semibold text-sm rounded hover:bg-gray-200 transition"
					onclick={(e) => {
						e.preventDefault();
						onSelect(sub.slug);
					}}
				>
					{sub.name}
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-gray-400 italic">Arahkan ke kategori untuk melihat subkategori</p>
{/if}
