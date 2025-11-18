<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	// ambil data & form dari props
	let { data, form } = $props<import('./$types').PageProps>();

	// state UI
	let categories = $state(data.categories ?? []);
	let showModal = $state(false);
	let isEditMode = $state(false);
	let editId = $state<string | null>(null);

	let newName = $state('');
	let newSlug = $state('');
	let newDescription = $state('');
	let newParentId = $state<string | null>(null);
	let newIsActive = $state(true);

	let showDeleteModal = $state(false);
	let selectedDeleteId = $state<string | null>(null);
	let selectedDeleteName = $state('');

	let showFeedback = $state(false);
	let feedbackMessage = $state('');

	type Category = {
		id: string;
		name: string;
		slug?: string | null;
		description?: string | null;
		parent_id?: string | null;
		is_active?: boolean;
	};

	// buka modal tambah
	function handleAdd() {
		showModal = true;
		isEditMode = false;
		editId = null;
		newName = '';
		newSlug = '';
		newDescription = '';
		newParentId = null;
		newIsActive = true;
	}

	// buka modal edit
	function handleEdit(cat: Category) {
		showModal = true;
		isEditMode = true;
		editId = cat.id;
		newName = cat.name;
		newSlug = cat.slug ?? '';
		newDescription = cat.description ?? '';
		newParentId = cat.parent_id ?? null;
		newIsActive = !!cat.is_active;
	}

	// buka confirm delete
	function confirmDelete(cat: Category) {
		showDeleteModal = true;
		selectedDeleteId = cat.id;
		selectedDeleteName = cat.name;
	}

	// action selesai untuk form create / update
	const handleSave: SubmitFunction = async ({ formData, action, result, update }) => {
		await update();
		if (result.type === 'success') {
			feedbackMessage = result.data?.message ?? 'Saved';
			showFeedback = true;
			showModal = false;
			location.reload(); // atau invalidateAll()
		} else {
			feedbackMessage = result.data?.message ?? 'Failed to save';
			showFeedback = true;
		}
	};

	// delete konfirmasi
	async function handleDeleteConfirmed() {
		const formData = new FormData();
		formData.set('id', selectedDeleteId!);

		const res = await fetch('?/delete', { method: 'POST', body: formData });
		const result = await res.json();

		showDeleteModal = false;

		feedbackMessage = result.message ?? (res.ok ? 'Deleted' : 'Error deleting');
		showFeedback = true;

		// reload data
		location.reload();
	}
</script>

<section class="space-y-6 pt-12">
	<h2 class="text-2xl font-bold">Kategori Produk</h2>

	<button
		class="flex cursor-pointer items-center gap-2 rounded-sm px-8 py-2 text-sm font-semibold bg-[#0443F2] text-gray-200 hover:bg-[#0433C2]"
		onclick={handleAdd}
	>
		<Icon icon="mdi:plus" width="20" height="20" /> Tambah Kategori
	</button>

	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				class="absolute inset-0 bg-slate-950/40"
				onclick={() => (showModal = false)}
				aria-label="Close modal"
			>
			</button>
			<div class="fixed inset-0 z-50 flex items-center justify-center">
				<form
					method="POST"
					use:enhance={handleSave}
					action={isEditMode ? '?/update' : '?/create'}
					class="relative w-96 rounded-lg bg-gray-50 p-6 shadow-lg"
				>
					<h3 class="mb-4 text-lg font-semibold">{isEditMode ? 'Edit Kategori' : 'Kategori Baru'}</h3>
					{#if isEditMode}
						<input type="hidden" name="id" value={editId} />
					{/if}
	
					<div class="space-y-4">
						<div >
							<label for="name" class="block text-sm font-medium pb-1">Nama<span class="text-red-700">*</span></label>
							<input
								name="name"
								bind:value={newName}
								required
								class="w-full rounded border px-3 py-2"
								placeholder="Nama produk"
							/>
						</div>
	
						<div>
							<label for="slug" class="block text-sm font-medium pb-1">Slug<span class="text-red-700">*</span></label>
							<input 
								name="slug" 
								bind:value={newSlug} 
								class="w-full rounded border px-3 py-2" 
								required
								placeholder="slug-kategori"/>
						</div>
	
						<div>
							<label for="description" class="block text-sm font-medium pb-1">Deskripsi<span class="text-red-700">*</span></label>
							<textarea
								name="description"
								bind:value={newDescription}
								class="w-full rounded border px-3 py-2"
								placeholder="Deskripsi kategori"
							></textarea>
						</div>
	
						<div>
							<label for="parent_id" class="block text-sm font-medium pb-1">Parent Category<span class="text-red-700">*</span></label>
							<select
								name="parent_id"
								bind:value={newParentId}
								class="w-full rounded border px-3 py-2"
							>
								<option value="">-- None --</option>
								{#each categories as c}
									<option value={c.id}>{c.name}</option>
								{/each}
							</select>
						</div>
	
						<div class="flex items-center gap-2">
							<input type="checkbox" name="is_active" checked={newIsActive} />
							<label for="" class="text-sm">Active</label>
						</div>
					</div>
	
					<div class="mt-4 flex justify-end gap-2">
						<button
							type="button"
							onclick={() => (showModal = false)}
							class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
						>
							Batal
						</button>
						<button
							type="submit"
							onclick={() => (showModal = false)}
							class="rounded bg-[#0443F2] px-4 py-2 text-gray-200 hover:bg-[#0433C2]"
						>
							Simpan
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if showDeleteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				class="absolute inset-0 bg-slate-950/40"
				onclick={() => (showDeleteModal = false)}
				aria-label="Close modal"
			>
			</button>
		</div>
	{/if}

	{#if showDeleteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40">
			<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow">	
					<h3 class="mb-2 text-lg font-semibold">Hapus Kategori</h3>
					<p class="mb-0.5 text-gray-700">Apa Anda yakin hapus kategori <strong class="text-red-700">{selectedDeleteName}</strong>?</p>
					<p class="mb-6 text-gray-700">Tindakan ini tidak bisa dibatalkan</p>
					<div class="flex justify-end gap-2">
						<button
							onclick={() => (showDeleteModal = false)}
							class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
						>
							Batal
						</button>
						<button
							onclick={handleDeleteConfirmed}
							class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						>
							Hapus
						</button>
					</div>
				</div>		
		</div>
	{/if}

	{#if showFeedback}
		<div class="fixed right-4 bottom-4 rounded bg-white px-4 py-2 shadow-lg">
			<p>{feedbackMessage}</p>
		</div>
	{/if}

	<div class="mt-4 overflow-x-auto rounded bg-white shadow">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-100">
				<tr>
					<th class="px-4 py-2 text-left text-sm font-bold text-gray-900 uppercase">Nama</th>
					<th class="px-4 py-2 text-left text-sm font-bold text-gray-900 uppercase"
						>Induk Kategori</th
					>
					<th class="px-4 py-2 text-center text-sm font-bold text-gray-900 uppercase">Aktif</th>
					<th class="px-4 py-2 text-center text-sm font-bold text-gray-900 uppercase">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide divide-y">
				{#each categories as c (c.id)}
					<tr class="hover:bg-gray-50 border-b-gray-200">
						<td class="px-4 py-3">{c.name}</td>
						<td class="px-4 py-3 text-blue-700">{c.parent ?? '-'}</td>
						<td class="px-4 py-3 text-center">
							{#if c.is_active}
								<span class="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Active</span>
							{:else}
								<span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Inactive</span>
							{/if}
						</td>
						<td class="space-x-2 px-4 py-2 text-center">
							<button
								onclick={() => handleEdit(c)}
								class="rounded bg-[#0443F2] px-2 py-2 text-white hover:bg-[#0433C2]"
							>
								<Icon icon="mdi:pencil" width="18" height="18" />
							</button>
							<button
								onclick={() => confirmDelete(c)}
								class="rounded bg-rose-500 px-2 py-2 text-white hover:bg-rose-600"
							>
								<Icon icon="mdi:trash-can" width="18" height="18" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
