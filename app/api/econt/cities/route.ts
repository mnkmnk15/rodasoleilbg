import { NextResponse } from 'next/server';
import { getEcontCities } from '@/lib/econt';

export async function GET() {
  try {
    const cities = await getEcontCities();
    return NextResponse.json({ cities });
  } catch (error: any) {
    console.error('Error fetching Econt cities:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
