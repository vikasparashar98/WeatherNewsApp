import React from 'react';
import { SettingsProvider } from '../src/context/SettingsContext';
import { HomeScreen } from '../src/screens/HomeScreen';

export default function HomePage() {
  return (
    <SettingsProvider>
      <HomeScreen />
    </SettingsProvider>
  );
}
