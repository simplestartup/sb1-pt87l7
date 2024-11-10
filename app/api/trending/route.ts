import { NextResponse } from 'next/server';
import { getTrendingContent } from '@/lib/tmdb';

export async function GET() {
  try {
    const trending = await getTrendingContent();
    return NextResponse.json(trending);
  } catch (error) {
    console.error('Error in trending API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    );
  }
}