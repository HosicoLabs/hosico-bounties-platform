'use client';

import { useEffect, useState } from 'react';
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet';
import type { Tweet } from 'react-tweet/api';

async function fetchTweetData(id: string): Promise<Tweet | null> {
  try {
    const response = await fetch(`/api/tweet/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching tweet:', error);
    return null;
  }
}

export function CachedTweet({ id }: { id: string }) {
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    fetchTweetData(id)
      .then((data) => {
        setTweet(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <TweetSkeleton />;
  if (error || !tweet) return <TweetNotFound />;
  
  return <EmbeddedTweet tweet={tweet} />;
}
