<script lang="ts">
  let { data } = $props();
  const { users } = data;
</script>

<section class="space-y-6">
  <h1 class="text-2xl font-bold mb-4 pt-16">Daftar Customer</h1>
  
  {#if users.length > 0}
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full border-collapse">
        <thead class="bg-gray-200 text-left text-sm font-medium text-gray-900">
          <tr>
            <th class="px-4 py-2">No</th>
            <th class="px-4 py-2">Nama</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody class="py-2 divide-y">
          {#each users as user, i}
            <tr class="hover:bg-gray-200 transition border-b-gray-400 ">
              <td class="px-4 py-2 text-sm text-gray-900">{i + 1}</td>
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{user.name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{user.email}</td>
              <td class="px-4 py-2 text-sm text-gray-500">
                {new Date(user.created_at).toLocaleString('id-ID')}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="text-gray-500 text-xl">Belum ada user dengan role <strong>customer</strong>.</p>
  {/if}
</section>
