import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getTweet } from 'react-tweet/api';

const getCachedTweet = unstable_cache(
  async (id: string) => {
    try {
      const tweet = await getTweet(id);
      return tweet;
    } catch (error) {
      console.error('Error fetching tweet:', error);
      return null;
    }
  },
  ['tweet-cache'],
  { 
    revalidate: 86400, // 24 hours in seconds
    tags: ['tweet']
  }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Tweet ID is required' },
      { status: 400 }
    );
  }

  try {
    const tweet = await getCachedTweet(id);
    
    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      );
    }

    const tweetData = tweet;
    
    return NextResponse.json({ data: tweetData }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweet' },
      { status: 500 }
    );
  }
}
