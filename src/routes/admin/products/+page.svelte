<script lang="ts">
  import Icon from '@iconify/svelte';
  import { supabase } from '$lib/supabaseClient';
  import '$lib/style/utils.css';
  import { enhance } from '$app/forms';

  let { data } = $props();
  let { categories, products } = data;

  let showModal = $state(false);
  let errorMsg = $state('');
  let newName = $state('');
  let newDescription = $state('');
  let newPrice = $state('');
  let newStock = $state('');
  let newCategoryId = $state('');
  let newImageFile: File | null = $state(null);
  let newIsActive = $state(true);
  let saving = $state(false);

  function handleAddProduct() {
    showModal = true;
    errorMsg = '';
    newName = '';
    newDescription = '';
    newPrice = '';
    newStock = '';
    newCategoryId = '';
    newImageFile = null;
    newIsActive = true;
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
        <h2 class="mb-4 text-xl font-semibold text-slate-800">New Product</h2>

        <form
          method="POST"
          enctype="multipart/form-data"
          use:enhance
        >
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
                <input
                  type="number"
                  id="price"
                  name="price"
                  bind:value={newPrice}
                  class="w-full rounded border px-3 py-2"
                  placeholder="0"
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
                disabled={saving}
              >
                {#if saving}Saving...{:else}Save{/if}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <div class="overflow-x-auto rounded-lg bg-white shadow">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="px-4 py-2">IMAGE</th>
          <th class="px-4 py-2">NAME</th>
          <th class="px-4 py-2">CATEGORY</th>
          <th class="px-4 py-2">PRICE</th>
          <th class="px-4 py-2">STOCK</th>
          <th class="px-4 py-2">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {#if products.length}
          {#each products as p}
            <tr class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">
                {#if p.image_url}
                  <img src={p.image_url} alt={p.name} class="h-12 w-12 rounded object-cover" />
                {:else}
                  <span class="text-gray-400">No Image</span>
                {/if}
              </td>
              <td class="px-4 py-2">{p.name}</td>
              <td class="px-4 py-2">{p.category_id}</td>
              <td class="px-4 py-2">Rp {p.price}</td>
              <td class="px-4 py-2">{p.stock}</td>
              <td class="px-4 py-2">
                {#if p.is_active}
                  <span class="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Active</span>
                {:else}
                  <span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Inactive</span>
                {/if}
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
  </div>
</section>
