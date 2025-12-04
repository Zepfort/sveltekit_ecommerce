<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Action } from '@sveltejs/kit';
	import type { ActionData as LoginActionData } from '../../routes/login/$types';
	import Icon from '@iconify/svelte';

	let shown = $state(false);
	type ActionData = LoginActionData & {
		name?: string;
		email?: string;
		password?: string;
		passwordConfirmation?: string;
	};

	interface ComponentsProps {
		isRegistration: boolean;
		form: ActionData;
	}

	let { isRegistration, form }: ComponentsProps = $props();
</script>

<div class="flex flex-col md:flex-row w-full items-center justify-center md:justify-between pt-12 pb-16 md:pt-0 md:pb-0">
	<!-- Left: Brand -->
	<div class="flex w-full md:w-1/2 justify-center py-10 md:py-0">
		<h1 class="text-primary text-5xl md:text-8xl font-semibold">ReznMart</h1>
	</div>

	<!-- Right: Form -->
	<div class="flex w-full md:w-1/2 justify-center px-4">
		<form action="" method="POST" class="w-full max-w-[400px]">
			{#if form && form.errors?.length}
				{#each form.errors as error}
					<h2
						class="flex h-[40px] w-full items-center justify-center rounded-sm bg-red-500 text-base md:text-xl font-normal text-gray-100 mb-4"
					>
						{error}
					</h2>
				{/each}
			{/if}

			<div
				class="flex flex-col rounded-sm border-t-2 border-t-blue-700 px-6 py-8 md:px-8 md:py-8 shadow-2xl"
			>
				<h1 class="text-center text-2xl md:text-3xl font-normal">
					{isRegistration ? 'Daftar Akun' : 'Masuk'}
				</h1>

				<div class="flex flex-col items-center pt-6 md:pt-8">
					<div class="flex w-full flex-col justify-center pb-8 md:pb-12">
						{#if isRegistration}
							<label for="Name" class="font-base">Nama</label>
							<input
								type="text"
								name="name"
								value={form?.name || ''}
								class="input-field"
								placeholder="Nama..."
							/>
						{/if}

						<label for="Email">Email</label>
						<input
							type="email"
							name="email"
							value={form?.email || ''}
							class="input-field"
							placeholder="Email..."
						/>

						<label for="Password">Kata Sandi</label>
						<div class="flex">
							<input
								type={shown ? 'text' : 'password'}
								name="password"
								value={form?.password || ''}
								class="input-field-pw"
								placeholder="kata sandi..."
							/>
							<button
								class="bg-primary flex w-[15%] items-center justify-center rounded-r-sm"
								type="button"
								aria-label="Toggle password"
								onclick={() => (shown = !shown)}
							>
								<Icon icon={shown ? 'mdi:eye-off' : 'mdi:eye'} width="20" />
							</button>
						</div>

						{#if isRegistration}
							<label for="Password">Konfirmasi Kata Sandi</label>
							<div class="flex">
								<input
									type={shown ? 'text' : 'password'}
									name="passwordConfirmation"
									value={form?.passwordConfirmation || ''}
									class="input-field-pw"
									placeholder="konfirmasi kata sandi..."
								/>
								<button
									class="bg-primary flex w-[15%] items-center justify-center rounded-r-sm"
									type="button"
									aria-label="Toggle password"
									onclick={() => (shown = !shown)}
								>
									<Icon icon={shown ? 'mdi:eye-off' : 'mdi:eye'} width="20" />
								</button>
							</div>
						{/if}
					</div>

					<div class="flex w-full flex-col items-center pb-2">
						<Button isSubmit={true} type="submit">
							{isRegistration ? 'Daftar' : 'Masuk'}
						</Button>
					</div>

					<div class="flex flex-row justify-center gap-1 pt-2 text-sm md:text-base">
						{#if isRegistration}
							<p class="font-normal">Sudah punya akun?</p>
							<a href="/login" class="text-primary link-underline">Masuk</a>
						{:else}
							<p class="font-normal">Belum punya akun?</p>
							<a href="/register" class="text-primary link-underline">Daftar</a>
						{/if}
					</div>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.text-primary {
		color: #0443f2;
	}

	.bg-primary {
		background-color: #0443f2;
		color: #ebe9e9;
	}

	input:focus {
		outline: #42b549;
		box-shadow: none;
	}

	.input-field {
		font-size: 16px;
		padding: 6px 12px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
	}

	.input-field-pw {
		font-size: 16px;
		padding: 6px 12px;
		border: 1px solid #d1d5db;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		width: 85%;
	}

	label {
		padding: 12px 0;
	}

	.link-underline {
		display: block;
		text-decoration: none;
		position: relative;
	}

	.link-underline::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		width: 0%;
		height: 2px;
		background-color: currentColor;
		transition: width 0.3s ease-in-out;
	}

	.link-underline:hover::after {
		width: 100%;
	}
</style>
