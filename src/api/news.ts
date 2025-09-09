// src/api/news.ts
import { NEWSAPI_API_KEY } from '../config';
import { NewsArticle } from '../types';

const NEWSAPI = 'https://newsapi.org/v2';

type FetchOptions = { q?: string; category?: string; pageSize?: number; language?: string; country?: string };

export async function fetchTopHeadlines(opts: FetchOptions = {}): Promise<NewsArticle[]> {
  const params = new URLSearchParams();
  params.append('apiKey', NEWSAPI_API_KEY);
  if (opts.category) params.append('category', opts.category);
  if (opts.q) params.append('q', opts.q);
  if (opts.country) params.append('country', opts.country);
  params.append('pageSize', String(opts.pageSize ?? 20));
  params.append('language', opts.language ?? 'en');

  const url = `${NEWSAPI}/top-headlines?${params.toString()}`;
  console.log('Fetching news URL:', url); // 🔥 Debug

  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`News fetch failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  console.log('News API response:', data); // 🔥 Debug

  if (!data.articles || data.articles.length === 0) {
    console.warn('No articles found, falling back to general news.');
    // fallback to general news
    const fallbackUrl = `${NEWSAPI}/top-headlines?apiKey=${NEWSAPI_API_KEY}&category=general&pageSize=20&language=en`;
    const fallbackRes = await fetch(fallbackUrl);
    const fallbackData = await fallbackRes.json();
    return fallbackData.articles as NewsArticle[];
  }

  return data.articles as NewsArticle[];
}
