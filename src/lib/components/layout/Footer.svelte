<script>
    import Icon from "@iconify/svelte";
</script>

<div class="flex flex-col w-full h-[240px] bg-gray-950 mb-0">
    <div class="flex justify-between h-[200px] pb2">
        <!-- Logo -->
        <div class="flex justify-center w-1/3 items-center ">
            <h1 class="text-5xl text-white font-bold">RenzMart</h1>
        </div>
        <!-- Navigasi -->
         <div class=" flex items-center justify-center w-1/3  ">
            <ul class="flex flex-col gap-2 text-white py-2 navigasi-list">
                <h3 class="text-xl font-bold text-white">Navigasi</h3>
                <li class="nav-item">Home</li>
                <li class="nav-item">Product</li>
                <li class="nav-item">About Us</li>
            </ul>
         </div>
         <!-- Contact & Sosial Media -->
          <div class="flex flex-col justify-center items-center w-1/3  ">
            <ul class="flex flex-col gap-2 text-white pb-4 contact-list">
                <h3 class="font-bold text-xl">Kontak</h3>
                <li class="nav-item"><a href="/">Email</a></li>
                <li class="nav-item"><a href="/">WhatsApp</a></li>
            </ul>
            <ul class="flex justify-baseline items-center gap-4 social-list">
                <h3 class="text-xl font-bold text-white ">Ikuti Kami </h3>
                <li class="social-item"><a href="/"><Icon icon="skill-icons:instagram" width="24" height="24" /></a></li>
                <li class="social-item"><a href="/"><Icon icon="skill-icons:linkedin" width="24" height="24" /></a></li>
            </ul>
          </div>
    </div>
    <div class="flex justify-center items-center bg-gray-700 h-[40px] font-light text-md">
        <h3 class="align-text-bottom text-white">©Alif Januar Rizky, 2025</h3>
    </div>
</div>

<style>
.nav-item {
  position: relative;        
  padding-bottom: 4px;       
  cursor: pointer;
}

.nav-item::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;                  
  height: 3px;               
  background-color: #0443F2;   
  transition: width 0.3s ease-in-out;
}

.nav-item:hover::after {
  width: 100%;               
}


.social-item {
  
}

.social-item::after {
  content: none !important;
}
</style>
