import { NextRequest, NextResponse } from 'next/server';
import { getEcontAllPoints } from '@/lib/econt';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cityId = searchParams.get('cityId');

    const offices = await getEcontAllPoints(
      cityId ? parseInt(cityId) : undefined
    );

    return NextResponse.json({ offices });
  } catch (error: any) {
    console.error('Error fetching Econt offices:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offices' },
      { status: 500 }
    );
  }
}
