<script lang="ts">

  let { error = 'Terjadi kesalahan saat proses pembayaran. Silakan coba lagi atau hubungi layanan pelanggan.' } = $props();
  
  function goToCheckout() {
    location.href = '/checkout';
  }

  function contactSupport() {
    window.location.href = 'mailto:support@yourdomain.com';
  }
</script>

<section class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
  <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 class="text-2xl font-semibold text-red-600 mb-4">Pembayaran Gagal</h1>
    <p class="text-gray-700 mb-6">{error}</p>
    <div class="space-x-4">
      <button 
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onclick={goToCheckout}
      >
        Kembali ke Checkout
      </button>
      <button 
        class="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
        onclick={contactSupport}
      >
        Hubungi Layanan Pelanggan
      </button>
    </div>
  </div>
</section>

<style>
</style>
