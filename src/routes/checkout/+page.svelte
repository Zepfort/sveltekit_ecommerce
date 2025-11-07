<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';

	type ItemType = {
		id: string;
		name: string;
		price: number;
		qty: number;
		image_url?: string;
	};

	// ambil data hasil load()
	let { data } = $props();

	let items = $state<ItemType[]>(data.items ?? []);
	let total = $state<number>(data.total ?? 0);
	let fromCart = $state<boolean>(data.fromCart ?? false);

	let grandTotal = $derived(
		fromCart ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : total
	);

	let slug = page.url.searchParams.get('slug');
	let qty = page.url.searchParams.get('qty');

	// async function redirectToPayment() {
	// 	const response = await fetch('/checkout', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({ items, total: grandTotal })
	// 	});
	// 	const result = await response.json();

	// 	if (response.ok && result.redirect_url) {
	// 		window.location.href = result.redirect_url;
	// 	} else {
	// 		goto('/checkout/failed');
	// 	}
	// }
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Checkout</h1>

	{#if items.length > 0}
		{#if fromCart}
			<!-- Mode Keranjang -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- KIRI: daftar produk -->
				<div class="flex flex-col gap-4">
					<div class="flex flex-col items-start rounded-lg border p-4 shadow-md">
						<h2 class="pl-1 text-xl font-semibold text-gray-500">Alamat Pengiriman</h2>
						<div class="flex gap-1 pt-2">
							<Icon icon="mdi:location" width="20" height="24" style="color: #0443F2;" />
							<p class="font-normal">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, accusamus?
							</p>
						</div>
					</div>

					<!-- Daftar produk -->
					<ul class="space-y-4">
						{#each items as it (it.id)}
							<li class="flex items-center gap-4 rounded border p-3 shadow-sm">
								<img src={it.image_url} alt={it.name} class="h-16 w-16 rounded-sm object-cover" />
								<div class="flex-1">
									<p class="font-medium">{it.name}</p>
									<p class="text-sm text-gray-600">Jumlah: {it.qty}</p>
									<p class="text-sm text-gray-600">
										Rp {(it.price * it.qty).toLocaleString('id-ID')}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				</div>

				<!-- KANAN: ringkasan pesanan -->
				<div class="flex h-fit flex-col justify-between rounded-lg border bg-gray-50 p-6 shadow-md">
					<div>
						<h3 class="mb-4 text-lg font-semibold">Ringkasan Pesanan</h3>
						{#each items as it (it.id)}
							<div class="mb-2 flex justify-between text-sm">
								<span>{it.name} x{it.qty}</span>
								<span>Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
							</div>
						{/each}
						<hr class="my-4" />
						<div class="flex justify-between text-xl font-bold">
							<span>Total</span>
							<span>Rp {grandTotal.toLocaleString('id-ID')}</span>
						</div>
					</div>
          <form method="POST">
							<input type="hidden" name="items" value={JSON.stringify(items)} />
							<input type="hidden" name="total" value={grandTotal} />
							<button 
                  class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white"
                  type="submit">Bayar Sekarang</button>
					</form>
					<!-- <button
						onclick={redirectToPayment}
						class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700"
					>
						Bayar Sekarang
					</button> -->
				</div>
			</div>
		{:else}
			<!-- Mode Beli Langsung -->
			{#each items as it (it.id)}
				<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
					<!-- Kiri -->
					<div class="flex flex-col gap-4">
						<div class="flex flex-col items-start rounded-lg border p-4 shadow-md">
							<h2 class="pl-1 text-xl font-semibold text-gray-500">Alamat Pengiriman</h2>
							<div class="flex gap-1 pt-2">
								<Icon icon="mdi:location" width="20" height="24" style="color: #0443F2;" />
								<p class="font-normal">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, accusamus?
								</p>
							</div>
						</div>

						<div class="flex flex-col items-center rounded-lg border p-4 shadow-md">
							<img
								src={it.image_url}
								alt={it.name}
								class="w-full max-w-sm rounded-md object-contain"
							/>
							<h2 class="mt-4 text-center text-lg font-medium">{it.name}</h2>
							<p class="text-md mt-1 text-gray-700">Jumlah: {it.qty}</p>
						</div>
					</div>

					<!-- Kanan -->
					<div
						class="flex h-full flex-col justify-between rounded-lg border bg-gray-50 p-6 shadow-md"
					>
						<div>
							<h3 class="mb-4 text-lg font-semibold">Ringkasan Pesanan</h3>
							<div class="mb-2 flex justify-between">
								<span>Harga</span>
								<span>Rp {Number(it.price).toLocaleString('id-ID')}</span>
							</div>
							<div class="mb-2 flex justify-between">
								<span>Jumlah</span>
								<span>{it.qty}</span>
							</div>
							<hr class="my-4" />
							<div class="flex justify-between text-xl font-bold">
								<span>Total</span>
								<span>Rp {(Number(it.price) * it.qty).toLocaleString('id-ID')}</span>
							</div>
						</div>
						<form method="POST">
							<input type="hidden" name="items" value={JSON.stringify(items)} />
							<input type="hidden" name="total" value={grandTotal} />
							<button 
                  class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white"
                  type="submit">Bayar Sekarang</button>
						</form>
						<!-- <button
              onclick={redirectToPayment} 
              class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white">
              Bayar Sekarang
            </button> -->
					</div>
				</div>
			{/each}
		{/if}
	{:else}
		<p>Keranjang kosong atau tidak ada item untuk checkout.</p>
	{/if}
</div>
