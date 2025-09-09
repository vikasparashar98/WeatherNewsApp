import React from 'react';
import { SettingsProvider } from '../src/context/SettingsContext';
import { SettingsScreen } from '../src/screens/SettingsScreen';

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsScreen />
    </SettingsProvider>
  );
}
