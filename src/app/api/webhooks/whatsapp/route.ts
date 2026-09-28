import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingWhatsAppMessage, normalizePeruvianPhone } from '@/lib/whatsappService';

export const dynamic = 'force-dynamic';

const DEFAULT_VERIFY_TOKEN = 'alfernex_secret_verify_token_2026';

/**
 * GET Handler for Meta Webhook Verification Challenge
 * Meta sends hub.mode, hub.verify_token, and hub.challenge to verify ownership
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const configuredToken = process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === configuredToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST Handler for Incoming Customer WhatsApp Messages
 * Listens for customer replies ("CONFIRMAR", questions, etc.) and routes to SOFIA
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check for Meta WhatsApp Cloud API webhook structure
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Might be a status update (delivered, read, etc.)
      return NextResponse.json({ status: 'ignored_status_update' }, { status: 200 });
    }

    const fromPhone = message.from; // e.g. "51987654321"
    const messageText = message.text?.body || message.button?.text || '';

    if (!fromPhone || !messageText) {
      return NextResponse.json({ status: 'no_message_content' }, { status: 200 });
    }

    // Process message with SOFIA AI
    const result = await handleIncomingWhatsAppMessage(fromPhone, messageText);

    // If Meta WhatsApp Business credentials exist, send reply back to WhatsApp
    const metaToken = process.env.WHATSAPP_TOKEN || process.env.META_WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_ID;

    if (metaToken && phoneId && result.replyText) {
      try {
        const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${metaToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: normalizePeruvianPhone(fromPhone),
            type: 'text',
            text: {
              preview_url: false,
              body: result.replyText
            }
          })
        });
      } catch (sendErr) {
        console.warn('[WhatsApp Reply Exception]:', sendErr);
      }
    }

    return NextResponse.json({
      success: true,
      actionTaken: result.actionTaken,
      replyText: result.replyText,
      from: fromPhone
    }, { status: 200 });
  } catch (err: any) {
    console.error('[WhatsApp Webhook Ingestion Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
