// Mock Weather API Service
// Simulates weather forecast and AQI data

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy' | 'stormy';
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

export interface AQIData {
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  mainPollutant: string;
  color: string;
}

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
  forecast: DailyForecast[];
  aqi: AQIData;
  bestDayToVisit: {
    date: string;
    reason: string;
  };
}

// Mock weather data generator
const weatherConditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'] as const;
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateMockForecast(startDate: Date, days: number = 7): DailyForecast[] {
  const forecast: DailyForecast[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const baseTemp = 20 + Math.random() * 10;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: weekDays[date.getDay()],
      temperature: {
        min: Math.round(baseTemp - 5),
        max: Math.round(baseTemp + 5),
        avg: Math.round(baseTemp),
      },
      condition,
      precipitation: condition === 'rainy' ? 60 + Math.random() * 40 : Math.random() * 20,
      humidity: 50 + Math.random() * 40,
      windSpeed: 5 + Math.random() * 15,
      uvIndex: Math.floor(Math.random() * 11),
      icon: getWeatherIcon(condition),
    });
  }
  
  return forecast;
}

function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    'partly-cloudy': '⛅',
    stormy: '⛈️',
  };
  return icons[condition] || '☀️';
}

function calculateAQI(location: string): AQIData {
  // Generate random but realistic AQI
  const aqi = Math.floor(Math.random() * 150);
  
  let category: AQIData['category'];
  let color: string;
  
  if (aqi <= 50) {
    category = 'Good';
    color = '#10b981';
  } else if (aqi <= 100) {
    category = 'Moderate';
    color = '#facc15';
  } else if (aqi <= 150) {
    category = 'Unhealthy for Sensitive Groups';
    color = '#f59e0b';
  } else if (aqi <= 200) {
    category = 'Unhealthy';
    color = '#ef4444';
  } else if (aqi <= 300) {
    category = 'Very Unhealthy';
    color = '#dc2626';
  } else {
    category = 'Hazardous';
    color = '#991b1b';
  }
  
  const pollutants = ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'];
  
  return {
    aqi,
    category,
    mainPollutant: pollutants[Math.floor(Math.random() * pollutants.length)],
    color,
  };
}

function findBestDay(forecast: DailyForecast[]): { date: string; reason: string } {
  // Find day with best weather (sunny, low precipitation, moderate temperature)
  let bestDay = forecast[0];
  let bestScore = -1;
  
  forecast.forEach(day => {
    let score = 0;
    
    // Prefer sunny/partly cloudy
    if (day.condition === 'sunny') score += 10;
    if (day.condition === 'partly-cloudy') score += 8;
    
    // Prefer low precipitation
    score += (100 - day.precipitation) / 10;
    
    // Prefer moderate temperatures (20-25°C)
    const tempDiff = Math.abs(day.temperature.avg - 22.5);
    score += Math.max(0, 10 - tempDiff);
    
    // Prefer lower UV index
    score += Math.max(0, 10 - day.uvIndex);
    
    if (score > bestScore) {
      bestScore = score;
      bestDay = day;
    }
  });
  
  const reasons = [];
  if (bestDay.condition === 'sunny' || bestDay.condition === 'partly-cloudy') {
    reasons.push('perfect weather');
  }
  if (bestDay.precipitation < 20) {
    reasons.push('low chance of rain');
  }
  if (bestDay.temperature.avg >= 20 && bestDay.temperature.avg <= 25) {
    reasons.push('ideal temperature');
  }
  
  return {
    date: bestDay.date,
    reason: reasons.join(', ') || 'best available conditions',
  };
}

export const weatherService = {
  /**
   * Get 7-day weather forecast with AQI and best day recommendation
   */
  async getWeatherForecast(location: string): Promise<WeatherData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startDate = new Date();
    const forecast = generateMockForecast(startDate, 7);
    const aqi = calculateAQI(location);
    const bestDay = findBestDay(forecast);
    
    return {
      location,
      current: {
        temperature: forecast[0].temperature.avg,
        condition: forecast[0].condition,
        feelsLike: forecast[0].temperature.avg + (Math.random() - 0.5) * 3,
        humidity: forecast[0].humidity,
        windSpeed: forecast[0].windSpeed,
      },
      forecast,
      aqi,
      bestDayToVisit: bestDay,
    };
  },
  
  /**
   * Get current AQI only
   */
  async getAQI(location: string): Promise<AQIData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return calculateAQI(location);
  },
};

// Mock location-specific data
export const locationData = {
  'Tokyo, Japan': {
    timezone: 'Asia/Tokyo',
    bestMonths: ['March', 'April', 'October', 'November'],
    averageTemp: { spring: 18, summer: 27, fall: 20, winter: 8 },
  },
  'Paris, France': {
    timezone: 'Europe/Paris',
    bestMonths: ['May', 'June', 'September', 'October'],
    averageTemp: { spring: 14, summer: 24, fall: 15, winter: 6 },
  },
  'New York, USA': {
    timezone: 'America/New_York',
    bestMonths: ['April', 'May', 'September', 'October'],
    averageTemp: { spring: 15, summer: 27, fall: 17, winter: 3 },
  },
};
