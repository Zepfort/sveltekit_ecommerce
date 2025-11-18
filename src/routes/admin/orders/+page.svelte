<script lang="ts" runes>
  import Icon from '@iconify/svelte';
  import { invalidate } from '$app/navigation';

  // load data 
  let { data } = $props<import('./$types').PageServerData>();

  // modal state
  let showDeleteModal = $state(false);
  let selectedDeleteId: string | null = null;
  let selectedDeleteName = $state('');
  let isProcessing = $state(false);

  // feedback modal
  let showFeedbackModal = $state(false);
  let feedbackMessage = $state('');
  let feedbackIsError = $state(false);

  // open modal 
  function openVoidModal(order: { id: string; order_id: string }) {
    selectedDeleteId = order.id;
    selectedDeleteName = order.order_id;
    showDeleteModal = true;
  }

  //  modal delete
  function closeDeleteModal() {
    showDeleteModal = false;
    selectedDeleteId = null;
    selectedDeleteName = '';
  }

  // aksi konfirmasi delete (void)
  async function handleDeleteConfirmed() {
    if (!selectedDeleteId) return;
    isProcessing = true;

    try {
      const form = new FormData();
      form.set('order_id', selectedDeleteId);

      const res = await fetch('?/void', {
        method: 'POST',
        body: form
      });

      const text = await res.text().catch(() => '');

      if (!res.ok) {
        //  error
        feedbackMessage = text || 'Gagal membatalkan order';
        feedbackIsError = true;
        showFeedbackModal = true;
      } else {
        // sukses
        feedbackMessage = 'Order berhasil dibatalkan (void).';
        feedbackIsError = false;
        showFeedbackModal = true;

        // tutup konfirmasi
        closeDeleteModal();

        // reload data
        await invalidate('/admin/orders');
      }
    } catch (e: any) {
      feedbackMessage = e?.message ?? 'Terjadi kesalahan jaringan';
      feedbackIsError = true;
      showFeedbackModal = true;
    } finally {
      isProcessing = false;
    }
  }

  // update status 
  async function updateOrderStatus(order: { id: string; status: string; fraud_status: string | null }) {
    const form = new FormData();
    form.set('order_id', order.id);
    form.set('status', order.status);
    form.set('fraud_status', order.fraud_status ?? '');

    try {
      const res = await fetch('?/updateStatus', {
        method: 'POST',
        body: form
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        feedbackMessage = text || 'Gagal update status';
        feedbackIsError = true;
        showFeedbackModal = true;
      } else {
        feedbackMessage = 'Status diperbarui.';
        feedbackIsError = false;
        showFeedbackModal = true;
        await invalidate('/admin/orders');
      }
    } catch (e: any) {
      feedbackMessage = e?.message ?? 'Terjadi kesalahan jaringan';
      feedbackIsError = true;
      showFeedbackModal = true;
    }
  }

  const statusBadge = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'void': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };
</script>

<section class="space-y-6">
  <div class="mx-auto px-0 pt-12">
    <h1 class="mb-6 text-2xl font-bold text-blue-900">Daftar Order</h1>

    <div class="rounded-sm bg-gray-50 shadow-sm">
      <div class="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-3 bg-gray-200">
        <div class="col-span-3 text-sm font-bold text-gray-900">ORDER</div>
        <div class="col-span-2 text-sm font-bold text-gray-900">USER</div>
        <div class="col-span-1 text-sm font-bold text-gray-900">TOTAL</div>
        <div class="col-span-2 text-sm font-bold text-gray-900">STATUS</div>
        <div class="col-span-2 text-sm font-bold text-gray-900">PAYMENT</div>
        <div class="col-span-1 text-sm font-bold text-gray-900">WAKTU</div>
        <div class="col-span-1 text-sm font-bold text-gray-900 text-right">AKSI</div>
      </div>

      <div class="overflow-x-auto">
        <ul class="divide-y">
          {#each data.orders as order (order.id)}
            <li class="px-4 py-4 md:px-4">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div class="col-span-3 flex items-center gap-3">
                  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border bg-white">
                    <img src={order.image_url ?? '/placeholder.png'} alt="order thumbnail" class="h-full w-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-slate-800 line-clamp-1">{order.order_id}</div>
                    <div class="mt-1 text-xs text-slate-500">{order.user_id}</div>
                  </div>
                </div>

                <div class="col-span-2 hidden md:block text-sm text-slate-700">{order.user_id}</div>

                <div class="col-span-1 text-sm text-slate-800 font-semibold">
                  Rp{Number(order.total_amount).toLocaleString('id-ID')}
                </div>

                <div class="col-span-2">
                  <div class="flex items-center gap-3">
                    <select
                      class="rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      bind:value={order.status}
                      onchange={() => updateOrderStatus(order)}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="void">void</option>
                    </select>

                    <span class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusBadge(order.status)}`}>
                      <Icon icon="mdi:checkbox-blank-circle" width="10" height="10" />
                      <span class="capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>

                <div class="col-span-2 text-sm text-slate-700">
                  <div>{order.payment_type ?? '-'}</div>
                  <div class="text-xs text-slate-400">{order.transaction_id ?? ''}</div>
                </div>

                <div class="col-span-1 text-sm text-slate-600">
                  {new Date(order.created_at).toLocaleString()}
                </div>

                <div class="col-span-1 flex justify-end gap-2">
                  <a href={`/admin/orders/${order.id}`} class="inline-flex items-center justify-center rounded-md border border-slate-200 bg-[#0443F2] px-3 py-2 text-sm shadow-sm hover:bg-[#0433C2]" aria-label="view">
                    <Icon icon="mdi:pencil" width="18" height="18" class="text-gray-200"/>
                  </a>

                  {#if order.status !== 'void'}
                    <button
                      class="inline-flex items-center justify-center rounded-sm bg-rose-500 px-3 py-2.5 text-sm font-medium text-gray-200 shadow-sm hover:bg-rose-600 focus:outline-none"
                      onclick={() => openVoidModal(order)}
                      aria-label="void"
                    >
                      <Icon icon="mdi:trash-can" width="18" height="18" />
                    </button>
                  {/if}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Modal Confirm Void -->
{#if showDeleteModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/40" onclick={closeDeleteModal} aria-hidden="true"></div>

    <div role="dialog" aria-modal="true" aria-labelledby="void-title" class="relative bg-white rounded-lg p-6 w-[420px] shadow-lg z-10">
      <h2 id="void-title" class="text-lg font-semibold mb-2">Batalkan Order</h2>
      <p class="text-gray-600 mb-4">
        Tindakan ini akan menandai order sebagai <span class="font-semibold">void</span> dan mengembalikan stok (jika berlaku).<br/>
        Yakin ingin membatalkan order <span class="font-semibold text-rose-600">{selectedDeleteName}</span>?
      </p>

      <div class="flex justify-end gap-3">
        <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300" onclick={closeDeleteModal} disabled={isProcessing}>
          Batal
        </button>
        <button class="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700" onclick={handleDeleteConfirmed} disabled={isProcessing}>
          {#if isProcessing}
            <span class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          {/if}
          Ya, Batalkan
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal Feedback -->
{#if showFeedbackModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/30" onclick={() => (showFeedbackModal = false)} aria-hidden="true"></div>

    <div class="relative bg-white rounded-lg p-6 w-[420px] shadow-lg z-10 text-center" role="dialog" aria-modal="true">
      <h2 class={`text-lg font-semibold mb-2 ${feedbackIsError ? 'text-rose-600' : 'text-green-600'}`}>
        {feedbackIsError ? 'Gagal' : 'Berhasil'}!
      </h2>
      <p class="text-gray-700 mb-4">{feedbackMessage}</p>
      <div class="flex justify-center">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick={() => (showFeedbackModal = false)}>
          Oke
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .col-bg-admin-opa { background-color: rgba(0,0,0,0.4); }
</style>
