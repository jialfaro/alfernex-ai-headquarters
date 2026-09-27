import { NextResponse } from 'next/server';
import { getFullHQState } from '@/lib/hqState';

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
  return NextResponse.json(state, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
