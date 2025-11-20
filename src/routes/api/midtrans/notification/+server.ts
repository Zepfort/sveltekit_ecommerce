// import type { RequestHandler } from './$types';
// import { createSupabaseServerClient } from '$lib/supabaseServer';
// import crypto from 'crypto';
// import { MIDTRANS_SERVER_KEY } from '$env/static/private';

// function verifySignature(
//   orderId: string,
//   statusCode: string,
//   grossAmount: string,
//   signatureKey: string
// ): boolean {
//   const input = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
//   const hash = crypto.createHash('sha512').update(input).digest('hex');
//   return hash === signatureKey;
// }

// export const POST: RequestHandler = async (event) => {
//   const supabase = createSupabaseServerClient(event);

//   try {
    
//     const body = await event.request.json();
//     console.log('Incoming Midtrans notif headers:', Object.fromEntries(event.request.headers));
//     console.log('Incoming body:', event.request.body);

//     const {
//       order_id,
//       status_code,
//       gross_amount,
//       signature_key,
//       transaction_status,
//       fraud_status,
//       transaction_id,
//       payment_type
//     } = body as Record<string, string>;

//     // Verifikasi signature 
//     const isValid = verifySignature(order_id, status_code, gross_amount, signature_key);
//     if (!isValid) {
//       console.warn('Invalid signature from Midtrans', { order_id, signature_key });
//       return new Response('Invalid signature', { status: 400 });
//     }

//     // fetching order dari database
//     const { data: order, error: fetchError } = await supabase
//       .from('orders')
//       .select('id, status')
//       .eq('order_id', order_id)
//       .maybeSingle();

//     if (fetchError) {
//       console.error('Error fetching order:', fetchError);
//       return new Response('Error fetching order', { status: 500 });
//     }

//     if (!order) {
//       console.warn('Order not found:', order_id);
//       return new Response('Order not found', { status: 404 });
//     }

//     // Status baru berdasarkan status dari Midtrans
//     let newStatus: 'pending' | 'paid' | 'failed' = 'pending';

//     if (transaction_status === 'settlement' || transaction_status === 'capture') {
//       if (fraud_status === 'accept' || !fraud_status) {
//         newStatus = 'paid';
//       } else if (fraud_status === 'deny') {
//         newStatus = 'failed';
//       }
//     } else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
//       newStatus = 'failed';
//     } else if (transaction_status === 'pending') {
//       newStatus = 'pending';
//     }

//     // Tidak update ulang jika sudah paid
//     if (order.status === 'paid' && newStatus === 'paid') {
//       console.log(`Order ${order_id} already marked as paid, skipping update.`);
//       return new Response('OK', { status: 200 });
//     }

//     // Update status di Supabase
//     const { error: updateError } = await supabase
//       .from('orders')
//       .update({
//         status: newStatus,
//         transaction_id,
//         payment_type,
//         updated_at: new Date().toISOString()
//       })
//       .eq('order_id', order_id);

//     if (updateError) {
//       console.error('Error updating order status:', updateError);
//       return new Response('Error updating order', { status: 500 });
//     }

//     console.log(`Order ${order_id} updated to status: ${newStatus}`);

//     // Respons OK untuk Midtrans tidak melakukan retry
//     return new Response('OK', { status: 200 });
//   } catch (err) {
//     console.error(' Error in Midtrans notification handler:', err);
//     return new Response('Internal server error', { status: 500 });
//   }
// };

import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const POST: RequestHandler = async (event) => {
  try {
    // Read JSON body
    const body = await event.request.json();

    // Logging
    console.log('===== MIDTRANS TEST NOTIFICATION RECEIVED =====');
    console.log('Headers:', Object.fromEntries(event.request.headers));
    console.log('Body:', body);

    // !!! SIGNATURE VERIFICATION DIMATIKAN UNTUK TESTING !!!
    // !!! UPDATE DATABASE DIMATIKAN UNTUK TESTING !!!
    // Endpoint hanya return sukses supaya kamu bisa cek di Postman & Midtrans.

    return new Response('OK (Testing mode — signature bypassed)', { status: 200 });

  } catch (err) {
    console.error('Error in Midtrans notification test handler:', err);
    return new Response('Internal server error', { status: 500 });
  }
};
