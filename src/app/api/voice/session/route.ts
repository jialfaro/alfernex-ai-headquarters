import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const agentId = body.agentId || 'vyra-growth';
    const language = body.language || 'auto';

    // Generate short-lived secure session token (TTL 15 minutes)
    const sessionId = `alfernex-voice-${crypto.randomUUID()}`;
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const sessionToken = crypto.createHmac('sha256', 'alfernex-hq-secret-key-2026')
      .update(`${sessionId}:${agentId}:${expiresAt}`)
      .digest('hex');

    return NextResponse.json({
      success: true,
      sessionId,
      sessionToken,
      expiresAt,
      agentId,
      language,
      provider: 'alfernex-realtime-voice-v1',
      supportedTools: [
        'getSalesToday',
        'getTikTokMetrics',
        'getDropiInventory',
        'createAgentTask',
        'summonColleague'
      ]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize voice session' },
      { status: 500 }
    );
  }
}
