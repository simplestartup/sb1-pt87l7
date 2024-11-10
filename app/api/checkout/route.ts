import { NextResponse } from 'next/server';

export async function POST() {
  // For demo purposes, return a simple message
  return NextResponse.json({ 
    message: "This is a demo version. Stripe integration will be implemented in production." 
  });
}