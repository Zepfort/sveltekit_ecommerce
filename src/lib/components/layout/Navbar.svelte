<script lang="ts">
	import UserBadge from '../UserBadge.svelte';
	import Icon from '@iconify/svelte';
	import CartButton from '../../components/CartButton.svelte';
	import { writable } from 'svelte/store';
	import CategoriesModal from '$lib/components/categories/CategoriesModal.svelte';
	import type { Category } from '$lib/types/category';
	import { goto } from '$app/navigation';

	const showDrawer = writable(false);

	const { mainCategories, subCategories, userProfile } = $props<{
		mainCategories: Category[];
		subCategories: Category[];
		userProfile?: any;
	}>();

	const showModal = writable(false);
	let hoverTimeout: ReturnType<typeof setTimeout> | undefined;

	function handleMouseEnter() {
		clearTimeout(hoverTimeout);
		showModal.set(true);
	}

	function handleMouseLeave() {
		hoverTimeout = setTimeout(() => {
			showModal.set(false);
		}, 200);
	}

	let searchQuery = $state('');

	function handleSearch(event: Event) {
		event.preventDefault();
		const q = searchQuery.trim();
		if (q) {
			goto(`/search?q=${encodeURIComponent(q)}`);
		}
	}
</script>

<header class="sticky top-0 z-40 bg-gray-950">
  <div class="mx-auto flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">

    <!-- KIRI -->
      <!-- Logo -->
      <a href="/" class="sm:hidden md:block shrink-0 text-xl font-bold text-gray-200 lg:pl-40">
        RenzMart
      </a>

    <!-- Kategori : hanya muncul di lg+ -->
    <div class="flex justify-around gap-6">
      <button
        class="hidden lg:flex shrink-0 items-center gap-2 rounded-sm bg-[#0443F2] px-3 py-1.5 text-gray-200 hover:bg-[#0433C2]"
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        aria-label="Kategori (desktop)"
      >
        <Icon icon="mdi:menu" width="20" height="20" color="white" />
        <span class="text-sm font-semibold">Kategori</span>
      </button>
  
      <!-- TENGAH : Search  -->
      <form onsubmit={handleSearch} class="flex w-full sm:min-w-2xl sm:max-w-2xl items-center sm:flex sm:items-stretch">
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Cari produk"
          class="w-full rounded-l-sm border-none px-4 py-1.5 outline-none sm:flex-1"
        />
        <button type="submit" class="bg-[#0443F2] hover:bg-[#0433C2] text-gray-200 grid h-11 w-12 place-items-center rounded-r-sm cursor-pointer" aria-label="Cari">
          <Icon icon="mdi:magnify" width="24" height="24" color="white" />
        </button>
      </form>
    </div>

    <!-- KANAN : aksi -->
    <div class="flex shrink-0 items-center gap-2 sm:gap-6 lg:pr-40">

      <!-- Cart  -->
      <CartButton />

      <button
        class="grid h-10 w-10 place-items-center rounded-full bg-transparent hover:bg-gray-800 sm:hidden"
        aria-label="Akun"
        onclick={() => {
        }}
      >
        <Icon icon="mdi:account-circle" width="24" height="24" color="white" />
      </button>

      <div class="hidden sm:flex items-center">
        <UserBadge {userProfile} />
      </div>
    </div>
  </div>
</header>


<!-- MOBILE DRAWER  -->
{#if $showDrawer}
  <div class="fixed inset-0 z-50 md:hidden">
    <button
      type="button"
      aria-label="Tutup"
      class="absolute inset-0 m-0 border-0 bg-black/60 p-0"
      onclick={() => showDrawer.set(false)}
    ></button>

    <aside class="absolute top-0 left-0 h-full w-72 bg-gray-900 text-gray-200 shadow-2xl">
      <div class="flex items-center justify-between p-4">
        <span class="font-semibold">Menu</span>
        <button
          aria-label="Tutup"
          onclick={() => showDrawer.set(false)}
          class="grid h-10 w-10 place-items-center rounded hover:bg-gray-800"
        >
          <Icon icon="mdi:close" width="24" height="24" />
        </button>
      </div>

      <nav class="flex flex-col gap-2 px-4">
        <button
          onclick={() => {
            showModal.update((v) => !v);
            showDrawer.set(false);
          }}
          class="w-full rounded px-4 py-3 text-left hover:bg-gray-800"
        >
          Kategori
        </button>
      </nav>
    </aside>
  </div>
{/if}

<!-- DESKTOP MEGA-MENU -->
<div
  class="relative hidden md:block"
  role="region"
  aria-label="Mega menu"
  tabindex="-1"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  {#if $showModal}
    <div class="absolute top-full left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-8">
      <CategoriesModal {mainCategories} {subCategories} />
    </div>
  {/if}
</div>
