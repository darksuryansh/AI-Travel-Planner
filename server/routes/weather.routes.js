import express from 'express';
import { getWeatherForecast, getAirQuality } from '../services/weatherService.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/weather/forecast
 * @desc    Get 7-day weather forecast for a location
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {string} [location] - Location name (optional, for display)
 */
router.get('/forecast', verifyAuth, async (req, res, next) => {
  try {
    const { lat, lng, location } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const coords = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const forecast = await getWeatherForecast(coords, location);

    res.json({
      success: true,
      location: forecast.location,
      forecast: forecast.daily,
      optimalDay: forecast.optimalDay,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/weather/aqi
 * @desc    Get Air Quality Index for a location
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {string} [location] - Location name (optional, for display)
 */
router.get('/aqi', verifyAuth, async (req, res, next) => {
  try {
    const { lat, lng, location } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const coords = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const airQuality = await getAirQuality(coords, location);

    res.json({
      success: true,
      location: airQuality.location,
      aqi: airQuality.aqi,
      level: airQuality.level,
      healthAdvice: airQuality.healthAdvice,
      components: airQuality.components,
      timestamp: airQuality.timestamp,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/weather/optimal-day
 * @desc    Calculate the best day to visit based on weather forecast
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {string} [location] - Location name (optional, for display)
 */
router.get('/optimal-day', verifyAuth, async (req, res, next) => {
  try {
    const { lat, lng, location } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const coords = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const forecast = await getWeatherForecast(coords, location);

    res.json({
      success: true,
      location: forecast.location,
      optimalDay: forecast.optimalDay,
      forecast: forecast.daily.slice(0, 3), // Include next 3 days for comparison
    });
  } catch (error) {
    next(error);
  }
});

export default router;
