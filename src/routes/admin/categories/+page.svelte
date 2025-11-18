<!-- /admin/categories/+page.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data, form }: PageProps = $props();

	let categories = $derived(data.categories ?? []);

	/* ---------- UI state ---------- */
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
	let showFeedbackModal = $state(false);
	/* ---------- UI state ---------- */

	function showModalFeedback(msg: string) {
		feedbackMessage = msg;
		showFeedbackModal = true;
	}

	/* ---------- modal ---------- */
	function handleAdd() {
		isEditMode = false;
		editId = null;
		newName = '';
		newSlug = '';
		newDescription = '';
		newParentId = null;
		newIsActive = true;
		showModal = true;
	}
	function handleEdit(cat: (typeof categories)[0]) {
		isEditMode = true;
		editId = cat.id;
		newName = cat.name;
		newSlug = cat.slug ?? '';
		newDescription = cat.description ?? '';
		newParentId = cat.parent_id ?? null;
		newIsActive = !!cat.is_active;
		showModal = true;
	}
	function confirmDelete(cat: (typeof categories)[0]) {
		selectedDeleteId = cat.id;
		selectedDeleteName = cat.name;
		showDeleteModal = true;
	}

	const handleSave: SubmitFunction =
		() =>
		async ({ result, update }) => {
			await update({ reset: false, invalidateAll: true }); // reload data
			if (result.type === 'success') {
				showModal = false;
				showModalFeedback(result.data?.message ?? 'Tersimpan');
			} else if (result.type === 'failure') {
				showModalFeedback(result.data?.message ?? 'Gagal menyimpan');
			}
			showModal = false;
		};

	const handleDelete: SubmitFunction =
		() =>
		async ({ result, update }) => {
			await update({ reset: false, invalidateAll: true });
			showDeleteModal = false;
			selectedDeleteId = null;
			showModalFeedback(result.type === 'success' ? 'Kategori berhasilterhapus' : 'Gagal menghapus');
		};
</script>

<section class="space-y-6 pt-12">
	<h2 class="text-2xl font-bold">Kategori Produk</h2>

	<button
		onclick={handleAdd}
		class="flex items-center gap-2 rounded-sm bg-[#0443F2] px-8 py-2 text-sm font-semibold text-gray-200 hover:bg-[#0433C2]"
	>
		<Icon icon="mdi:plus" width="20" height="20" /> Tambah Kategori
	</button>

	<!-- Modal Tambah/Edit -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				class="absolute inset-0 bg-slate-950/40"
				onclick={() => (showModal = false)}
				aria-label="Close modal"
			></button>
			<form
				method="POST"
				use:enhance={handleSave}
				action={isEditMode ? '?/update' : '?/create'}
				class="relative w-96 rounded-lg bg-gray-50 p-6 shadow-lg"
			>
				{#if isEditMode}<input type="hidden" name="id" value={editId!} />{/if}

				<div class="space-y-4">
					<h3 class="mb-4 text-lg font-semibold">
						{isEditMode ? 'Edit Kategori' : 'Kategori Baru'}
					</h3>
					{#if isEditMode}
						<input type="hidden" name="id" value={editId} />
					{/if}

					<div class="space-y-4">
						<div>
							<label for="name" class="block pb-1 text-sm font-medium"
								>Nama<span class="text-red-700">*</span></label
							>
							<input
								name="name"
								bind:value={newName}
								required
								class="w-full rounded border px-3 py-2"
								placeholder="Nama produk"
							/>
						</div>

						<div>
							<label for="slug" class="block pb-1 text-sm font-medium"
								>Slug<span class="text-red-700">*</span></label
							>
							<input
								name="slug"
								bind:value={newSlug}
								class="w-full rounded border px-3 py-2"
								required
								placeholder="slug-kategori"
							/>
						</div>

						<div>
							<label for="description" class="block pb-1 text-sm font-medium"
								>Deskripsi<span class="text-red-700">*</span></label
							>
							<textarea
								name="description"
								bind:value={newDescription}
								class="w-full rounded border px-3 py-2"
								placeholder="Deskripsi kategori"
							></textarea>
						</div>

						<div>
							<label for="parent_id" class="block pb-1 text-sm font-medium"
								>Parent Category</label
							>
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
							<input type="checkbox" name="is_active" value="true" bind:checked={newIsActive} />
							<label for="" class="text-sm">Active</label>
						</div>
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
						class="rounded bg-[#0443F2] px-4 py-2 text-gray-200 hover:bg-[#0433C2]"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Modal Hapus -->
	{#if showDeleteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40">
			<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow">
				<h3 class="mb-2 text-lg font-semibold">Hapus Kategori</h3>
				<p class="mb-0.5 text-gray-700">
					Yakin hapus <strong class="text-red-700">{selectedDeleteName}</strong>?
				</p>
				<p class="mb-6 text-gray-700">Tindakan ini tidak bisa dibatalkan.</p>

				<div class="flex justify-end gap-2">
					<button
						onclick={() => (showDeleteModal = false)}
						class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
					>
						Batal
					</button>
					<form method="POST" action="?/delete" use:enhance={handleDelete}>
						<input type="hidden" name="id" value={selectedDeleteId ?? ''} />
						<button type="submit" class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
							Hapus
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Modal Feedback -->
	{#if showFeedbackModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div class="w-[380px] rounded-lg bg-white p-6 text-center shadow-lg">
				<h2 class="mb-2 text-lg font-semibold text-green-600">Berhasil!</h2>
				<p class="mb-4 text-gray-700">{feedbackMessage}</p>
				<button
					class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					onclick={() => (showFeedbackModal = false)}
				>
					Oke
				</button>
			</div>
		</div>
	{/if}

	<!-- Tabel -->
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
					<tr class="border-b-gray-200 hover:bg-gray-50">
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
