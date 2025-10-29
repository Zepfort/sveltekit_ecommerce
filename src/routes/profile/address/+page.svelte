<script lang="ts">
  // Props dengan runes mode
  interface Props {
    data: {
      address: {
        provinsi?: string;
        kabupaten_kota?: string;
        kecamatan?: string;
        desa_kelurahan?: string;
        alamat_jalan?: string;
        kode_pos?: string;
      } | null;
    };
  }
  let { data }: Props = $props();

  // Jika data.address null, kita inisialisasi form kosong
  let form = {
    provinsi: data.address?.provinsi ?? '',
    kabupaten_kota: data.address?.kabupaten_kota ?? '',
    kecamatan: data.address?.kecamatan ?? '',
    desa_kelurahan: data.address?.desa_kelurahan ?? '',
    alamat_jalan: data.address?.alamat_jalan ?? '',
    kode_pos: data.address?.kode_pos ?? ''
  };
</script>

<section class="space-y-6 bg-white p-6  ">
    <div class="ml-72">
        <h1 class="mb-6 text-2xl font-semibold text-gray-800 border-b pb-4">Alamat Saya</h1>
      
        <form method="post" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label for="provinsi" class="text-sm font-medium text-gray-700 mb-1">Provinsi</label>
            <input
              id="provinsi"
              name="provinsi"
              type="text"
              bind:value={form.provinsi}
              placeholder="Contoh: Daerah Istimewa Yogyakarta"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="flex flex-col">
            <label for="kabupaten_kota" class="text-sm font-medium text-gray-700 mb-1">Kabupaten / Kota</label>
            <input
              id="kabupaten_kota"
              name="kabupaten_kota"
              type="text"
              bind:value={form.kabupaten_kota}
              placeholder="Contoh: Sleman"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="flex flex-col">
            <label for="kecamatan" class="text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
            <input
              id="kecamatan"
              name="kecamatan"
              type="text"
              bind:value={form.kecamatan}
              placeholder="Contoh: Depok"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="flex flex-col">
            <label for="desa_kelurahan" class="text-sm font-medium text-gray-700 mb-1">Desa / Kelurahan</label>
            <input
              id="desa_kelurahan"
              name="desa_kelurahan"
              type="text"
              bind:value={form.desa_kelurahan}
              placeholder="Contoh: Condongcatur"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="md:col-span-2 flex flex-col">
            <label for="alamat_jalan" class="text-sm font-medium text-gray-700 mb-1">Alamat Jalan</label>
            <input
              id="alamat_jalan"
              name="alamat_jalan"
              type="text"
              bind:value={form.alamat_jalan}
              placeholder="Contoh: Jl. Affandi No. 23"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="md:col-span-2 flex flex-col">
            <label for="kode_pos" class="text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
            <input
              id="kode_pos"
              name="kode_pos"
              type="text"
              bind:value={form.kode_pos}
              placeholder="Contoh: 55281"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
      
          <div class="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              class="px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
            >
              {data.address ? 'Perbarui Alamat' : 'Tambah Alamat'}
            </button>
          </div>
        </form>
    </div>
</section>
