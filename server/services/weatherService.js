import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;



//  Get weather forecast using free 5-day forecast API (3-hour intervals)

export const getWeatherForecast = async (location) => {
  try {
    const { lat, lng } = location;
    
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured');
    }
    
    console.log(`🌤️  Fetching weather for (${lat}, ${lng})`);
    
    // Current weather API (Free tier)
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather`;
    const currentParams = {
      lat: lat,
      lon: lng,
      units: 'metric',
      appid: OPENWEATHER_API_KEY
    };

    const currentResponse = await axios.get(currentUrl, { params: currentParams });
    const currentData = currentResponse.data;

    // 5-day forecast API - 3-hour intervals (Free tier)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast`;
    const forecastParams = {
      lat: lat,
      lon: lng,
      units: 'metric',
      appid: OPENWEATHER_API_KEY
    };

    const forecastResponse = await axios.get(forecastUrl, { params: forecastParams });
    const forecastData = forecastResponse.data;

    // Current weather
    const current = {
      temp: currentData.main.temp,
      feelsLike: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      weather: currentData.weather[0].main,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      visibility: currentData.visibility / 1000,
      dt: currentData.dt
    };

    // Aggregate 3-hour forecasts into daily
    const dailyMap = {};
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          temps: [],
          humidity: [],
          windSpeed: [],
          weather: [],
          pop: [],
          rain: 0,
          icon: item.weather[0].icon
        };
      }
      dailyMap[date].temps.push(item.main.temp);
      dailyMap[date].humidity.push(item.main.humidity);
      dailyMap[date].windSpeed.push(item.wind.speed);
      dailyMap[date].weather.push(item.weather[0].main);
      dailyMap[date].pop.push(item.pop || 0);
      dailyMap[date].rain += item.rain?.['3h'] || 0;
    });

    const daily = Object.entries(dailyMap).map(([date, data]) => ({
      date: date,
      tempMin: Math.min(...data.temps),
      tempMax: Math.max(...data.temps),
      tempDay: data.temps.reduce((a, b) => a + b) / data.temps.length,
      humidity: data.humidity.reduce((a, b) => a + b) / data.humidity.length,
      windSpeed: data.windSpeed.reduce((a, b) => a + b) / data.windSpeed.length,
      weather: data.weather[0],
      description: data.weather[0],
      icon: data.icon,
      pop: Math.max(...data.pop),
      rain: data.rain,
      clouds: 0
    }));

    const optimalDay = calculateOptimalDay(daily);
    
    console.log(`✅ Weather fetched. Optimal day: Day ${optimalDay.index + 1}`);

    return {
      success: true,
      data: {
        current: current,
        daily: daily.slice(0, 5), // Max 5 days on free tier
        optimalDay: {
          index: optimalDay.index,
          date: optimalDay.date,
          reason: optimalDay.reason,
          score: optimalDay.score
        },
        timezone: forecastData.city.timezone,
        location: { lat, lng }
      }
    };

  } catch (error) {
    console.error('Weather forecast error:', error.response?.data || error.message);
    throw new Error(`Failed to get weather forecast: ${error.message}`);
  }
};


/**
 * Get Air Quality Index (AQI) for a location
 */
export const getAirQuality = async (location) => {
  try {
    const { lat, lng } = location;

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured');
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution`;
    
    const params = {
      lat: lat,
      lon: lng,
      appid: OPENWEATHER_API_KEY
    };

    console.log(`🌫️  Fetching AQI for (${lat}, ${lng})`);

    const response = await axios.get(url, { params });
    const data = response.data;

    if (!data.list || data.list.length === 0) {
      throw new Error('No AQI data available');
    }

    const aqi = data.list[0];

    const aqiLevel = getAQILevel(aqi.main.aqi);

    console.log(`✅ AQI fetched: ${aqiLevel.label} (${aqi.main.aqi})`);

    return {
      success: true,
      data: {
        aqi: aqi.main.aqi,
        level: aqiLevel.label,
        description: aqiLevel.description,
        color: aqiLevel.color,
        components: {
          co: aqi.components.co,      // Carbon monoxide
          no: aqi.components.no,      // Nitrogen monoxide
          no2: aqi.components.no2,    // Nitrogen dioxide
          o3: aqi.components.o3,      // Ozone
          so2: aqi.components.so2,    // Sulphur dioxide
          pm2_5: aqi.components.pm2_5, // PM2.5
          pm10: aqi.components.pm10,   // PM10
          nh3: aqi.components.nh3     // Ammonia
        },
        dt: aqi.dt,
        location: { lat, lng }
      }
    };

  } catch (error) {
    console.error('AQI error:', error.response?.data || error.message);
    throw new Error(`Failed to get AQI: ${error.message}`);
  }
};

/**
 * Calculate optimal day based on weather conditions
 */
const calculateOptimalDay = (dailyForecast) => {
  let bestDay = { index: 0, date: dailyForecast[0].date, score: -1000, reason: '' };

  dailyForecast.forEach((day, index) => {
    let score = 100; // Start with perfect score
    
    // Temperature score (ideal: 18-25°C)
    const avgTemp = (day.tempMin + day.tempMax) / 2;
    if (avgTemp >= 18 && avgTemp <= 25) {
      score += 20;
    } else if (avgTemp < 10 || avgTemp > 35) {
      score -= 30;
    } else {
      score -= Math.abs(21.5 - avgTemp) * 2;
    }

    // Rain penalty
    if (day.pop > 0.5) {
      score -= 40;
    } else if (day.pop > 0.3) {
      score -= 20;
    }

    if (day.rain > 5) {
      score -= 30;
    }

    // Weather condition score
    const weatherLower = day.weather.toLowerCase();
    if (weatherLower.includes('clear') || weatherLower.includes('sunny')) {
      score += 30;
    } else if (weatherLower.includes('cloud')) {
      score += 10;
    } else if (weatherLower.includes('rain')) {
      score -= 40;
    } else if (weatherLower.includes('storm')) {
      score -= 50;
    }

    // Wind penalty
    if (day.windSpeed > 10) {
      score -= 20;
    }

    // UV Index (if available)
    if (day.uvi && day.uvi > 8) {
      score -= 10; // Very high UV
    }

    if (score > bestDay.score) {
      bestDay = {
        index: index,
        date: day.date,
        score: score,
        reason: generateReasonText(day)
      };
    }
  });

  return bestDay;
};

/**
 * Generate reason text for optimal day
 */
const generateReasonText = (day) => {
  const reasons = [];
  
  const avgTemp = (day.tempMin + day.tempMax) / 2;
  if (avgTemp >= 18 && avgTemp <= 25) {
    reasons.push('pleasant temperature');
  }
  
  if (day.pop < 0.2) {
    reasons.push('low chance of rain');
  }
  
  if (day.weather.toLowerCase().includes('clear')) {
    reasons.push('clear skies');
  }
  
  if (day.windSpeed < 5) {
    reasons.push('calm winds');
  }

  return reasons.length > 0 
    ? `Best day due to ${reasons.join(', ')}.`
    : 'Most favorable conditions overall.';
};

/**
 * Get AQI level information
 */
const getAQILevel = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: 'Good',
        description: 'Air quality is satisfactory',
        color: '#50f0e6'
      };
    case 2:
      return {
        label: 'Fair',
        description: 'Air quality is acceptable',
        color: '#50ccaa'
      };
    case 3:
      return {
        label: 'Moderate',
        description: 'Sensitive individuals should consider reducing prolonged outdoor activities',
        color: '#f0e641'
      };
    case 4:
      return {
        label: 'Poor',
        description: 'People with respiratory issues should limit outdoor activities',
        color: '#ff5050'
      };
    case 5:
      return {
        label: 'Very Poor',
        description: 'Everyone should avoid prolonged outdoor activities',
        color: '#960032'
      };
    default:
      return {
        label: 'Unknown',
        description: 'AQI data unavailable',
        color: '#808080'
      };
  }
};

export default {
  getWeatherForecast,
  getAirQuality
};
