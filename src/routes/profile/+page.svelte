<script lang="ts">
	import Icon from '@iconify/svelte';
	import '/src/lib/style/utils.css';
	interface Props {
    data: {
      userProfile: {
        id: string;
        name?: string;
        email?: string;
        created_at: string;
		provinsi?: string;
        kabupaten_kota?: string;
        kecamatan?: string;
        desa_kelurahan?: string;
        alamat_jalan?: string;
        kode_pos?: string;
      };
    };
  }

  	let { data }: Props = $props();
	let showModalDelete = $state(false)

	function formatDate(date: any) {
		return date.slice(0, 10);
	}
</script>

<section class="w-full h-screen bg-white sm:p-6 md:p-8 lg:ml-64 shadow-md">
	<h1 class="mb-4 text-xl sm:text-2xl font-bold text-center lg:text-left">Profil Saya</h1>

	<div class="space-y-4">
		<!-- Profil -->
		<div class="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 text-center sm:text-left">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 mx-auto sm:mx-0">
				<Icon icon="material-symbols:account-circle" width="80" height="80" class="text-gray-500" />
			</div>
			<div class="mt-3 sm:mt-0 ml-3">
				<h2 class="text-lg font-semibold">{data.userProfile.name}</h2>
				<p class="text-gray-600">{data.userProfile.email}</p>
			</div>
		</div>

		<!-- Info dasar -->
		<div class="grid grid-cols-1 gap-4 pt-4 border-t">
			<h1 class="text-2xl font-semibold text-gray-950">Informasi Umum</h1>
			<div class="flex items-center space-x-2 leading-none justify-center md:justify-start">
				<Icon icon="mdi:calendar" width="20" height="20" class="text-gray-500" />
				<span>Bergabung: {formatDate(data.userProfile.created_at)}</span>
			</div>
		</div>

		<!-- Alamat -->
		<div class="p-6 max-w-[20rem] border-2 border-blue-400 text-center md:text-left rounded-lg bg-blue-50">
			<h3 class="text-lg font-semibold mb-2">Alamat</h3>
			{#if data.userProfile.alamat_jalan}
			<div class="py-3">
				<p>{data.userProfile.alamat_jalan}, {data.userProfile.desa_kelurahan}</p>
				<p>{data.userProfile.kecamatan}, {data.userProfile.kabupaten_kota}</p>
				<p>{data.userProfile.provinsi} {data.userProfile.kode_pos}</p>
			</div>
			<div class="flex flex-col w-full gap-3">
				<a href="/profile/address" class="flex text-center border-2 bg-blue-100 font-normal text-blue-900 border-blue-700 rounded-sm py-1.5 px-8 ">
					Ubah Alamat
				</a>
				<button 
					type="button"
					onclick={() =>  showModalDelete = true}
					class="flex justify-center border-2 bg-red-100 border-red-700 font-normal text-red-900 rounded-sm py-1.5 px-8 cursor-pointer">
						Hapus Alamat
				</button>
			</div>
			{:else}
				<p class="text-gray-500 italic mb-3">Belum mengisi alamat.</p>
				<a href="/profile/address" class="flex text-center border-2 text-blue-900 border-blue-500 rounded-sm py-1.5 px-8 ">
				Tambah Alamat
				</a>
			{/if}

			<!-- Modal Konfirmasi -->
			 {#if showModalDelete}
			 <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
				<div class="w-full max-w-sm rounded-sm bg-white p-6 shadow-lg">
					<h3 class="mb-4 text-lg font-semibold">Hapus Alamat</h3>
					<p class="mb-6 text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>

					<div class="flex justify-end gap-2">
						<button type="button"
							onclick={() => showModalDelete = false}
							class="rounded-sm bg-gray-200 py-1.5 px-4 hover:bg-gray-300">
							Batal
						</button>

						<form method="POST" action="?/delete">
							<input type="text" class="hidden">
							<button type="submit"
									class="rounded-sm bg-red-500 px-4 py-1.5 text-white hover:bg-rose-600">
								Hapus
							</button>
						</form>
					</div>
				</div>
			 </div>
			 {/if}
		</div>
	</div>
</section>


<style>
</style>
