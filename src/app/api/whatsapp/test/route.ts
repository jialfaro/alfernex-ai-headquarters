import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationWhatsApp, handleIncomingWhatsAppMessage } from '@/lib/whatsappService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const testPhone = searchParams.get('phone') || '987654321';

  const testPayload = {
    orderId: `TEST-${Date.now().toString().slice(-4)}`,
    orderNumber: `1001`,
    customerName: 'Alexis Salazar',
    phone: testPhone,
    items: [
      {
        title: 'TurboJet Pro 130K RPM - Edición Titanio',
        quantity: 1,
        price: 89.90
      },
      {
        title: 'Estuche Rígido Protector EVA (Upsell)',
        quantity: 1,
        price: 25.00
      }
    ],
    totalPricePEN: 114.90,
    shippingAddress: {
      address1: 'Av. Javier Prado Este 4200, Dpto 802',
      city: 'Santiago de Surco, Lima',
      province: 'Lima',
      zip: '15023'
    },
    hasUpsell: true
  };

  const dispatchResult = await sendOrderConfirmationWhatsApp(testPayload);

  return NextResponse.json({
    status: 'Test WhatsApp Order Confirmation Generated',
    testOrder: testPayload,
    result: dispatchResult
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'simulate_reply') {
      const fromPhone = body.phone || '987654321';
      const text = body.message || '1';
      const reply = await handleIncomingWhatsAppMessage(fromPhone, text);
      return NextResponse.json({
        simulation: 'Customer reply handled by SOFIA',
        incoming: text,
        fromPhone,
        reply
      });
    }

    const testPayload = {
      orderId: body.orderId || `ORD-${Date.now().toString().slice(-4)}`,
      orderNumber: body.orderNumber || `${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: body.customerName || 'Cliente VIP',
      phone: body.phone || '987654321',
      items: body.items || [
        {
          title: body.productTitle || 'TurboJet Pro 130K RPM',
          quantity: 1,
          price: body.price || 89.90
        }
      ],
      totalPricePEN: body.totalPricePEN || body.price || 89.90,
      shippingAddress: {
        address1: body.address || 'Av. Benavides 1500',
        city: body.city || 'Miraflores, Lima',
        province: 'Lima'
      }
    };

    const result = await sendOrderConfirmationWhatsApp(testPayload);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
