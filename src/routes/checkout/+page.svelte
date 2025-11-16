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

	// ambil data load()
	let { data } = $props();

	let items = $state<ItemType[]>(data.items ?? []);
	let total = $state<number>(data.total ?? 0);
	let fromCart = $state<boolean>(data.fromCart ?? false);

	let grandTotal = $derived(
		fromCart ? items.reduce((sum, it) => sum + it.price * it.qty, 0) : total
	);

	let addresses = $state(data.addresses ?? []);
	let selectedAddressId = $state<string>(addresses.find((a) => a.is_default)?.id ?? '');

	let slug = page.url.searchParams.get('slug');
	let qty = page.url.searchParams.get('qty');
</script>

<div class="container mx-auto px-4">
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
							<Icon icon="mdi:location" width="28" height="24" style="color: #DC2626;" />
							<div class="flex flex-col items-start rounded-sm border p-4 shadow-md">
								<h2 class="pl-1 text-xl font-semibold text-gray-500">Alamat Pengiriman</h2>
								{#if addresses.length}
									<div class="mt-2 flex flex-col gap-2">
										{#each addresses as addr (addr.id)}
											<label class="flex items-start gap-2">
												<input
													type="radio"
													name="address_id"
													value={addr.id}
													bind:group={selectedAddressId}
													class="mt-1"
												/>
												<div class="text-sm">
													<p class="font-medium">{addr.recipient} – {addr.label}</p>
													<p>{addr.full_address}, {addr.village}, {addr.district}</p>
													<p>{addr.city}, {addr.province} {addr.postal_code}</p>
													<p class="text-gray-600">Telp. {addr.phone}</p>
												</div>
											</label>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-gray-600">Belum ada alamat tersimpan</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Daftar produk -->
					<ul class="space-y-4">
						{#each items as it (it.id)}
							<li class="flex items-center gap-4 rounded border p-3 shadow-sm">
								<img src={it.image_url} alt={it.name} class="h-16 w-16 rounded-sm object-cover" />
								<div class="flex-1">
									<p class="font-medium text-gray-900">{it.name}</p>
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
						<h3 class="mb-4 text-lg font-semibold text-gray-900">Ringkasan Pesanan</h3>
						{#each items as it (it.id)}
							<div class="mb-2 flex justify-between text-sm text-gray-900">
								<span>{it.name} x{it.qty}</span>
								<span class="font-semibold">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
							</div>
						{/each}
						<hr class="my-4" />
						<div class="flex justify-between text-xl font-bold text-gray-900">
							<span>Total</span>
							<span>Rp {grandTotal.toLocaleString('id-ID')}</span>
						</div>
					</div>
					<form method="POST">
						<input type="hidden" name="items" value={JSON.stringify(items)} />
						<input type="hidden" name="total" value={grandTotal} />
						<input type="hidden" name="address_id" value={selectedAddressId} />
						<button
							class="mt-6 w-full cursor-pointer rounded-sm bg-[#0443F2] py-3 font-semibold text-gray-200 hover:bg-[#0433C2]"
							type="submit">Bayar Sekarang</button
						>
					</form>
				</div>
			</div>
		{:else}
			<!-- Mode Beli Langsung -->
			{#each items as it (it.id)}
				<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
					<!-- Kiri -->
					<div class="flex flex-col gap-4">
						<div class="flex flex-col items-start rounded-sm border p-4 shadow-md">
							<h2 class="pl-1 text-xl font-semibold text-gray-500">Alamat Pengiriman</h2>
							<div class="flex gap-1 pt-2">
								<Icon icon="mdi:location" width="28" height="24" style="color: #DC2626;" />
								{#if addresses.length}
									<div class="flex flex-col gap-2">
										{#each addresses as addr (addr.id)}
											<label for="" class="flex items-start gap-2">
												<input
													type="radio"
													name="address_id"
													value={addr.id}
													bind:group={selectedAddressId}
													class="mt-1"
												/>
												<div class="text-sm">
													<p class="font-medium">{addr.recipient} – {addr.label}</p>
													<p>{addr.full_address}, {addr.village}, {addr.district}</p>
													<p>{addr.city}, {addr.province} {addr.postal_code}</p>
													<p class="text-gray-600">Telp. {addr.phone}</p>
												</div>
											</label>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-gray-600">Belum ada alamat tersimpan</p>
								{/if}
								<input type="hidden" name="address_id" value={selectedAddressId} />
							</div>
						</div>

						<div class="flex flex-col items-center rounded-sm border p-4 text-gray-900 shadow-md">
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
							<h3 class="mb-4 text-lg font-semibold text-gray-900">Ringkasan Pesanan</h3>
							<div class="mb-2 flex justify-between">
								<span>Harga</span>
								<span class="font-semibold">Rp {Number(it.price).toLocaleString('id-ID')}</span>
							</div>
							<div class="mb-2 flex justify-between text-gray-900">
								<span>Jumlah</span>
								<span>{it.qty}</span>
							</div>
							<hr class="my-4" />
							<div class="flex justify-between text-xl font-bold text-gray-900">
								<span>Total</span>
								<span>Rp {(Number(it.price) * it.qty).toLocaleString('id-ID')}</span>
							</div>
						</div>
						<form method="POST">
							<input type="hidden" name="items" value={JSON.stringify(items)} />
							<input type="hidden" name="total" value={grandTotal} />
							<input type="hidden" name="address_id" value={selectedAddressId} />
							<button
								class="mt-6 w-full cursor-pointer rounded-sm bg-[#0443F2] py-3 font-semibold text-gray-200 hover:bg-[#0433C2]"
								type="submit">Bayar Sekarang</button
							>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	{:else}
		<p>Keranjang kosong atau tidak ada item untuk checkout.</p>
	{/if}
</div>
