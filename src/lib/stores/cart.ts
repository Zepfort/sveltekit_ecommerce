// src/lib/stores/cart.ts
import { writable, derived } from 'svelte/store';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export const cart = writable<CartItem[]>([]);

// derived untuk total harga
export const total = derived(cart, ($cart) =>
  $cart.reduce((sum, it) => sum + it.price * it.qty, 0)
);

// derived untuk jumlah item
export const count = derived(cart, ($cart) =>
  $cart.reduce((sum, it) => sum + it.qty, 0)
);
