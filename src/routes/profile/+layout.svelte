<svelte:options runes={true} />

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { userProfile: { id: string; name: string; email: string; created_at: string } }; children?: Snippet } = $props();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Logout gagal:', error);
		} else {
			goto('/login');
		}
	}
</script>

<div class="flex min-h-screen w-full bg-gray-50">
	<!-- Sidebar -->
	<aside class="fixed flex h-screen w-72 flex-col bg-gray-950 text-white">
		<div class="border-b border-gray-800 p-6">
			<div class="flex items-center space-x-3">
				<Icon icon="mdi:account-circle" width="48" height="48" class="text-gray-400" />
				<div>
					<p class="font-semibold">{data.userProfile.name}</p>
					<p class="text-sm text-gray-400">{data.userProfile.email}</p>
				</div>
			</div>
		</div>

		<nav class="flex-1 space-y-2 p-4">
			<a
				href="/profile"
				class="flex items-center gap-3 rounded px-4 py-2 leading-none transition hover:bg-gray-800"
			>
				<Icon icon="famicons:home" 
					width="20" 
					height="20" 
					inline={true} 
					class="mr-3 align-middle inline-flex" />
				<span class="text-center">Profile</span>
			</a>

			<a
				href="/profile/address"
				class="flex items-center gap-3 rounded px-4 py-2 transition hover:bg-gray-800"
			>
				<Icon
					icon="mdi:map-marker-outline"
					width="20"
					height="20"
					inline={true}
					class="mr-3 align-middle inline-flex"
				/>
				<span>Alamat Saya</span>
			</a>

			<a href="/" class="flex items-center gap-3 rounded px-4 py-2 transition hover:bg-gray-800">
				<Icon
					icon="pajamas:go-back"
					width="20"
					height="20"
					inline={true}
					class="mr-3 align-middle inline-flex"
				/>
				<span>Kembali</span>
			</a>

			<button
				type="button"
				onclick={handleLogout}
				class="flex w-full items-center gap-3 rounded px-4 py-2 text-left transition hover:bg-gray-800"
			>
				<Icon icon="mdi:logout" width="20" height="20" />
				<span>Log Out</span>
			</button>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 p-8">
		{@render children?.()}
	</main>
</div>

<style></style>
