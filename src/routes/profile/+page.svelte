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

<section class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
	<h1 class="mb-4 text-2xl font-bold">Profil Saya</h1>

	<div class="space-y-4">
		<div class="flex items-center space-x-4">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
				<Icon icon="material-symbols:account-circle" width="80" height="80" class="text-gray-500" />
			</div>
			<div>
				<h2 class="text-lg font-semibold">{data.userProfile.name}</h2>
				<p class="text-gray-600">{data.userProfile.email}</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
			<div class="flex items-center space-x-2 leading-none">
				<Icon icon="mdi:calendar" width="20" height="20"  class="text-gray-500 " />
				<span>Bergabung: {formatDate(data.userProfile.created_at)}</span>
			</div>
			<div class="flex items-center space-x-2">
				<Icon icon="mdi:email-outline" width="20" height="20" class="text-gray-500 " />
				<span>Email terverifikasi: Tidak</span>
			</div>
		</div>

		    <div class="pt-6 border-t">
      <h3 class="text-lg font-semibold mb-2">Alamat</h3>
      {#if data.userProfile.alamat_jalan}
        <p>{data.userProfile.alamat_jalan}, {data.userProfile.desa_kelurahan}</p>
        <p>{data.userProfile.kecamatan}, {data.userProfile.kabupaten_kota}</p>
        <p>{data.userProfile.provinsi} {data.userProfile.kode_pos}</p>
      {:else}
        <p class="text-gray-500 italic">Belum mengisi alamat.</p>
      {/if}
    </div>

	</div>
</section>

<style>
</style>
