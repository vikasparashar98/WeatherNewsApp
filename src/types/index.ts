// src/types/index.ts
export type Unit = 'metric' | 'imperial';

export interface WeatherCurrent {
  temp: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  weather_main: string;
  weather_description: string;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  weather_main: string;
  weather_description: string;
}

export interface NewsArticle {
  source: { id: string | null; name: string };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string;
  content?: string | null;
}
