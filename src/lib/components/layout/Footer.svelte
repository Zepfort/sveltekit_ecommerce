<script>
  import Icon from "@iconify/svelte";
</script>

<footer class="w-full bg-gray-950 text-white">
  <!-- MAIN FOOTER -->
  <div
    class="mx-auto grid max-w-7xl gap-8 px-6 py-10
           grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
  >
    <!-- Logo -->
    <div class="flex flex-col items-start gap-4">
      <h2 class="text-3xl font-bold sm:text-4xl">RenzMart</h2>
      <p class="text-sm text-gray-400">Toko online terpercaya</p>
    </div>

    <!-- Navigasi -->
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-bold">Navigasi</h3>
      <ul class="flex flex-col gap-2 text-sm">
        <li><a href="/" class="nav-item">Home</a></li>
        <li><a href="/" class="nav-item">Product</a></li>
        <li><a href="/" class="nav-item">About Us</a></li>
      </ul>
    </div>

    <!-- Kontak & Sosial Media -->
    <div class="flex flex-col gap-4">
      <div>
        <h3 class="text-lg font-bold">Kontak</h3>
        <ul class="mt-2 flex flex-col gap-2 text-sm">
          <li><a href="/" class="nav-item">Email</a></li>
          <li><a href="/" class="nav-item">WhatsApp</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-bold">Ikuti Kami</h3>
        <ul class="mt-2 flex gap-4">
          <li>
            <a href="/" aria-label="Instagram">
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