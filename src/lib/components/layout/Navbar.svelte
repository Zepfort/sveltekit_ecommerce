<script lang="ts">
    import Button from "../Button.svelte";
    import UserBadge from "../UserBadge.svelte";
    import Icon from "@iconify/svelte";
    import "/src/lib/style/button.css"
    import CartButton from "../../components/CartButton.svelte";
    // import type { LayoutData } from '$types';
    let { data } = $props();
    let {userProfile} = data

</script>

<div class="flex justify-center w-full mx-auto bg-gray-950">
    <div class="flex container justify-between items-center py-4 px-7 bg-gray-950">
        <div class="logo">
            <h1 class="text-2xl font-bold text-white">
                RenzMart
            </h1>
        </div>
        <div>
            <form action="">
                <div class="flex  gap-0 rounded-lg bg-white ">
                    <select name="" id="" class="border-none rounded-l-lg outline-none">
                        <option value="">Kategori</option>
                        <option value="">Pria</option>
                        <option value="">Wanita</option>
                        <option value="">Elektronik</option>
                        <option value="">Buku</option>
                    </select>
                    <input type="text" class="min-w-[600px] border-none rounded-r-lg outline-none" placeholder="Cari di Renzmart"/>
                    <button class="flex items-center justify-center border-none px-2 rounded-r-lg w-16 col-primary cursor-pointer">
                    <Icon icon="mdi:magnify" width={24} height={24} color="white"/>
                    </button>
                </div>
            </form>
        </div>
        <div class="flex gap-6">
            <div class="flex justify-center items-center min-w-[40px] h-12 hover:bg-gray-700 rounded-lg " >
                <Icon icon="mingcute:notification-line" width="24" height="24" color="white"/>
            </div>
            <div class="flex justify-center items-center min-w-[40px] h-12 rounded-lg" >
                <CartButton/>
            </div>
        </div>
        <div class="flex gap-2 ">
            <UserBadge {userProfile}/>
        </div>
    </div>
</div>