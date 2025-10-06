<script lang="ts">
	import Icon from '@iconify/svelte';
	import '$lib/style/utils.css';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidate, invalidateAll } from '$app/navigation';
	import CurrencyInput from 'svelte-currency-input';
 

	let { data } = $props();
	let { categories } = data;

	type ProductWithCategory = {
		id: string;
		name: string;
		price: number;
		description: string | null;
		stock: number;
		image_url: string | null;
		is_active: boolean;
		category_id: string;
		category_name: string | null;
	};

	// states
	let toDeleteId = $state<String | null>(null);
	let formNode = $state<HTMLFormElement>();
	let products: ProductWithCategory[] = data.products;
	let showModal = $state(false);
	let showModalDelete = $state(false);
	let errorMsg = $state('');
	let newName = $state('');
	let newDescription = $state('');
	let newPrice = $state<number>(0);
	let newStock = $state('');
	let newCategoryId = $state('');
	let newImageFile: File | null = $state(null);
	let newIsActive = $state(true);
	let isEditing = $state(false);
	let editId = $state('');

	// Handle insert product
	function handleAddProduct() {
		showModal = true;
		errorMsg = '';
		newName = '';
		newDescription = '';
		newPrice = 0;
		newStock = '';
		newCategoryId = '';
		newImageFile = null;
		newIsActive = true;
		isEditing = false; // tambahkan ini
		editId = '';
	}

	// handle edit product
	function openEditModal(p: ProductWithCategory) {
		showModal = true;
		isEditing = true;
		editId = p.id;
		newName = p.name;
		newDescription = p.description ?? '';
		newPrice = p.price;
		newStock = String(p.stock);
		newCategoryId = p.category_id;
		newImageFile = null;
		newIsActive = p.is_active;
		errorMsg = '';
	}

	// Handle submit product
	async function handleSubmit(event: SubmitEvent) {
		event?.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const fd = new FormData(form);

		const resp = await fetch(form.action, {
			method: form.method,
			body: fd
		});

		if (resp.ok) {
			showModal = false;
			await invalidateAll();
		} else {
			const result = await resp.json().catch(() => null);
			errorMsg = result?.message ?? 'Gagal Menyimpan Produk';
		}
	}
</script>

<section class="space-y-6">
	<h2 class="text-2xl font-bold text-slate-900">Products</h2>

	<!-- Add Product -->
	<div class="mb-4 flex items-center justify-between">
		<button
			onclick={handleAddProduct}
			class="col-bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-lg shadow transition"
		>
			<Icon icon="mdi:plus" width="20" height="20" /> New Product
		</button>

		<button class="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200">
			Sort Product alphabetically
		</button>
	</div>

	{#if showModal}
		<div class="col-bg-admin-opa fixed inset-0 z-50 flex items-center justify-center">
			<div class="relative mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<button
					onclick={() => (showModal = false)}
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					&times;
				</button>
				<form
					method="POST"
					enctype="multipart/form-data"
					action={isEditing ? '?/updateProduct' : '?/createProduct'}
					onsubmit={handleSubmit}
				>
					{#if isEditing}
						<input type="hidden" name="id" value={editId} />
					{/if}
					<div class="space-y-4">
						<div>
							<label for="product_name" class="mb-1 block text-slate-700">Product Name</label>
							<input
								type="text"
								id="product_name"
								name="name"
								bind:value={newName}
								class="w-full rounded border px-3 py-2"
								placeholder="Enter product name"
								required
							/>
						</div>

						<div>
							<label for="description" class="mb-1 block text-slate-700">Description</label>
							<textarea
								id="description"
								name="description"
								bind:value={newDescription}
								class="w-full rounded border px-3 py-2"
								placeholder="Enter description"
							></textarea>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="price" class="mb-1 block text-slate-700">Price</label>
								<CurrencyInput
									symbol="Rp"
									symbolPosition="start"
									id="price"
									name="price"
									bind:value={newPrice}
									currency="IDR"
									locale="id-ID"
									inputClasses={{ formatted: "currencyInput__formatted" }}
									required
									/>
							</div>
							<div>
								<label for="stock" class="mb-1 block text-slate-700">Stock</label>
								<input
									type="number"
									id="stock"
									name="stock"
									bind:value={newStock}
									class="w-full rounded border px-3 py-2"
									placeholder="0"
									required
								/>
							</div>
						</div>

						<div>
							<label for="category" class="mb-1 block text-slate-700">Category</label>
							<select
								id="category"
								name="category_id"
								bind:value={newCategoryId}
								class="w-full rounded border px-3 py-2"
								required
							>
								<option value="">-- Choose Category --</option>
								{#each categories as c}
									<option value={c.id}>{c.name}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="image_url" class="mb-1 block text-slate-700">Image</label>
							<input
								id="image_url"
								name="image"
								type="file"
								accept="image/*"
								class="w-full rounded border px-3 py-2"
								onchange={(e) => {
									const files = (e.target as HTMLInputElement).files;
									newImageFile = files && files.length > 0 ? files[0] : null;
								}}
							/>
						</div>

						<div class="flex items-center gap-2">
							<input
								id="active"
								name="is_active"
								type="checkbox"
								value="true"
								bind:checked={newIsActive}
								class="h-4 w-4"
							/>
							<label for="active" class="text-slate-700">Active</label>
						</div>

						{#if errorMsg}
							<div class="text-sm text-red-600">{errorMsg}</div>
						{/if}

						<div class="mt-4 flex justify-end gap-2">
							<button
								type="button"
								onclick={() => (showModal = false)}
								class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							>
								{isEditing ? 'Update' : 'Save'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if showModalDelete}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-semibold">Hapus Produk</h3>
				<p class="mb-6 text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan.</p>

				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
						onclick={() => (showModalDelete = false)}>Batal</button
					>

					<!-- trigger submit via runes -->
					<button
						type="submit"
						class="rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
						onclick={(e) => {
							e.preventDefault();
							formNode?.requestSubmit();
						}}
					>
						Hapus
					</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg bg-white shadow">
		{#key data.products.length}
			<table class="min-w-full text-left text-sm">
				<thead class="bg-gray-100 text-gray-700">
					<tr>
						<th class="px-4 py-2">Image</th>
						<th class="px-4 py-2">Name</th>
						<th class="px-4 py-2">Category</th>
						<th class="px-4 py-2">Price</th>
						<th class="px-4 py-2">Stock</th>
						<th class="px-4 py-2">Status</th>
						<th class="px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if products.length}
						{#each data.products as p}
							<tr class="border-b hover:bg-gray-50">
								<td class="px-4 py-2">
									{#if p.image_url}
										<img src={p.image_url} alt={p.name} class="h-12 w-12 rounded object-cover" />
									{:else}
										<span class="text-gray-400">No Image</span>
									{/if}
								</td>
								<td class="px-4 py-2">{p.name}</td>
								<td class="px-4 py-2">{p.category_name ?? '-'}</td>
								<td class="px-4 py-2">Rp {p.price}</td>
								<td class="px-4 py-2">{p.stock}</td>
								<td class="px-4 py-2">
									{#if p.is_active}
										<span class="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Active</span
										>
									{:else}
										<span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Inactive</span>
									{/if}
								</td>
								<td class="flex items-center px-4 py-3">
									<div class="flex justify-center gap-2">
										<button
											type="button"
											onclick={() => openEditModal(p)}
											class="rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
										>
											<Icon icon="mdi:pencil" width="18" height="18" />
										</button>
										<form
											method="POST"
											action="?/deleteProduct"
											enctype="multipart/form-data"
											use:enhance={() => {
												return async ({ update }) => {
													showModalDelete = false; // tutup modal
													toDeleteId = null; // reset id
													await update(); // refresh data
												};
											}}
											bind:this={formNode}
										>
											<input type="hidden" name="id" bind:value={toDeleteId} />
											<button
												type="button"
												onclick={() => {
													toDeleteId = p.id;
													showModalDelete = true;
												}}
												class="rounded bg-rose-500 p-2 text-white hover:bg-rose-600"
											>
												<Icon icon="mdi:trash-can" width="18" height="18" />
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-2 text-gray-500">Belum ada produk.</td>
						</tr>
					{/if}
				</tbody>
			</table>
		{/key}
	</div>
</section>

<style>
	.currencyInput__formatted {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.5rem;
}
</style>
