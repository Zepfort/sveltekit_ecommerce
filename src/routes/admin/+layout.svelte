<svelte:options runes={true} />

<script lang="ts">
	import '$lib/style/utils.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Button from '$lib/components/Button.svelte';
	import Icon from '@iconify/svelte';
	import '$lib/style/utils.css';

	let { data, children } = $props();
	let { userProfile } = data;

	type IconKey = 'Dashboard' | 'Categories' | 'Product' | 'Orders' | 'Users';

	const iconPanel: Record<IconKey, { icon: string; width: number; height: number }> = {
		Dashboard: { icon: 'stash:dashboard', width: 24, height: 24 },
		Categories: { icon: 'carbon:categories', width: 24, height: 24 },
		Product: { icon: 'icon-park-outline:ad-product', width: 24, height: 24 },
		Orders: { icon: 'material-symbols:orders-outline', width: 24, height: 24 },
		Users: { icon: 'ph:users', width: 24, height: 24 }
	};

	const menu: Array<{ title: string; href: string; iconKey: IconKey }> = [
		{ title: 'Dashboard', href: '/admin/dashboard', iconKey: 'Dashboard' },
		{ title: 'kategori Produk', href: '/admin/categories', iconKey: 'Categories' },
		{ title: 'Produk', href: '/admin/products', iconKey: 'Product' },
		{ title: 'Order', href: '/admin/orders', iconKey: 'Orders' },
		{ title: 'Pengguna Terdaftar', href: '/admin/users', iconKey: 'Users' }
	];

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Logout gagal:', error);
		} else {
			goto('/login');
		}
	}
</script>

<div class="flex w-full bg-gray-50 text-gray-900">
	<!-- Sidebar -->
	<aside class="fixed flex h-screen w-72 flex-col bg-[#07071a] text-white">
		<div class="border-b border-white/6 px-6 py-5">
			<a href="/" class="flex items-center gap-3">
				<div class="text-2xl font-extrabold">RenzMart</div>
			</a>
		</div>

		<nav class="flex-1 flex-col overflow-auto px-3 py-6">
			<ul class="space-y-1">
				{#each menu as item}
					<li>
						<a href={item.href} class="col-bg-admin flex flex-row gap-3 rounded-md px-3 py-2">
							<Icon
								icon={iconPanel[item.iconKey].icon}
								width={iconPanel[item.iconKey].width}
								height={iconPanel[item.iconKey].height}
							/>
							<p class="text-sm font-medium">{item.title}</p>
						</a>
					</li>
				{/each}
			</ul>

			<div class="flex-1"></div>

			<div class="flex justify-end items-baseline mt-8">
				<button
					onclick={logout}
					class="col-bg-admin flex w-full cursor-pointer flex-row gap-1 px-4 py-2 text-left text-sm"
				>
					<Icon icon="mdi:logout" width="20" height="20" />
					Keluar
				</button>
			</div>
		</nav>

		<div class="border-t border-white/6 px-4 py-4"></div>
	</aside>

	<!-- Main content -->
	<main class="ml-72 h-screen w-full">
		<!-- topbar -->
		<header
			class="fixed right-0 left-72 flex items-center justify-between border-b border-white/6 bg-[#050417] px-6 py-3 text-white"
		>
			<div class="flex items-center gap-4">
				<div class="text-lg font-semibold">Panel Admin</div>
			</div>

			<div class="flex items-center gap-4 pr-12">
				<div class="hidden items-center gap-3 text-sm text-white/80 sm:flex">
					{#if userProfile}
						<div class="user-badge-group">
							<div class="user-info">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-full bg-[#0443F2] text-gray-200"
								>
									<Icon icon="material-symbols:person-outline" width="24" height="24" />
								</div>
								<span class="text-sm text-white">
									{userProfile?.name}
								</span>
							</div>
						</div>
					{:else}
						<div class="flex gap-2">
							<Button href="/login" isLogin={true}>Log In</Button>
							<Button href="/register">Sign Up</Button>
						</div>
					{/if}
				</div>
			</div>
		</header>

		<div class="p-6">
			{@render children?.()}
		</div>
	</main>
</div>

<style>
	.user-badge-group {
		position: relative;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}
	/* .user-dropdown {
		position: absolute;
		right: 0;
		top: 100%;
		margin-top: 0.25rem;
		width: 10rem;
		background: white;
		border-radius: 0.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		visibility: hidden;
		opacity: 0;
		transition:
			opacity 0.2s ease-in-out,
			visibility 0s linear 0.2s;
		z-index: 50;
	}
	.user-badge-group:hover .user-dropdown {
		visibility: visible;
		opacity: 1;
		transition-delay: 0s;
	} */
	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
	}
</style>
