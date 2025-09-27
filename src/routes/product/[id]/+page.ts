import type { PageLoad } from './$types';
import { products } from '$lib/data/products';
import { error } from '@sveltejs/kit'

export const load: PageLoad = ({ params }) => {
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw error(404, 'Produk tidak ditemukan');
  }

  return {
    product
  };
};
