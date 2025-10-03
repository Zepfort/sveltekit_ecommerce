<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
    import "/src/lib/style/utils.css"

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Logout gagal:', error);
		} else {
			goto('/login');
		}
	}

	export let data: {
		userProfile: { id: string; name?: string; email?: string; created_at: string };
	};

    function formatDate(date: any) {
        return date.slice(0, 10);
    }

</script>

<div class="flex h-full w-full">
	<!-- Sidebar -->
	<aside class="w-64 border-r bg-gray-950">
		<div class="p-6">
			<div class="flex items-center space-x-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-950">
					<Icon icon="mdi:account-circle" width="48" height="48" color="#6b7280" />
				</div>
				<div>
					<div class="font-semibold col-text-white">{data.userProfile.name}</div>
					<div class="text-sm col-text-white">{data.userProfile.email}</div>
				</div>
			</div>
		</div>

		<nav class="mt-8">
			<ul>
				<li>
					<a href="/" class="flex w-full items-center rounded px-6 py-2 text-left col-bg-admin">
						<Icon icon="mdi:home-outline" width="24" height="24" class="mr-3 inline-flex align-middle" inline={true} style="vertical-align: -.40em" />
                        
						<span class=" leading-none">Home</span>
					</a>
				</li>
				<li class="mt-2">
					<button
						type="button"
						on:click={handleLogout}
						class="flex w-full items-center rounded px-6 py-2 text-left col-bg-admin"
					>
						<Icon icon="mdi:logout" width="20" height="20" class="mr-3" />
						<span>Log Out</span>
					</button>
				</li>
			</ul>
		</nav>
	</aside>

	<!-- Konten utama -->
	<main class="flex-grow p-6">
		<h1 class="mb-4 text-2xl font-bold">Profil Saya</h1>

		<div class="space-y-4 rounded bg-white p-6 shadow">
			<div class="flex items-center space-x-4">
				<div class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
					<Icon
						icon="material-symbols:account-circle"
						width="102"
						height="102"
						class="text-gray-500"
					/>
				</div>
				<div>
					<h2 class="text-xl font-semibold">{data.userProfile.name}</h2>
					<p class="text-gray-600">{data.userProfile.email}</p>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="flex items-center space-x-2">
					<Icon icon="mdi:calendar" width="20" height="20" class="text-gray-500" />
					<span>
                        Bergabung: {formatDate(data.userProfile.created_at)}</span
					>
				</div>
				<div class="flex items-center space-x-2">
					<Icon icon="mdi:email-outline" width="20" height="20" class="text-gray-500" />
					<span>Email terverifikasi: Tidak</span>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.h-full {
		height: 100%;
	}
</style>
