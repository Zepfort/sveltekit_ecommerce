<script lang="ts">
  import type { Snippet } from 'svelte';

  interface BasicProps {
    children: Snippet;
    isSecondary?: boolean;
    isDanger?: boolean;
    isMenu?: boolean;
  }

  interface ButtonProps extends BasicProps {
    onclick?: (e: MouseEvent) => void;
    href?: never;
    type: 'submit' | 'button';
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
    class={`
      inline-flex items-center justify-center rounded px-6 py-3 text-sm
      font-semibold leading-none transition
      focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
      ${props.isDanger
        ? 'bg-red-700 text-white hover:bg-red-800'
        : props.isSecondary
        ? 'bg-[#0443F2] text-white hover:bg-[#0433C2]'
        : ''}
      ${props.isLogin 
      ? 'bg-blue-50 text-[#0443F2] hover:bg-[#0433C2] hover:text-blue-50'
      : props.isSignUp
      ? 'bg-[#0443F2] text-blue-50 hover:bg-[#0433C2]'
      : ''}
      ${props.isMenu ? 'min-w-[150px]' : ''}
    `}
    style="--primary:#0443F2; --hover-primary:#0433C2;"
  >
    {@render props.children()}
  </a>
{:else}
  <button
    type={props.type}
    onclick={props.onclick}
    class={`
      inline-flex items-center justify-center rounded px-6 py-2 text-sm
      font-semibold leading-none transition
      focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
      ${props.isDanger
        ? 'bg-red-700 text-white hover:bg-red-800'
        : props.isSecondary
        ? 'bg-[#0443F2] text-white hover:bg-[#0433C2]'
        : props.isSubmit
        ? 'w-full border-2 bg-[#0443F2] text-gray-200 hover:bg-[#0433C2]'
        : 'bg-[#0443F2] text-white hover:bg-[#0433C2]'}
      ${props.isMenu ? 'min-w-[150px]' : ''}
    `}
    style="--primary:#0443F2; --hover-primary:#0433C2;"
  >
    {@render props.children()}
  </button>
{/if}