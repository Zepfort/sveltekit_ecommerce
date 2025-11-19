<script lang="ts">
  import Icon from "@iconify/svelte";
  import Button from "./Button.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";

  let { userProfile }: { userProfile: { name: string } | null } = $props()

  async function logout() {
    const { error } = await supabase.auth.signOut({scope: 'local'});
    if (error) {
      console.error("Logout gagal:", error);
    } else {
      goto("/login");
    }
  }

</script>

{#if userProfile}
  <div class="user-badge-group">
    <div class="user-info">
      <div class="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-700 text-white">
        <Icon icon="material-symbols:person-outline" width="24" height="24" />
      </div>
      <span class="text-sm text-white">
        {userProfile?.name}
      </span>
    </div>
    <div class="user-dropdown">
      <a href="/profile/account" class="block flex gap-2 px-4 py-2 text-sm hover:bg-blue-700">
       <Icon icon="mdi:account-circle" width="20" height="20" class="text-gray-50" />
        Profil
      </a>
      <button onclick={logout} class="block flex gap-2 w-full px-4 py-2 text-left text-sm hover:bg-blue-700">
        <Icon icon="mdi:logout" width="20" height="20" class="text-gray-50"/>
        Keluar
      </button>
    </div>
  </div>
{:else}
  <div class="flex gap-2">
    <Button href="/login" isLogin={true}>Log In</Button>
    <Button href="/register" isSignUp={true}>Sign Up</Button>
  </div>
{/if}

<style>
  .user-badge-group {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .user-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.25rem; 
    width: 10rem;
    background: #050417;
    color: #ebe9e9;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease-in-out, visibility 0s linear 0.2s;
    z-index: 50; 
  }
  .user-badge-group:hover .user-dropdown {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }
</style>