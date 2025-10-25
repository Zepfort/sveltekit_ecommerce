<script lang="ts">
  import Icon from '@iconify/svelte'
  export let data;
  const { items, total } = data;
</script>

<div class="container mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold mb-4">Checkout</h1>

  {#if items.length > 0}
      {#each items as it}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <!-- Kiri -->
           <div class="flex flex-col gap-4">
            <div class="flex flex-col items-start border rounded-lg shadow-md p-4">
              <h2 class="text-gray-500 text-xl font-semibold pl-1">Alamat Pengiriman</h2>
              <div class="flex pt-2 gap-1">
                <Icon icon="mdi:location" width="20" height="24"  style="color: #0443F2;"/>
                <p class="font-normal">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, accusamus?</p>
              </div>
            </div>
             <div class="flex flex-col items-center border rounded-lg shadow-md p-4">
               <img src={it.image_url} alt={it.name} class="w-full max-w-sm rounded-md object-contain">
               <h2 class="text-lg font-medium mt-4 text-center">{it.name}</h2>
               <p class="text-gray-700 text-md mt-1">Jumlah: {it.qty}</p>
             </div>
           </div>
          

          <!-- Kanan -->
           <div class="bg-gray-50 border rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
              <div>
                <h3 class="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>
                <div class="flex justify-between mb-2">
                  <span>Harga</span>
                  <span>Rp {Number(it.price).toLocaleString('id-ID')}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Jumlah</span>
                  <span>{it.qty}</span>
                </div>
                <hr class="my-4">
                <div class="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>Rp {(Number(it.price) * it.qty).toLocaleString('id-ID')}</span>
                </div>
              </div>
              <!-- Form alamat, metode pembayaran, tombol konfirmasi, dsb -->
              <button class="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg">
                Bayar Sekarang
              </button>
          
           </div>
        </div>
      {/each}
      
      
    
    
  {:else}
    <p>Keranjang kosong atau tidak ada item untuk checkout.</p>
  {/if}
</div>
