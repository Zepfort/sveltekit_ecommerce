import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const url = event.url;
	const slug = url.searchParams.get('slug');
	const qtyParam = url.searchParams.get('qty');
	const qty = qtyParam ? parseInt(qtyParam) : 1;
	let fromCart = false;

	let items: Array<{ id: string; name: string; image_url: string; price: number; qty: number }> =
		[];

	if (slug) {
		// mode beli langsung
		const { data, error: fetchError } = await supabase
			.from('products')
			.select('*')
			.eq('slug', slug)
			.maybeSingle();

		if (fetchError) {
			console.error('Error fetching product for checkout:', fetchError);
			throw error(500, 'Error fetching product');
		}
		if (!data) {
			throw error(404, 'Produk tidak ditemukan');
		}

		items = [
			{
				id: data.id,
				name: data.name,
				image_url: data.image_url,
				price: typeof data.price === 'number' ? data.price : parseFloat(data.price),
				qty
			}
		];
		fromCart = false;
		// mode dari cart
	} else {
  // mode keranjang
  const user = event.locals.session?.user;
  let parsed: any[] = [];

  if (user) {
    const { data: cartRow, error: cartRowErr } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (cartRowErr) {
      console.error('Error fetching active cart for user:', cartRowErr);
      throw error(500, 'Error fetching user cart');
    }

    if (cartRow) {
      const cartId = cartRow.id;
      const { data: cartRows, error: cartItemsErr } = await supabase
        .from('cart_items')
        .select('product_id, qty')
        .eq('cart_id', cartId);

      if (cartItemsErr) {
        console.error('Error fetching cart_items:', cartItemsErr);
        throw error(500, 'Error fetching cart items');
      }

      parsed = cartRows || [];
    } else {
      parsed = [];
      console.log('No active cart found for user');
    }
  } else {
    // fallback cookie jika user tidak login
    const cookieCart = event.cookies.get('cart');
    if (cookieCart) {
      try {
        parsed = JSON.parse(cookieCart);
        
      } catch (e) {
        console.error('Invalid cart cookie:', e);
        parsed = [];
      }
    } else {
      // tidak ada cookie dan user tidak login
      parsed = [];
    }
  }

  for (const it of parsed) {
    if (!it.product_id || !it.qty) continue;

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, name, image_url, price')
      .eq('id', it.product_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching product from cart:', fetchError);
      continue;
    }
    if (!product) {
      console.warn('Product not found (removed) product_id:', it.product_id);
      continue;
    }

    items.push({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
      qty: it.qty
    });
  }

  fromCart = true;
}
	// hitung total
	const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

	return {
		items,
		total,
		fromCart
	};
};
