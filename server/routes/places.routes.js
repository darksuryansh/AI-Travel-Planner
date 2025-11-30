import express from 'express';
import { searchNearbyPlaces, getPlaceDetails, getPhotoUrl, findAccommodations, getAutocompleteSuggestions } from '../services/googleMapsService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/places/nearby
 * @desc    Search nearby places by category
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {string} category - Category (stays|fun|sightseeing|shopping|transport|food)
 * @query   {number} [radius=2000] - Search radius in meters
 */
router.get('/nearby', authenticateToken, async (req, res, next) => {
  try {
    const { lat, lng, category, radius = 2000 } = req.query;

    if (!lat || !lng || !category) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng, category',
      });
    }

    const location = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const places = await searchNearbyPlaces(location, category, parseInt(radius));

    res.json({
      success: true,
      category,
      location,
      radius: parseInt(radius),
      count: places.length,
      places,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/places/:placeId
 * @desc    Get detailed information about a specific place
 * @access  Private
 */
router.get('/:placeId', authenticateToken, async (req, res, next) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        error: 'Place ID is required',
      });
    }

    const placeDetails = await getPlaceDetails(placeId);

    res.json({
      success: true,
      place: placeDetails,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/places/photo/:photoReference
 * @desc    Get photo URL for a Google Places photo reference
 * @access  Private
 * @query   {number} [maxWidth=800] - Maximum photo width
 */
router.get('/photo/:photoReference', authenticateToken, async (req, res, next) => {
  try {
    const { photoReference } = req.params;
    const { maxWidth = 800 } = req.query;

    if (!photoReference) {
      return res.status(400).json({
        error: 'Photo reference is required',
      });
    }

    const photoUrl = getPhotoUrl(photoReference, parseInt(maxWidth));

    res.json({
      success: true,
      photoUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/places/accommodations/search
 * @desc    Find accommodations (hotels, hostels) based on location and budget
 * @access  Private
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {string} [budget=moderate] - Budget level (economy|moderate|luxury)
 * @query   {number} [radius=5000] - Search radius in meters
 */
router.get('/accommodations/search', authenticateToken, async (req, res, next) => {
  try {
    const { lat, lng, budget = 'moderate', radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng',
      });
    }

    const location = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const accommodations = await findAccommodations(location, budget, parseInt(radius));

    res.json({
      success: true,
      budget,
      location,
      radius: parseInt(radius),
      count: accommodations.length,
      accommodations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/places/autocomplete
 * @desc    Get autocomplete suggestions for place search
 * @access  Private
 * @query   {string} input - Search query
 * @query   {string} [sessionToken] - Session token for billing optimization
 */
router.get('/autocomplete', authenticateToken, async (req, res, next) => {
  try {
    const { input, sessionToken } = req.query;

    if (!input) {
      return res.status(400).json({
        error: 'Search input is required',
      });
    }

    const suggestions = await getAutocompleteSuggestions(input, sessionToken);

    res.json({
      success: true,
      input,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
