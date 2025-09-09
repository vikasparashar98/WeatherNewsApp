import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';

export const SettingsScreen = () => {
  const router = useRouter();
  const { unit, categories, save } = useContext(SettingsContext);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Settings</Text>

      <View style={{ marginTop: 16 }}>
        <Text>Temperature Unit</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ marginRight: 8 }}>Celsius</Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={async () => {
              const newUnit = unit === 'metric' ? 'imperial' : 'metric';
              await save({ unit: newUnit });
            }}
          />
          <Text style={{ marginLeft: 8 }}>Fahrenheit</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>News Categories</Text>
        <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
          {['general','business','technology','sports','health'].map(cat => (
            <View key={cat} style={{ margin: 4 }}>
              <Button title={cat} onPress={() => save({ categories: [cat] })} />
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </View>
  );
};
