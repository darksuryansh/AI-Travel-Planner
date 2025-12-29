import express from 'express';
import { getWeatherForecast, getAirQuality } from '../services/weatherService.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();


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

    const result = await getWeatherForecast(coords);

    res.json({
      success: true,
      current: result.data.current,
      forecast: result.data.daily,
      optimalDay: result.data.optimalDay,
      location: result.data.location,
      timezone: result.data.timezone,
    });
  } catch (error) {
    next(error);
  }
});


/**
 * @route   GET /api/weather/aqi
 * @desc    Get Air Quality Index for a location (Free API tier)
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 */
router.get('/aqi', verifyAuth, async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const coords = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const result = await getAirQuality(coords);

    res.json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/weather/optimal-day
 * @desc    Calculate the best day to visit based on 5-day weather forecast
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 */
router.get('/optimal-day', verifyAuth, async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const coords = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const result = await getWeatherForecast(coords);

    res.json({
      success: true,
      location: result.data.location,
      optimalDay: result.data.optimalDay,
      forecast: result.data.daily.slice(0, 3), // Include next 3 days for comparison
    });
  } catch (error) {
    next(error);
  }
});

export default router;
