import { writable } from 'svelte/store';

export const checkoutData = writable({
  items: [],
  total: 0,
  fromCart: false
});
