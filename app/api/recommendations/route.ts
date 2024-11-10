import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'movie' | 'tv' || 'movie';
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const recommendations = await getRecommendations(type, page);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}