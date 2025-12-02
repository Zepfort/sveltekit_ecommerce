<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';

 // ambil props 
  let { data, error: serverError } = $props();

  // reactive state
  let name = $state(data?.userProfile?.name ?? '');
  let password = $state('');
  let passwordConfirmation = $state('');
  let errorMsg: string | null   = $state(serverError ?? null);
  let successMsg: string | null = $state(null);

  function onEnhance() {
    return async ({ result }: any) => {
      let payload: any;
      if ('data' in result) {
        try {
          payload = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } catch {
          payload = result.data;
        }
      } else {
        payload = result;
      }

      const success = !!payload.success;
      const message = payload.message ?? null;
      const err     = payload.error ?? null;

      if (result.type === 'success' && success) {
        successMsg = message ?? 'Profil berhasil diperbarui.';
        errorMsg = null;
        goto('/profile/account');
      } else {
        errorMsg = err ?? message ?? 'Gagal memperbarui profil.';
        successMsg = null;
      }
    };
  }
</script>

<svelte:head>
  <title>Edit Profile</title>
</svelte:head>

<section class="w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 md:px-8">
  <h1 class="mb-6 text-2xl font-semibold text-gray-800 border-b pb-4">Ubah profil</h1>

  {#if errorMsg}
    <p class="mb-4 text-sm text-red-600">{errorMsg}</p>
  {/if}
  {#if successMsg}
    <p class="mb-4 text-sm text-green-600">{successMsg}</p>
  {/if}

  <!-- note: method="POST" required for use:enhance -->
  <form method="POST" use:enhance={onEnhance} class="flex flex-col gap-4 sm:gap-6">
    <div class="flex flex-col">
      <label for="name" class="text-sm font-medium text-gray-700 mb-1">
        Nama <span class="text-red-700">*</span>
      </label>
      <input id="name" name="name" type="text" bind:value={name} required
        placeholder="Nama akun..."
        class="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
    </div>

    <div class="flex flex-col">
      <label for="password" class="text-sm font-medium text-gray-700 mb-1">Sandi baru (opsional)</label>
      <input id="password" name="password" type="password" bind:value={password}
        placeholder="Sandi baru..."
        class="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
    </div>

    <div class="flex flex-col">
      <label for="password-confirmation" class="text-sm font-medium text-gray-700 mb-1">Konfirmasi sandi</label>
      <input id="password-confirmation" name="password-confirmation" type="password"
        bind:value={passwordConfirmation}
        placeholder="Konfirmasi sandi"
        class="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
    </div>

    <div class="flex justify-end">
      <button type="submit" class="px-6 py-2 bg-[#0443F2] text-gray-200 font-medium rounded hover:bg-[#0433C2] focus:ring-4 focus:ring-blue-300 transition disabled:opacity-60">
        Perbarui Profil
      </button>
    </div>
  </form>
</section>

<style>
  .focus\:ring-blue-300:focus {
    --tw-ring-color: rgba(59,130,246,0.45);
  }
</style>
