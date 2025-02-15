import { getTwitterCredentials } from '@/lib/saveTwitterCredentials';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const twitterCredentials = await getTwitterCredentials(wallet);
    
    return NextResponse.json({
      isLinked: !!twitterCredentials,
      username: twitterCredentials?.screenName || null
    });
  } catch (error) {
    console.error('Error checking Twitter status:', error);
    return NextResponse.json({ error: 'Failed to check Twitter status' }, { status: 500 });
  }
} 