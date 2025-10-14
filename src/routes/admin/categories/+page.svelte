<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import '$lib/style/utils.css';

	type Category = {
		id: string; // uuid
		name: string;
		slug?: string | null;
		description?: string | null;
		parent_id?: string | null;
		parent?: string | null; // nama parent (bukan kolom DB, untuk tampilan)
		is_active?: boolean;
		order_index?: number;
		created_at?: string;
		updated_at?: string;
	};

	let categories = $state<Category[]>([]);
	let showModal = $state(false);

	let newDescription = $state('');
	let newSlug = $state('');
	let newName = $state('');
	let newParentId = $state<string | null>(null);
	let newIsActive = $state(true);
	let formError = $state<string | null>(null);
	let saving = $state(false);

	function slugify(s: string) {
		return s
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
	}

	// load categories
	async function loadCategories() {
		const { data, error } = await supabase
		.from('categories')
		.select('id, name, parent_id, is_active, slug')
		.order('name')
		if (error) {
			console.log('fethc catergories error:',  error)
			return;
		}
		if (!data) {
			categories = []
			return;
		}

		// build map id -> name untuk resolve parent name
		const map = Object.fromEntries(data.map((d: any) => [d.id, d]));

		categories = data.map((d: any) => ({
			id: d.id,
			name: d.name,
			slug: d.slug ?? null,
			description: d.description ?? null,
			parent_id: d.parent_id ?? null,
			parent: d.parent_id ? (map[d.parent_id]?.name ?? d.parent_id) : null,
			is_active: d.is_active ?? false
		}));
	}

	onMount(loadCategories);
	
	function handleAddCategory() {
		showModal = true;
		newSlug = '';
		formError = '';
		newName = '';
		newDescription = '';
		newIsActive = true;
		newParentId = null;
	}

	function handleEdit(id: string) {
		const c = categories.find((x) => x.id === id);
		if (!c) return;
		newName = c.name,
		newSlug = c.slug ?? '',
		newDescription = c.description ?? '',
		newParentId = c.parent_id ?? null;
		newIsActive = !!c.is_active;
		showModal = true;
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure to delete this?')) return;
		const res = await fetch(`/admin/categories/${id}`, {
			method: 'DELETE'
		});
		const result = await res.json();

		if(!res.ok) {
			alert('Gagal menghapus: ' + result.message);
			return;
		}
		alert('Kategori berhasil dhapus')
		await loadCategories();
	}

	async function saveCategory() {
		formError = '';
		if (!newName.trim()) {
			formError = 'Need New Name categoriy ';
			return;
		}

		saving = true;

		// Slug otomatis
		const slugValue = newSlug?.trim() ? slugify(newSlug) : slugify(newName);

		// cek uniq slug (simple client-side check)
		const { data: existing } = await supabase
      		.from('categories')
      		.select('id')
     		.eq('slug', slugValue)
      		.limit(1)
      		.maybeSingle();

    	if (existing) {
      	formError = 'Slug has been used, please change';
      	saving = false;
      	return;
    	}

		const payload = {
      		name: newName.trim(),
      		slug: slugValue,
      		description: newDescription ? newDescription.trim() : null,
      		parent_id: newParentId || null,
      		is_active: newIsActive,
      		order_index: 0
		}

		const { data: inserted, error } = await supabase
      		.from('categories')
      		.insert(payload)
      		.select() 
      		.single();

		if (error) {
      		console.error('insert category error', error);
      		formError = error.message ?? 'Failed to save category';
      		saving = false;
      		return;
    	}

		await loadCategories();

		// reset pop up
    	showModal = false;
    	saving = false;
	}

	
</script>

<section class="space-y-6">
	<h2 class="text-2xl font-bold text-slate-900">Product Categories</h2>

	<div class="mb-4 flex items-center justify-between">
		<button
			onclick={handleAddCategory}
			class="col-bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-lg shadow transition"
		>
			<Icon icon="mdi:plus" width="20" height="20" /> New Category
		</button>

		<button class="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200">
			Sort categories alphabetically
		</button>
	</div>

	<!-- Modal  -->
	{#if showModal}
		<div class="col-bg-admin-opa fixed inset-0 z-50 flex items-center justify-center">
			<form onsubmit={saveCategory} class="w-full flex justify-center">
				<div class="relative mx-4 w-full max-w-md rounded-lg bg-white p-6">
					<button
						type= "button"
						onclick={() => (showModal = false)}
						class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
					>
						&times;
					</button>
					<h2 class="col-text-black mb-4 text-xl font-semibold">New Category</h2>

					<div class="space-y-4">
						<!-- Name -->
						<div>
							<label for="category-name" class="col-text-black mb-1 block">Category name</label>
							<input
								name="category-name"
								type="text"
								bind:value={newName}
								class="w-full rounded border px-3 py-2"
								placeholder="Category name"
							/>
						</div>
						<!-- Slug -->
						<div>
							<label for="slug-name" class="col-text-black mb-1 block">Slug</label>
							<input
								name="slug-name"
								type="text"
								bind:value={newSlug}
								class="w-full rounded border px-3 py-2"
								placeholder="Slug-category"
							/>
						</div>
						<!-- Description -->
						<div>
							<label for="description" class="col-text-black mb-1 block">Description</label>
							<textarea
								name="description"
								bind:value={newDescription}
								class="w-full rounded border px-3 py-2"
								placeholder="Description (optional)"
							></textarea>
						</div>
						<div>
							<label for="parent-category-name" class="col-text-black mb-1 block"
								>Parent Category (optional)</label
							>
							<select
								name="parent-category-name"
								bind:value={newParentId}
								class="w-full rounded border px-3 py-2"
							>
								<option value="">-- Choose Parent --</option>
								{#each categories as pc}
									<option value={pc.id}>{pc.name}</option>
								{/each}
							</select>
						</div>

						{#if formError}
							<div class="text-sm text-red-600">{formError}</div>
						{/if}

						<div class="mt-4 flex justify-end gap-2">
							<button
								onclick={() => (showModal = false)}
								class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Cancel</button
							>
							<button 
								type="submit"
								onclick={saveCategory} 
								class="col-bg-primary rounded px-4 py-2 text-white"
								disabled = {saving}
							>
								{#if saving}Saving...{:else}Save{/if}	
							</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg bg-white shadow">
		<table class="w-full border-collapse">
			<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
				<tr>
					<th class="px-4 py-3 text-left">Category Name</th>
					<th class="px-4 py-3 text-left">Parent Category</th>
					<th class="px-4 py-3 text-center">Move</th>
					<th class="px-4 py-3 text-center">Active</th>
					<th class="px-4 py-3 text-center">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each categories as c (c.id)}
					<tr class="transition hover:bg-gray-50">
						<td
							class="col-text-black cursor-pointer px-4 py-3 text-base font-medium hover:underline"
							>{c.name}</td
						>
						<td class="col-text-primary px-4 py-3 text-base font-medium">{c.parent ?? '-'}</td>
						<td class="px-4 py-3 text-center">
							<div class="flex justify-center gap-2">
								<button class="rounded bg-blue-500 p-1.5 text-white transition hover:bg-blue-600">
									<Icon icon="mdi:arrow-up" width="18" height="18" />
								</button>
								<button class="rounded bg-blue-500 p-1.5 text-white transition hover:bg-blue-600">
									<Icon icon="mdi:arrow-down" width="18" height="18" />
								</button>
							</div>
						</td>
						<td class="px-4 py-3 text-center">
							{#if c.is_active}
								<Icon icon="mdi:check" class="text-green-600" width="20" height="20" />
							{:else}
								<Icon icon="mdi:close" class="text-red-500" width="20" height="20" />
							{/if}
						</td>
						<td class="px-4 py-3 text-center">
							<div class="flex justify-center gap-2">
								<button
									onclick={() => handleEdit(c.id)}
									class="rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
								>
									<Icon icon="mdi:pencil" width="18" height="18" />
								</button>
								<button
									onclick={() => handleDelete(c.id)}
									class="rounded bg-rose-500 p-2 text-white transition hover:bg-rose-600"
								>
									<Icon icon="mdi:trash-can" width="18" height="18" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6 flex items-center justify-between">
		<button
			class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition hover:bg-gray-200"
		>
			<Icon icon="mdi:cog-outline" width="20" height="20" /> Manage Categories
		</button>
	</div>
</section>
