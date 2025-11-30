import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { weatherService, type WeatherData } from '../services/weatherService';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface WeatherWidgetProps {
  location: string;
}

export default function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, [location]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await weatherService.getWeatherForecast(location);
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="size-6 text-yellow-400" />;
      case 'rainy':
        return <CloudRain className="size-6 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="size-6 text-gray-400" />;
      case 'partly-cloudy':
        return <Sun className="size-6 text-yellow-300" />;
      default:
        return <Sun className="size-6 text-yellow-400" />;
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (aqi <= 100) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (aqi <= 150) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (aqi <= 200) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-xl border-border">
        <p className="text-muted-foreground">Unable to load weather data</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-foreground">Weather Forecast</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <Sun className="size-5" />
          <span className="text-2xl">{Math.round(weather.current.temperature)}°C</span>
        </div>
      </div>

      {/* AQI Card */}
      <Card className={`p-4 border ${getAQIColor(weather.aqi.aqi)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Air Quality Index</p>
            <p className="text-xl">{weather.aqi.aqi}</p>
            <p className="text-xs mt-1">{weather.aqi.category}</p>
          </div>
          <div className="text-right">
            <AlertCircle className="size-8 mb-1 mx-auto" />
            <p className="text-xs opacity-80">{weather.aqi.mainPollutant}</p>
          </div>
        </div>
      </Card>

      {/* Best Day to Visit */}
      <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <TrendingUp className="size-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-yellow-400">Best Day to Visit</p>
            <p className="text-foreground">
              {new Date(weather.bestDayToVisit.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {weather.bestDayToVisit.reason}
            </p>
          </div>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <Card className="p-4 bg-card/50 backdrop-blur-xl border-border">
        <h4 className="text-sm text-foreground mb-3">7-Day Forecast</h4>
        <div className="space-y-2">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                weather.bestDayToVisit.date === day.date
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-muted-foreground w-12">{day.dayOfWeek}</span>
                {getWeatherIcon(day.condition)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">
                      {day.temperature.max}° / {day.temperature.min}°
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Droplets className="size-3" />
                  <span>{Math.round(day.precipitation)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="size-3" />
                  <span>{Math.round(day.windSpeed)}km/h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-card/30 backdrop-blur border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Droplets className="size-4" />
            <span className="text-xs">Humidity</span>
          </div>
          <p className="text-foreground">{Math.round(weather.current.humidity)}%</p>
        </Card>
        <Card className="p-3 bg-card/30 backdrop-blur border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Wind className="size-4" />
            <span className="text-xs">Wind</span>
          </div>
          <p className="text-foreground">{Math.round(weather.current.windSpeed)} km/h</p>
        </Card>
      </div>
    </motion.div>
  );
}
