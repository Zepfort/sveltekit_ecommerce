<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cart, total, type CartItem as RawCartItem } from '$lib/stores/cart';
  import { loadCart, updateCartItem, removeCartItem } from '$lib/stores/cart';
  import { goto } from '$app/navigation'

  type CartItem = RawCartItem & { selected: boolean };

  let open = $state(false);
  let items = $state<CartItem[]>([]);
  let totalValue = $state(0);

  const unsubscribe = cart.subscribe(v => {
    items = v.map(it => ({...it, selected: it.selected ?? true}))
  })

  let subtotal = $derived(
    () => items
      .filter(it => it.selected)
      .reduce((acc, it) => acc + it.price * it.qty, 0)
  )

  total.subscribe((v) => (totalValue = v));

  function toggleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    items = items.map(it => ({...it, selected: checked}));
    cart.set(items)
  }

  function toggleItemSelect(id: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    items = items.map(it => it.id === id ? {...it, selected: checked} : it);
  }

async function inc(id: string) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newQty = item.qty + 1;
  await updateCartItem(id, newQty); // API call ke Supabase
}

async function dec(id: string) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.qty > 1) {
    const newQty = item.qty - 1;
    await updateCartItem(id, newQty);
  } else {
    await removeCartItem(id);
  }
}

async function delItem(id: string) {
  await removeCartItem(id);
  await loadCart();  
}

$effect(() => {
  return () => unsubscribe();
})

function handleCheckout() {
  const selectedItemsPlain = items
    .filter(it => it.selected)
    .map(it => ({
      id: it.id,
      name: it.name,
      image_url: it.image_url,
      price: it.price,
      qty: it.qty
    }));

  const totalPlain = selectedItemsPlain.reduce((sum, it) => sum + it.price * it.qty, 0);

  goto('/checkout', {
    state: {
      items: selectedItemsPlain,
      total: totalPlain,
      fromCart: true
    }
  });
}


</script>

<div class="relative">
  <button type="button" onclick={() => (open = !open)} class="flex items-center gap-2 rounded-sm bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">
    <Icon icon="icon-park-outline:shopping" width="24" height="24" />
    <span class="text-sm font-semibold">{items.length}</span>
  </button>

  {#if open}
    <button class="fixed inset-0 z-40 bg-black/30 sm:bg-transparent"
      onclick={() => open = false}
      type="button"
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open = false; }}}
      aria-label="Tutup keranjang"
    >
    </button>
    
    <!-- pop up panel -->
    <div 
      class="fixed sm:absolute sm:-right-40 bottom-0 sm:bottom-auto
             w-full sm:w-[28rem] md:w-[36rem] 
             h-[80vh] sm:h-auto bg-white border 
             shadow-xl rounded-t-lg sm:rounded-sm 
             p-4 z-50 transition-all duration-300 
             flex flex-col"
    >
    <div class="flex justify-between items-center border-b pb-2 mb-4">
      <h2 class="text-lg font-semibold">Keranjang</h2>
      <button onclick={() => open = false}>
        <Icon icon="mdi:close" width="20"/>
      </button>
    </div>

      {#if items.length === 0}
        <p class="text-center text-gray-500">Keranjang kosong</p>
      {:else}
        <ul class="max-h-96 overflow-auto space-y-3">
          {#each items as it}
            <li class="flex items-center justify-start">
              <!-- checkbox + Gambar -->
              <div class="flex items-center flex-1 min-w-0 p-2">
                <input type="checkbox" 
                  checked={it.selected} 
                  onchange={(e) => toggleItemSelect(it.id, e)}
                />
                <img src={it.image_url} alt={it.name} class="w-14 h-14 object-cover rounded-md flex-shrink-0"/>
                <div class="flex flex-col truncate">
                  <p class="font-medium truncate">{it.name}</p>
                  <p class="text-sm text-gray-500">Rp Rp {(it.price ?? 0).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <!-- Quantity + Delete -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="border-2 flex items-center overflow-hidden">
                  <button onclick={() => dec(it.id)} class="font-semibold h-7 w-7 bg-gray-200 border-r hover:bg-gray-300">-</button>
                  <span class="w-6 text-center">{it.qty}</span>
                  <button onclick={() => inc(it.id)} class="font-semibold  h-7 w-7 bg-gray-200 border-l hover:bg-gray-300">+</button>
                </div>
                <button onclick={() => delItem(it.id)} class="ml-2 py-1 px-3 text-sm rounded-sm bg-red-500 text-white hover:bg-red-700 duration-150">Hapus</button>
              </div>
            </li>
          {/each}
        </ul>

        <div class="mt-4 border-t pt-3 text-right">
          <div class="flex justify-between py-4 text-sm sm:text-base font-medium">
            <span>Subtotal</span>
            <span>Rp {(items.reduce((acc, it) => acc + ((it?.price ?? 0) * (it?.qty ?? 0)), 0)).toLocaleString('id-ID')}</span>
          </div>
          <button type="button" onclick={handleCheckout}
          class="flex justify-center w-full text-center text-pmb px-4 py-2 rounded-sm"
          >
            Pembayaran
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .text-pmb {
    background-color: #0443F2;
    color: #FFFFFF;
    transition: ease-in-out 0.2;
  }

  .text-pmb:hover {
    background-color: #0433C2;
  }
</style>
