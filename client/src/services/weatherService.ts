import api from './api';

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  description: string;
  icon: string;
  visibility: number;
  dt: number;
}

export interface WeatherForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  tempDay: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  description: string;
  icon: string;
  pop: number;
  rain: number;
  clouds: number;
}

export interface OptimalDay {
  index: number;
  date: string;
  reason: string;
  score: number;
}

export interface WeatherData {
  success: boolean;
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  optimalDay: OptimalDay;
  location: {
    lat: number;
    lng: number;
  };
  timezone: number;
}

export interface AQIData {
  aqi: number;
  level: string;
  description: string;
  color: string;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  dt: number;
  location: {
    lat: number;
    lng: number;
  };
}

//  Get 5-day weather forecast

export const getWeatherForecast = async (lat: number, lng: number): Promise<WeatherData> => {
  const response = await api.get('/weather/forecast', {
    params: { lat, lng }
  });
  return response.data;
};
//for AQI
export const getAirQuality = async (lat: number, lng: number): Promise<AQIData> => {
  const response = await api.get('/weather/aqi', {
    params: { lat, lng }
  });
  return response.data;
};
// for optimal day 

export const getOptimalDay = async (lat: number, lng: number) => {
  const response = await api.get('/weather/optimal-day', {
    params: { lat, lng }
  });
  return response.data;
};


  // Get OpenWeather icon URL

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
