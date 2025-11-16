<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData} from './$types';
  import Icon from '@iconify/svelte';
  import type { Address } from '$lib/types/address';

  let { data }: { data: PageData } = $props();
  const { orderId, items, total, paidAt, paymentType, address } = $derived(data);

  const waNumber = '6285641133135'; 
  const waText = $derived(`Halo RenzMart, saya butuh bantuan untuk order ${orderId} :)`);
  const waLink = $derived(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`);
</script>

<svelte:head>
  <title>Pembayaran Berhasil – RenzMart</title>
  <meta name="description" content="Pembayaran Anda telah dikonfirmasi. Terima kasih telah berbelanja di RenzMart!" />
</svelte:head>

<main class="min-h-screen w-full bg-slate-50 px-4 py-6 sm:py-8">
  <div class="mx-auto max-w-2xl rounded-2xl bg-gray-50 p-5 shadow-lg sm:p-8">
    <!-- Heading -->
    <div class="mb-6 text-center">
      <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg class="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-800 sm:text-3xl">Pembayaran Berhasil</h1>
      <p class="mt-1 text-sm text-slate-500">Terima kasih telah berbelanja di RenzMart</p>
    </div>

    <!-- Ringkasan -->
    <dl class="mb-6 grid grid-cols-1 gap-3 text-sm lg:flex lg:flex-row lg:justify-between">
      <div class="flex justify-between sm:block">
        <dt class="text-slate-500">Nomor Order</dt>
        <dd class="font-semibold text-slate-900">{orderId}</dd>
      </div>
      <div class="flex justify-between sm:block">
        <dt class="text-slate-500">Waktu Bayar</dt>
        <dd class="font-semibold text-slate-900">{paidAt}</dd>
      </div>
      <div class="flex justify-between sm:block">
        <dt class="text-slate-500">Metode</dt>
        <dd class="font-semibold text-slate-900">{paymentType}</dd>
      </div>
    </dl>

    <!-- Daftar Barang -->
    <section class="mb-6">
      <h2 class="mb-3 text-sm font-semibold text-slate-700">Detail Barang</h2>
      <ul class="divide-y divide-slate-100">
        {#each items as it}
          <li class="flex  justify-between py-3">
            <div class="min-w-0">
              <p class=" font-medium text-slate-800 text-sm md:text-lg">{it.name}</p>
              <p class="text-xs text-slate-500">{it.qty} × Rp{it.price.toLocaleString('id-ID')}</p>
            </div>
            <p class="ml-4 shrink-0 font-semibold text-sm md:text-lg">Rp{it.subtotal.toLocaleString('id-ID')}</p>
          </li>
        {/each}
      </ul>
    </section>

    <div class="mb-6">
      <div class="flex text-center gap-0.5">
        <Icon icon="mdi:location" width="24" height="24" class="inline text-[#DC2626]" />
        <h2 class="mb-3 text-sm font-semibold text-slate-700">Alamat</h2>
      </div>
      {#if address}
        <p class=" font-medium text-slate-800 text-xs md:text-sm">{address.recipient} - {address.phone}</p>
        <p class=" font-medium text-slate-800 text-xs md:text-sm">{address.full_address}, {address.village}, {address.district}</p>
        <p class=" font-medium text-slate-800 text-xs md:text-sm">{address.city}, {address.province} {address.postal_code}</p>
      {:else}
        <p class="text-sm text-gray-600">Alamat tidak tersedia</p>
      {/if}
    </div>

    <!-- Total -->
    <div class="mb-6 flex items-center justify-between rounded-sm bg-slate-100 px-4 py-3">
      <span class="text-base font-medium text-slate-700">Total Pembayaran</span>
      <span class="text-xl font-bold text-[#0443F2]">Rp{total.toLocaleString('id-ID')}</span>
    </div>

    <!-- CTA -->
    <button
      onclick={() => goto('/')}
      class="w-full rounded-sm bg-[#0443F2] px-4 py-3 text-white font-semibold shadow hover:bg-[#0433C2] focus:outline-none focus:ring-2 focus:ring-[#0443F2] focus:ring-offset-2 active:bg-[#032ea8]">
      Kembali ke Beranda
    </button>

    <!-- Link bantuan -->
    <div class="mt-4 text-center text-sm text-slate-500">
      Butuh bantuan? <a href='{waLink}'
      target="_blank" rel="noopener noreferrer"
       >
      Hubungi Kami
    </a>
    </div>
  </div>
</main>