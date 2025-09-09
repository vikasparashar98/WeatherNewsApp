// src/api/weather.ts
import { OPENWEATHER_API_KEY } from '../config';
import { ForecastItem, WeatherCurrent } from '../types';

const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherCurrent> {
  const url = `${OPENWEATHER_API}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    wind_speed: data.wind?.speed,
    weather_main: data.weather?.[0]?.main,
    weather_description: data.weather?.[0]?.description,
  };
}

export async function fetchForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<ForecastItem[]> {
  const url = `${OPENWEATHER_API}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  const data = await res.json();
  return data.list.map((it: any) => ({
    dt: it.dt,
    temp: it.main.temp,
    weather_main: it.weather?.[0]?.main,
    weather_description: it.weather?.[0]?.description,
  }));
}
