import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { saveTwitterCredentials } from '@/lib/saveTwitterCredentials';
import { NextResponse } from 'next/server';
const TWITTER_API_KEY = process.env.TWITTER_API_KEY!;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET!;

const oauth = new OAuth({
  consumer: {
    key: TWITTER_API_KEY,
    secret: TWITTER_API_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const oauth_token = url.searchParams.get('oauth_token');
  const oauth_verifier = url.searchParams.get('oauth_verifier');
  const wallet = url.searchParams.get('wallet');
  const origin = url.searchParams.get('origin');

  if (!oauth_token || !oauth_verifier || !wallet) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Exchange request token for access token
    const requestData = {
      url: 'https://api.twitter.com/oauth/access_token',
      method: 'POST',
      data: {
        oauth_token,
        oauth_verifier
      },
    };

    const response = await fetch(requestData.url, {
      method: 'POST',
      headers: {
        ...oauth.toHeader(oauth.authorize(requestData)),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.text();
    const params = new URLSearchParams(data);

    const accessToken = params.get('oauth_token');
    const accessTokenSecret = params.get('oauth_token_secret');
    const userId = params.get('user_id');
    const screenName = params.get('screen_name');

    if (!accessToken || !accessTokenSecret || !userId || !screenName) {
      throw new Error('Missing Twitter credentials');
    }

    // Save Twitter credentials to MongoDB
    await saveTwitterCredentials(wallet as string, {
      accessToken,
      accessTokenSecret,
      userId,
      screenName
    });

    // console.log('origin', origin);
    // Close the popup and notify the parent window
    return new NextResponse(
      `
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'TWITTER_AUTH_SUCCESS', 
                screenName: '${screenName}',
                userId: '${userId}'
              }, '${origin || '*'}');
              window.close();
            </script>
          </body>
        </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.json({ error: 'Failed to complete Twitter authentication' }, { status: 500 });
  }
} 