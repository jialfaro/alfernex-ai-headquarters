import { NextRequest, NextResponse } from 'next/server';
import { processHQChat } from '@/lib/hqState';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, message } = body;

    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message are required' }, { status: 400, headers: corsHeaders });
    }

    const result = processHQChat(agentId, message);
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 500, headers: corsHeaders });
  }
}
