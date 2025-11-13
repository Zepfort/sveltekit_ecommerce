<script lang="ts">
	import { goto } from "$app/navigation";

  let { orderId, items, total, paidAt } = $props() as {
    orderId: string;
    items: { name: string; qty: number; price: number }[];
    total: number;
    paidAt: string;
  };

   total = total || 0;

   function goToHome(){
    goto('/')
   }
</script>
<section class="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
  <div class="max-w-md w-full bg-[#FAFAFA] rounded-lg shadow-lg p-8 ">
    <h1 class="text-3xl font-bold text-[#0443F2] mb-4 text-center"> Pembelian Berhasil</h1>
    <p>Nomor Order: <strong>{orderId}</strong></p>
    <p>Waktu Pembayaran: <strong>{paidAt}</strong></p>
  
    <div class="mt-6">
      {#each items as item}
        <div class="flex justify-between py-2 border-b border-[#ebe9e9]">
          <span class="font-medium">{item.name}</span>
          <span>×{item.qty}</span>
          <span>Rp{item.price.toLocaleString()}</span>
        </div>
      {/each}
    </div>
  
    <div class="mt-6 flex justify-between text-xl font-bold">
      <span>Total:</span>
      <span class="text-[#0443F2]">Rp{total.toLocaleString()}</span>
    </div>
  
    <button 
      onclick={goToHome}
      class="w-full mt-8 px-6 py-3 bg-[#0443F2] text-[#FAFAFA] rounded-sm hover:bg-[#0433C2]">Kembali ke Beranda</button>
  </div>
</section>
