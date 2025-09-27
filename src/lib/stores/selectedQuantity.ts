// src/lib/stores/selectedQuantity.ts
import { writable } from 'svelte/store';

export const selectedQuantity = writable<number>(1);
