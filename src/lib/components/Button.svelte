<script lang="ts">
	import type { Snippet } from 'svelte';
  import "../style/button.css"

	interface BasicProps {
		children: Snippet;
		isSecondary?: boolean;
		isDanger?: boolean;
		isMenu?: boolean;
	}

	interface ButtonProps extends BasicProps {
		onclick?: (e: MouseEvent) => void;
		href?: never;
		type: "submit" | "button"
    isLogin?: boolean; 
		isSignUp?: boolean;
    isSubmit?: boolean;
	}

	interface LinkProps extends BasicProps {
		href: string;
        isLogin?: boolean; 
		isSignUp?: boolean;
	}

	type ComponentProps = ButtonProps | LinkProps;

	let props: ComponentProps = $props();
</script>

{#if 'href' in props}
  <a
    href={props.href}
    class="btn "
    class:btn-secondary={props.isSecondary}
    class:btn-danger={props.isDanger}
    class:btn-menu={props.isMenu}
    class:btn-login={props.isLogin} 
    class:btn-signup={props.isSignUp}
  >
    {@render props.children()}
  </a>
{:else}
  <button
    onclick={props.onclick}
    class="btn "
    class:btn-secondary={props.isSecondary}
    class:btn-danger={props.isDanger}
    class:btn-menu={props.isMenu}
    class:btn-submit-login={props.isSubmit}
  >
    {@render props.children()}
  </button>
{/if}

<style>
	
</style>
