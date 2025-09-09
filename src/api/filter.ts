// src/api/filter.ts
export function detectWeatherMood(tempC: number): 'cold' | 'cool' | 'hot' {
  if (tempC <= 10) return 'cold';
  if (tempC >= 25) return 'hot';
  return 'cool';
}

export function getQueryForMood(mood: 'cold' | 'cool' | 'hot'): string {
  switch (mood) {
    case 'cold':
      return '(tragedy OR disaster OR layoffs OR "economic downturn" OR crime OR fatal)';
    case 'hot':
      return '(attack OR terror OR "security breach" OR crisis OR "climate emergency" OR evacuation)';
    case 'cool':
      return '(win OR victory OR success OR awarded OR celebrate OR record)';
    default:
      return '';
  }
}
