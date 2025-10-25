import { writable, derived, get } from 'svelte/store';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  qty: number;
  slug: string;
  image_url: string;
  selected?: boolean;
};

export const cart = writable<CartItem[]>([]);

export const total = derived(
  cart,
  ($cart) => $cart.reduce((sum, item) => sum + item.price * item.qty, 0)
);

export async function loadCart() {
  const res = await fetch('/api/cart');
  if (!res.ok) {
    console.error('Failed to load cart', await res.text());
    return;
  }
  let j;
  try {
    j = await res.json();
  } catch (e) {
    console.warn('loadCart got no JSON', e);
    return;
  }
  const items = (j.items ?? []).map((it: CartItem) => ({
    ...it,
    selected: it.selected ?? true
  }))
  cart.set(items)
}

export async function addToCart(productId: string, qty: number) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, qty })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    console.warn('addToCart got no JSON', e);
  }
  if (data?.items) {
    const items = data.items.map((it: CartItem) => ({
      ...it,
      selected: it.selected ??  true
    }));
    cart.set(items)
  }
  return data;
}

export async function updateCartItem(itemId: string, qty: number) {
  const prev = get(cart)
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) {
    console.error('updateCartItem failed', await res.text());
  }
  await loadCart();
  cart.update(newItems => 
    newItems.map(it => ({
      ...it,
      selected: prev.find(p => p.id === it.id)?.selected ?? true
    }))
  )
}

export async function removeCartItem(itemId: string) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    console.error('removeCartItem failed', await res.text());
  }
  await loadCart();
}

export function toggleSelectItem(itemId: string) {
  cart.update(items => 
    items.map(it => 
      it.id === itemId ? { ...it, selected: !it.selected } : it
    )
  )
}

export function selectAll(select: boolean) {
  cart.update(items => 
    items.map(it => ({ ...it, selected: select}))
  )
}
