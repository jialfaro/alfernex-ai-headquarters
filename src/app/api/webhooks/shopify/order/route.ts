import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationWhatsApp, WhatsAppOrderPayload } from '@/lib/whatsappService';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Shopify-Hmac-Sha256, X-Shopify-Topic',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if body is a Shopify webhook or a direct checkout order submission
    const isShopifyWebhook = !!body.line_items || !!body.order_number;

    let payload: WhatsAppOrderPayload;

    if (isShopifyWebhook) {
      // Extract from Shopify standard order format
      const customer = body.customer || {};
      const shippingAddress = body.shipping_address || body.billing_address || {};
      const rawPhone = body.phone || customer.phone || shippingAddress.phone || '';
      const customerName = `${customer.first_name || shippingAddress.first_name || 'Cliente'} ${customer.last_name || shippingAddress.last_name || ''}`.trim();

      const items = (body.line_items || []).map((li: any) => ({
        title: li.title || li.name || 'Producto ALFERNEX',
        quantity: li.quantity || 1,
        price: parseFloat(li.price || '0')
      }));

      payload = {
        orderId: String(body.id || `ORD-${Date.now()}`),
        orderNumber: String(body.order_number || body.name || `1001`),
        customerName: customerName || 'Cliente ALFERNEX',
        phone: rawPhone,
        items: items.length > 0 ? items : [{ title: 'TurboJet Pro 130K RPM', quantity: 1, price: 89.90 }],
        totalPricePEN: parseFloat(body.total_price || body.current_total_price || '89.90'),
        shippingAddress: {
          address1: shippingAddress.address1 || 'Dirección registrada',
          city: shippingAddress.city || 'Lima',
          province: shippingAddress.province || 'Lima',
          zip: shippingAddress.zip || '15001'
        },
        hasUpsell: (body.line_items || []).some((li: any) => (li.title || '').toLowerCase().includes('estuche') || (li.title || '').toLowerCase().includes('upsell')),
        notes: body.note || ''
      };
    } else {
      // Direct checkout format from custom checkout form
      payload = {
        orderId: String(body.orderId || `ORD-${Date.now()}`),
        orderNumber: String(body.orderNumber || `${Math.floor(1000 + Math.random() * 9000)}`),
        customerName: body.customerName || body.name || 'Cliente ALFERNEX',
        phone: body.phone || '',
        items: body.items || [{ title: body.productName || 'TurboJet Pro 130K RPM', quantity: body.quantity || 1, price: body.price || 89.90 }],
        totalPricePEN: parseFloat(body.totalPricePEN || body.price || '89.90'),
        shippingAddress: {
          address1: body.address || body.address1 || 'Av. Javier Prado 1234',
          city: body.city || 'Lima',
          province: body.province || 'Lima',
          zip: body.zip || '15001'
        },
        hasUpsell: !!body.hasUpsell,
        notes: body.notes || ''
      };
    }

    if (!payload.phone) {
      return NextResponse.json(
        { error: 'Phone number is required to dispatch WhatsApp confirmation' },
        { status: 400, headers: corsHeaders }
      );
    }

    const dispatchResult = await sendOrderConfirmationWhatsApp(payload);

    return NextResponse.json(
      {
        success: true,
        message: 'WhatsApp confirmation process triggered successfully',
        order: {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          customerName: payload.customerName,
          phone: dispatchResult.phoneNormalized,
          totalPricePEN: payload.totalPricePEN
        },
        whatsapp: dispatchResult
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[Shopify Order Webhook Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
