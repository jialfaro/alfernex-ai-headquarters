/**
 * ALFERNEX CORP - WhatsApp Business Automation Engine
 * Fully automated order confirmation and customer support for Cash on Delivery (Pago Contra Entrega) in Peru.
 * Integrates with Meta WhatsApp Cloud API and Agent SOFIA (Customer Happiness & Retention).
 */

import { generateGeminiAgentResponse } from './geminiAI';
import { recordNewOrder, updateOrderStatus, addHQActivity } from './hqState';
import { ShopifyOrder } from '../types/office';

export interface WhatsAppOrderPayload {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  phone: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  totalPricePEN: number;
  shippingAddress: {
    address1: string;
    city: string;
    province?: string;
    zip?: string;
  };
  hasUpsell?: boolean;
  notes?: string;
}

export interface WhatsAppDispatchResult {
  success: boolean;
  messageId?: string;
  phoneNormalized: string;
  waMeLink: string;
  messageText: string;
  provider: 'META_CLOUD_API' | 'DIRECT_DISPATCH_FALLBACK';
  status: 'SENT' | 'QUEUED' | 'SIMULATED';
  error?: string;
}

/**
 * Normalizes any Peruvian mobile number format to international WhatsApp format (519XXXXXXXX)
 */
export function normalizePeruvianPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  // Remove non-digit characters
  const cleaned = rawPhone.replace(/\D/g, '');

  // Case: already has 51 prefix and 9 digits (total 11 digits)
  if (cleaned.startsWith('51') && cleaned.length === 11) {
    return cleaned;
  }

  // Case: Peruvian 9-digit mobile starting with 9
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return `51${cleaned}`;
  }

  // Case: 09XXXXXXXX (10 digits)
  if (cleaned.length === 10 && cleaned.startsWith('09')) {
    return `51${cleaned.slice(1)}`;
  }

  // Fallback if international
  return cleaned;
}

/**
 * Formats a high-converting, reassuring WhatsApp confirmation message
 * specifically tailored for the Peruvian e-commerce market (Cash on Delivery / Pago Contra Entrega).
 */
export function formatOrderConfirmationMessage(order: WhatsAppOrderPayload): string {
  const firstName = order.customerName.split(' ')[0] || 'Cliente';
  const orderRef = order.orderNumber || order.orderId;
  const itemsList = order.items
    .map((item) => `• *${item.title}* (Cant: ${item.quantity}) - S/. ${item.price.toFixed(2)}`)
    .join('\n');
  const addressStr = `${order.shippingAddress.address1}, ${order.shippingAddress.city}${
    order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ''
  }`;

  return `¡Hola *${firstName}*! 👋 Te saludamos de *ALFERNEX STORE 🇵🇪*.

Acabamos de registrar tu pedido *#${orderRef}* con pago contra entrega.

📦 *Detalle de tu compra:*
${itemsList}

💰 *Total a pagar en tu puerta:* *S/. ${order.totalPricePEN.toFixed(2)} PEN*
📍 *Dirección de entrega:* ${addressStr}
🚚 *Envío:* Olva Courier / Shalom Express (24 a 48 hrs)
💳 *Medio de pago:* Efectivo o Yape / Plin al momento de recibir.

⚠️ *IMPORTANTE PARA EL DESPACHO:*
Para evitar pedidos falsos y autorizar la salida de tu paquete hoy mismo desde nuestro almacén en Callao, por favor responde a este mensaje:

👉 Escribe *"1"* o *"CONFIRMAR"* para autorizar el despacho inmediato.
👉 Escribe *"2"* si deseas corregir la dirección, el producto o el número.

_¡Gracias por comprar con seguridad y confianza en ALFERNEX!_`;
}

/**
 * Dispatches an automated WhatsApp order confirmation message.
 * Attempts Meta WhatsApp Cloud API first, and automatically generates wa.me dispatch fallback.
 */
export async function sendOrderConfirmationWhatsApp(
  order: WhatsAppOrderPayload
): Promise<WhatsAppDispatchResult> {
  const normalizedPhone = normalizePeruvianPhone(order.phone);
  const messageText = formatOrderConfirmationMessage(order);
  const waMeLink = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(messageText)}`;

  const metaToken = process.env.WHATSAPP_TOKEN || process.env.META_WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_ID;

  let dispatchResult: WhatsAppDispatchResult = {
    success: true,
    phoneNormalized: normalizedPhone,
    waMeLink,
    messageText,
    provider: 'DIRECT_DISPATCH_FALLBACK',
    status: 'QUEUED'
  };

  // If Meta WhatsApp Business Cloud API credentials are provided, call Meta Graph API
  if (metaToken && phoneId) {
    try {
      const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: messageText
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const msgId = data?.messages?.[0]?.id;
        dispatchResult = {
          success: true,
          messageId: msgId,
          phoneNormalized: normalizedPhone,
          waMeLink,
          messageText,
          provider: 'META_CLOUD_API',
          status: 'SENT'
        };
      } else {
        const errText = await response.text();
        console.warn('[WhatsApp Cloud API] Error sending message:', errText);
        dispatchResult.error = errText;
      }
    } catch (err: any) {
      console.error('[WhatsApp Cloud API] Exception in dispatch:', err);
      dispatchResult.error = err.message;
    }
  }

  // Record order in central HQ state
  const formattedOrder: ShopifyOrder = {
    id: order.orderId,
    name: order.customerName,
    phone: normalizedPhone,
    city: order.shippingAddress.city || 'Lima',
    address: order.shippingAddress.address1 || 'Dirección registrada',
    bundle: order.items[0]?.title || 'Producto ALFERNEX',
    price: order.totalPricePEN,
    final_price: order.totalPricePEN,
    has_upsell: !!order.hasUpsell,
    payment: 'Contra Entrega (Efectivo/Yape)',
    status: 'WHATSAPP_ENVIADO',
    suggested_courier: order.shippingAddress.city?.toLowerCase().includes('lima') ? 'Olva Express' : 'Shalom',
    tracking_number: `TRK-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString()
  };

  recordNewOrder(formattedOrder);

  // Broadcast HQ activity from SOFIA
  addHQActivity({
    agentName: 'SOFIA',
    agentHexColor: '#10b981',
    message: `WhatsApp de confirmación despachado a +${normalizedPhone} para orden #${order.orderNumber || order.orderId} (S/. ${order.totalPricePEN.toFixed(2)} PEN).`
  });

  return dispatchResult;
}

/**
 * Handles incoming customer WhatsApp messages via Agent SOFIA.
 * Classifies confirmations, corrections, or customer inquiries with Gemini Flash.
 */
export async function handleIncomingWhatsAppMessage(fromPhone: string, incomingText: string): Promise<{
  replyText: string;
  actionTaken: 'CONFIRMED' | 'QUESTION_ANSWERED' | 'ADDRESS_UPDATE_REQUESTED';
  orderId?: string;
}> {
  const normalized = normalizePeruvianPhone(fromPhone);
  const cleanMsg = incomingText.trim().toLowerCase();

  // 1. Check for quick confirmation intent ("1", "confirmar", "sí", "dale", "ok", "confirmo")
  const isConfirmation = /^(1|confirmar|confirmo|si|sí|dale|listo|ok|correcto|de acuerdo|afirmativo)\b/i.test(cleanMsg);

  if (isConfirmation) {
    updateOrderStatus(normalized, 'CONFIRMADO');

    addHQActivity({
      agentName: 'SOFIA',
      agentHexColor: '#10b981',
      message: `¡ORDEN CONFIRMADA POR WHATSAPP! Cliente (+${normalized}) autorizó el despacho. Notificando a ATLAS (Almacén Callao).`
    });

    const confirmationReply = `¡Excelente! 🎉 Tu pedido ha sido *CONFIRMADO CON ÉXITO*.

📦 Nuestro equipo en el almacén de Callao ya comenzó el empaque de tu producto.
🚚 Saldrá en el próximo despacho express de hoy con Olva Courier / Shalom.
📲 Te enviaremos tu guía de seguimiento apenas el repartidor esté en ruta a tu domicilio.

_Recuerda tener a mano el importe exacto o tu app de Yape/Plin al momento de recibir._ ¡Muchas gracias por tu compra!`;

    return {
      replyText: confirmationReply,
      actionTaken: 'CONFIRMED'
    };
  }

  // 2. Check for address or phone correction intent ("2", "cambiar", "corregir", "equivocado", "otra direccion")
  const isCorrection = /^(2|cambiar|corregir|modificar|otra direcci[oó]n|me equivoqu[eé])\b/i.test(cleanMsg);

  if (isCorrection) {
    addHQActivity({
      agentName: 'SOFIA',
      agentHexColor: '#f59e0b',
      message: `Cliente (+${normalized}) solicitó corrección de datos de su pedido. SOFIA gestionando actualización.`
    });

    const correctionReply = `Entendido perfectamente. ✍️ Por favor indícanos aquí mismo:

1. Tu dirección completa corregida (calle, número, dpto o referencia).
2. Distrito y Ciudad.
3. Si deseas modificar la cantidad o agregar el Estuche Rígido protector (+S/. 25 PEN).

Un asesor de nuestro equipo actualizará tu guía de inmediato antes de que salga del almacén.`;

    return {
      replyText: correctionReply,
      actionTaken: 'ADDRESS_UPDATE_REQUESTED'
    };
  }

  // 3. For any other questions or doubts, delegate to SOFIA (Google Gemini Flash with specialized customer skills)
  const aiPrompt = `
Un cliente peruano que acaba de hacer un pedido contra entrega en ALFERNEX STORE (+51 ${normalized}) te pregunta por WhatsApp:
"${incomingText}"

Instrucciones para SOFIA:
1. Responde con calidez humana peruana, cortesía impecable y total tranquilidad.
2. Aclara que el pago es 100% SEGURO porque pagan únicamente cuando reciben el producto en sus manos (en efectivo o con Yape/Plin).
3. Plazo de entrega: Lima Metropolitana (24 horas) y Provincias (24 a 48 horas con Olva Courier o Shalom).
4. Garantía: 1 año de garantía oficial de ALFERNEX.
5. Pídele amablemente que si todo está claro, confirme su pedido con la palabra "CONFIRMAR" para despacharlo hoy mismo.
6. Mantén el mensaje en 2 a 4 párrafos cortos y directos con emojis profesionales.
`;

  const geminiResponse = await generateGeminiAgentResponse('sofia-support', aiPrompt);

  addHQActivity({
    agentName: 'SOFIA',
    agentHexColor: '#10b981',
    message: `SOFIA respondió consulta de WhatsApp de (+${normalized}) sobre: "${incomingText.slice(0, 30)}..."`
  });

  return {
    replyText: geminiResponse.reply,
    actionTaken: 'QUESTION_ANSWERED'
  };
}
