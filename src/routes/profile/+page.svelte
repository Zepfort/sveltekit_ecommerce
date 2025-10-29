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
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
			<div class="flex items-center space-x-2 leading-none justify-center md:justify-start">
				<Icon icon="mdi:calendar" width="20" height="20" class="text-gray-500" />
				<span>Bergabung: {formatDate(data.userProfile.created_at)}</span>
			</div>
		</div>

		<!-- Alamat -->
		<div class="p-6 max-w-[20rem] border-2 border-blue-500 text-center md:text-left rounded-lg bg-blue-100">
			<h3 class="text-lg font-semibold mb-2">Alamat</h3>
			{#if data.userProfile.alamat_jalan}
			<div class="py-3">
				<p>{data.userProfile.alamat_jalan}, {data.userProfile.desa_kelurahan}</p>
				<p>{data.userProfile.kecamatan}, {data.userProfile.kabupaten_kota}</p>
				<p>{data.userProfile.provinsi} {data.userProfile.kode_pos}</p>
			</div>
			<a href="/profile/address" class="flex text-center border-2 border-gray-500 rounded-sm py-1.5 px-8 ">
				Ubah Alamat
			</a>
			{:else}
				<p class="text-gray-500 italic mb-3">Belum mengisi alamat.</p>
				<a href="/profile/address" class="flex text-center border-2 border-gray-500 rounded-sm py-1.5 px-8 ">
				Tambah Alamat
				</a>
			{/if}
		</div>
	</div>
</section>


<style>
</style>
