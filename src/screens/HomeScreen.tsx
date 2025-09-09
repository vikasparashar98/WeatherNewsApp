import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Linking, ScrollView, Text, View } from 'react-native';
import { detectWeatherMood, getQueryForMood } from '../api/filter';
import { fetchTopHeadlines } from '../api/news';
import { fetchCurrentWeather } from '../api/weather';
import { SettingsContext } from '../context/SettingsContext';
import { NewsArticle } from '../types';

export const HomeScreen = () => {
  const router = useRouter();
  const { unit, categories } = useContext(SettingsContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [weatherDesc, setWeatherDesc] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    loadAll();
  }, [unit, categories]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      const w = await fetchCurrentWeather(lat, lon, unit);
      setCurrentTemp(w.temp); // already in user-selected unit
      setWeatherDesc(w.weather_description);

      const mood = detectWeatherMood(unit === 'metric' ? w.temp : (w.temp - 32) * 5 / 9);
      const moodQuery = getQueryForMood(mood);

      const fetched = await fetchTopHeadlines({
        q: moodQuery,
        pageSize: 30,
        language: 'en',
        category: categories[0] || 'general',
      });
      setArticles(fetched);
    } catch (e: any) {
      setError(String(e.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Weather</Text>

        {loading && currentTemp === null ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Text>
              Temperature: {currentTemp !== null ? currentTemp.toFixed(1) : '--'} °{unit === 'metric' ? 'C' : 'F'}
            </Text>
            <Text>Conditions: {weatherDesc}</Text>

            <View style={{ marginTop: 8 }}>
              <Button title="Refresh" onPress={loadAll} />
            </View>

            <View style={{ marginTop: 8 }}>
              <Button title="Settings" onPress={() => router.push('/settings')} />
            </View>
          </View>
        )}
      </View>

      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>News</Text>

        {loading && articles.length === 0 ? <ActivityIndicator /> : null}
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12, borderBottomWidth: 0.5, paddingBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text numberOfLines={2}>{item.description}</Text>
              <Text
                style={{ color: 'blue' }}
                onPress={() => Linking.openURL(item.url)}
              >
                Read more
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};
