import { NextRequest, NextResponse } from 'next/server';
import { broadcastNewDirective, getFullHQState } from '@/lib/hqState';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const state = getFullHQState();
  return NextResponse.json({ success: true, directives: state.directives }, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, priority, assignedAgentIds } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400, headers: corsHeaders });
    }

    const result = broadcastNewDirective({
      title,
      description: description || '',
      priority: priority || 'MÁXIMA',
      assignedAgentIds: assignedAgentIds || []
    });

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 500, headers: corsHeaders });
  }
}
