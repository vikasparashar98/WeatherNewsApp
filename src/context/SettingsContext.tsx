// src/context/SettingsContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Unit } from '../types';

type SettingsContextType = {
  unit: Unit;
  categories: string[];
  save: (payload: Partial<{ unit: Unit; categories: string[] }>) => Promise<void>;
};

const defaultState: SettingsContextType = {
  unit: 'metric',
  categories: ['general'],
  save: async () => {},
};

export const SettingsContext = createContext<SettingsContextType>(defaultState);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<Unit>('metric');
  const [categories, setCategories] = useState<string[]>(['general']);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('settings_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUnit(parsed.unit ?? 'metric');
          setCategories(parsed.categories ?? ['general']);
        }
      } catch (e) {
        console.warn('Failed to load settings', e);
      }
    })();
  }, []);

  const save = async (payload: Partial<{ unit: Unit; categories: string[] }>) => {
    const newUnit = payload.unit ?? unit;
    const newCategories = payload.categories ?? categories;
    setUnit(newUnit);
    setCategories(newCategories);
    await AsyncStorage.setItem('settings_v1', JSON.stringify({ unit: newUnit, categories: newCategories }));
  };

  return <SettingsContext.Provider value={{ unit, categories, save }}>{children}</SettingsContext.Provider>;
};
