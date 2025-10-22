<script lang="ts">
	import Button from '../Button.svelte';
	import UserBadge from '../UserBadge.svelte';
	import Icon from '@iconify/svelte';
	import '/src/lib/style/button.css';
	import CartButton from '../../components/CartButton.svelte';
	import { writable } from 'svelte/store';
	import CategoriesModal from '$lib/components/categories/CategoriesModal.svelte';
	import type { Category } from '$lib/types/category';

	// Props
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
</script>

<!-- 🔽 Template -->
<div class="mx-auto flex w-full justify-center bg-gray-950">
	<div class="container flex items-center justify-between bg-gray-950 px-7 py-4">
		<div class="logo">
			<h1 class="text-2xl font-bold text-white">RenzMart</h1>
		</div>

			<div class="relative" role="button" tabindex="0" onmouseenter={handleMouseEnter}>
				<button
					class="col-bg-primary flex w-6 sm:w-8 lg:w-12 cursor-pointer items-center justify-center rounded-md px-12 py-1.5"
				>
					Kategori
				</button>
				{#if $showModal}
					<div
						role="button"
						tabindex="0"
						class="absolute top-16 z-50 mt-0 w-[40rem]"
						onmouseenter={handleMouseEnter}
						onmouseleave={handleMouseLeave}
					>
						<CategoriesModal {mainCategories} {subCategories} />
					</div>
				{/if}
			</div>

		<div>
			<form>
				<div class="flex gap-0 rounded-lg bg-white">
					<input
						type="text"
						class="w-full sm:w-[70%] lg:min-w-[600px] rounded-sm border-none outline-none"
						placeholder="Cari di Renzmart"
					/>
					<button
						type="button"
						class="col-bg-primary flex w-12 cursor-pointer items-center justify-center rounded-r-sm border-none px-2"
					>
						<Icon icon="mdi:magnify" width={24} height={24} color="white" />
					</button>
				</div>
			</form>
		</div>

		<div class="flex gap-6">
			<div class="flex h-12 min-w-[40px] items-center justify-center rounded-sm hover:bg-gray-700">
				<Icon icon="mingcute:notification-line" width="24" height="24" color="white" />
			</div>
			<div class="flex h-12 min-w-[40px] items-center justify-center rounded-sm">
				<CartButton />
			</div>
		</div>

		<div class="flex gap-2">
			<UserBadge {userProfile} />
		</div>
	</div>
</div>
