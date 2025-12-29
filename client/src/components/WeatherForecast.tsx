import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { 
  getWeatherForecast, 
  getAirQuality, 
  getWeatherIconUrl,
  WeatherData,
  AQIData 
} from '../services/weatherService';
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Eye, 
  ThermometerSun,
  Calendar,
  TrendingUp,
  Sparkles,
  CloudRain,
  AlertTriangle
} from 'lucide-react';

interface WeatherForecastProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export default function WeatherForecast({ latitude, longitude, locationName }: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [weather, aqi] = await Promise.all([
          getWeatherForecast(latitude, longitude),
          getAirQuality(latitude, longitude).catch(() => null) // AQI is optional
        ]);

        setWeatherData(weather);
        setAqiData(aqi);
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        setError(err.response?.data?.error || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-40 w-32 flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!weatherData) return null;

  const { current, forecast, optimalDay } = weatherData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weather Forecast</h2>
          {locationName && (
            <p className="text-sm text-muted-foreground">{locationName}</p>
          )}
        </div>
      </div>

      {/* Current Weather - Large Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Current Weather
          </CardTitle>
          <CardDescription>
            {new Date(current.dt * 1000).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Temp Display */}
            <div className="flex items-center gap-4">
              <img 
                src={getWeatherIconUrl(current.icon)} 
                alt={current.description}
                className="w-24 h-24"
              />
              <div>
                <div className="text-5xl font-bold">{Math.round(current.temp)}°C</div>
                <p className="text-lg text-muted-foreground capitalize">{current.description}</p>
                <p className="text-sm text-muted-foreground">
                  Feels like {Math.round(current.feelsLike)}°C
                </p>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="  grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="font-semibold">{current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                  <p className="font-semibold">{current.windSpeed} m/s</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Visibility</p>
                  <p className="font-semibold">{current.visibility} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Condition</p>
                  <p className="font-semibold">{current.weather}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimal Day Highlight */}
      {optimalDay && (
        <Card className="bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Best Day to Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Date(optimalDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{optimalDay.reason}</p>
              </div>
              <div className="text-right">
                {/* <Badge variant="secondary" className="text-lg px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Score: {optimalDay.score}
                </Badge> */}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AQI Card */}
      {aqiData && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Air Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: aqiData.color + '20', color: aqiData.color }}
                >
                  AQI: - {aqiData.level}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{aqiData.description}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>PM2.5: {aqiData.components.pm2_5.toFixed(1)} µg/m³</div>
                <div>PM10: {aqiData.components.pm10.toFixed(1)} µg/m³</div>
                <div>O₃: {aqiData.components.o3.toFixed(1)} µg/m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5-Day Forecast - Horizontal Scroll */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          5-Day Forecast
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {forecast.map((day, index) => {
            const isOptimal = day.date === optimalDay?.date;
            return (
              <Card 
                key={day.date} 
                className={`flex-shrink-0 w-40 transition-all hover:shadow-lg ${
                  isOptimal 
                    ? 'border-2 border-green-200 bg-green-20 dark:bg-green-950' 
                    : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {index === 0 
                      ? 'Today' 
                      : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
                    }
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-center">
                    <img 
                      src={getWeatherIconUrl(day.icon)} 
                      alt={day.description}
                      className="w-16 h-16"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground capitalize">{day.weather}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <ThermometerSun className="h-3 w-3 text-orange-500" />
                      <span className="text-lg font-bold">{Math.round(day.tempMax)}°</span>
                      <span className="text-sm text-muted-foreground">/ {Math.round(day.tempMin)}°</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {day.pop > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <CloudRain className="h-3 w-3" />
                        <span>{Math.round(day.pop * 100)}% rain</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Wind className="h-3 w-3" />
                      <span>{day.windSpeed.toFixed(1)} m/s</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Droplets className="h-3 w-3" />
                      <span>{Math.round(day.humidity)}%</span>
                    </div>
                  </div>

                  {isOptimal && (
                    <Badge className="w-full text-black justify-center bg-green-200">
                      {/* <Sparkles className="h-3 w-3 mr-1" /> */}
                      Best Day
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
