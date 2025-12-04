<script>
  import Icon from "@iconify/svelte";

  const subject = encodeURIComponent(`Bantuan Website`);
  const body    = encodeURIComponent(
    `Halo ReznMart,\n\nSaya butuh bantuan terkait website ini.\n\nTerima kasih.`
  );
  const mailto = `mailto:alvinzrenx788@gmail.com?subject=${subject}&body=${body}`;

  const waNumber = '6285641133135'; 
  const waText = $derived(`Saya butuh bantuan Anda terkait website ReznMart`);
  const waLink = $derived(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`);

  const categories = [
    { label: 'Laptop', slug: 'laptop'},
    { label: 'Smartphone',  slug: 'smartphone' },
    { label: 'Tablet',      slug: 'tablet' },
    { label: 'Monitor',     slug: 'monitor' },
    { label: 'Smartwatch',  slug: 'smartwatch' },
    { label: 'Audio',       slug: 'audio' }
  ]
</script>

<footer class="w-full bg-gray-950 text-gray-200">
  <!-- MAIN FOOTER -->
  <div
    class="mx-auto grid max-w-7xl gap-8 px-6 py-10
           grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
  >
    <!-- Logo -->
    <div class="flex flex-col items-start gap-4">
      <h2 class="text-3xl font-bold sm:text-4xl">ReznMart</h2>
      <p class="text-sm text-gray-400">Toko online terpercaya</p>
    </div>

    <!-- Navigasi -->
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Kontak Bantuan</h3>
      <div>
        <ul class="mt-2 flex flex-col gap-2 text-sm">
          <li class="flex flex-row gap-2 items-center">
            <Icon icon="logos:google-gmail" />
            <a href="{mailto}" target="_blank" class="nav-item noopener noreferrer" aria-label="Email">
              Email
            </a>
          </li>
          <li class="flex flex-row gap-2 items-center" aria-label="WhatsApp">
            <Icon icon="logos:whatsapp-icon" />
            <a href="{waLink}" target="_blank" class="nav-item">
            WhatsApp
          </a>
        </li>
        </ul>
      </div>
    </div>

    <!-- 4. Kategori Populer -->
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Kategori Populer</h3>

      <!-- Mobile: scroll horizontal -->
      <div class="flex gap-3 overflow-x-auto pb-2 md:hidden">
        {#each ['Laptop', 'Smartphone', 'Tablet', 'Aksesoris', 'Smartwatch'] as item}
          <a href="/products?category={item}" class="nav-item whitespace-nowrap rounded-full bg-gray-800 px-3 py-1 text-sm hover:bg-gray-700">
            {item}
          </a>
        {/each}
      </div>

      <!-- Desktop: grid 2 kolom -->
      <ul class="hidden md:grid md:grid-cols-2 md:gap-2 text-sm">
        {#each categories as cat}
          <li>
            <a href="/product/category/{cat.slug}" class="nav-item">{cat.label}</a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Kontak & Sosial Media -->
    <div class="flex flex-col gap-4">
      <div>
        <h3 class="text-lg font-bold">Ikuti Kami</h3>
        <ul class="mt-2 flex gap-4">
          <li>
            <a href="https://www.instagram.com/alif_njir?igsh=NGtmMWpib2pwenF4" target="_blank" aria-label="Instagram">
              <Icon icon="skill-icons:instagram" width="24" height="24" />
            </a>
          </li>
          <li>
            <a href="/" aria-label="LinkedIn">
              <Icon icon="skill-icons:linkedin" width="24" height="24" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- COPYRIGHT -->
  <div class="bg-gray-800 py-4 text-center text-sm text-gray-300">
    © Alif Januar Rizky, 2025
  </div>
</footer>

<style>
  /* garis bawah animasi pada link */
  .nav-item {
    position: relative;
    width: fit-content;
    padding-bottom: 2px;
    cursor: pointer;
  }
  .nav-item::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background: #0443F2;
    transition: width 0.3s ease;
  }
  .nav-item:hover::after {
    width: 100%;
  }
</style>