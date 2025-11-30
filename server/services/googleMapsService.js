import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const USE_FIELD_MASKING = process.env.GOOGLE_MAPS_USE_FIELD_MASKING === 'true';

// Category to Google Places type mapping
export const CATEGORY_TYPE_MAP = {
  stays: ['lodging', 'hotel', 'hostel'],
  fun: ['amusement_park', 'aquarium', 'bowling_alley', 'night_club', 'swimming_pool', 'casino', 'stadium'],
  sightseeing: ['tourist_attraction', 'park', 'museum', 'art_gallery', 'landmark', 'historical_landmark'],
  shopping: ['shopping_mall', 'market', 'department_store', 'clothing_store', 'souvenir_store'],
  transport: ['car_rental', 'bicycle_store', 'bus_station', 'train_station', 'airport'],
  food: ['restaurant', 'cafe', 'bakery', 'bar', 'meal_delivery', 'meal_takeaway']
};

// Field mask for cost optimization (only fetch essential fields)
const ESSENTIAL_FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.types',
  'places.photos',
  'places.priceLevel',
  'places.internationalPhoneNumber'
];

const DETAILED_FIELDS = [
  ...ESSENTIAL_FIELDS,
  'places.websiteUri',
  'places.regularOpeningHours',
  'places.reviews',
  'places.editorialSummary'
];

/**
 * Search for nearby places using Google Maps Places API (New)
 */
export const searchNearbyPlaces = async (options) => {
  try {
    const {
      location, // { lat, lng }
      category, // 'stays', 'fun', 'sightseeing', etc.
      radius = 5000, // meters
      maxResults = 20,
      includeDetails = false
    } = options;

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const types = CATEGORY_TYPE_MAP[category] || [];
    
    // Use Places API (New) - Nearby Search
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    
    const requestBody = {
      includedTypes: types,
      maxResultCount: maxResults,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: radius
        }
      },
      rankPreference: 'POPULARITY'
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': USE_FIELD_MASKING && !includeDetails 
        ? ESSENTIAL_FIELDS.join(',') 
        : DETAILED_FIELDS.join(',')
    };

    console.log(`🔍 Searching ${category} near (${location.lat}, ${location.lng})`);

    const response = await axios.post(url, requestBody, { headers });

    const places = (response.data.places || []).map(place => ({
      id: place.id,
      placeId: place.id,
      name: place.displayName?.text || 'Unnamed Place',
      category: mapTypeToCategory(place.types),
      location: {
        lat: place.location?.latitude,
        lng: place.location?.longitude
      },
      address: place.formattedAddress,
      rating: place.rating || 0,
      userRatingsTotal: place.userRatingCount || 0,
      priceLevel: place.priceLevel || 0,
      photos: place.photos?.slice(0, 3).map(photo => ({
        reference: photo.name,
        width: photo.widthPx,
        height: photo.heightPx
      })) || [],
      phone: place.internationalPhoneNumber,
      types: place.types || [],
      source: 'GOOGLE_SEARCH'
    }));

    console.log(`✅ Found ${places.length} places`);

    return {
      success: true,
      data: places,
      count: places.length
    };

  } catch (error) {
    console.error('Nearby search error:', error.response?.data || error.message);
    throw new Error(`Failed to search nearby places: ${error.message}`);
  }
};

/**
 * Get place details by Place ID
 */
export const getPlaceDetails = async (placeId) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const url = `https://places.googleapis.com/v1/${placeId}`;

    const headers = {
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': DETAILED_FIELDS.join(',')
    };

    console.log(`📍 Fetching details for: ${placeId}`);

    const response = await axios.get(url, { headers });
    const place = response.data;

    return {
      success: true,
      data: {
        id: place.id,
        placeId: place.id,
        name: place.displayName?.text,
        category: mapTypeToCategory(place.types),
        location: {
          lat: place.location?.latitude,
          lng: place.location?.longitude
        },
        address: place.formattedAddress,
        rating: place.rating,
        userRatingsTotal: place.userRatingCount,
        priceLevel: place.priceLevel,
        photos: place.photos?.map(photo => ({
          reference: photo.name,
          width: photo.widthPx,
          height: photo.heightPx
        })) || [],
        phone: place.internationalPhoneNumber,
        website: place.websiteUri,
        openingHours: place.regularOpeningHours?.weekdayDescriptions || [],
        reviews: place.reviews?.slice(0, 5).map(review => ({
          author: review.authorAttribution?.displayName,
          rating: review.rating,
          text: review.text?.text,
          time: review.publishTime
        })) || [],
        editorialSummary: place.editorialSummary?.text,
        types: place.types
      }
    };

  } catch (error) {
    console.error('Place details error:', error.response?.data || error.message);
    throw new Error(`Failed to get place details: ${error.message}`);
  }
};

/**
 * Get photo URL from photo reference
 */
export const getPhotoUrl = (photoReference, options = {}) => {
  if (!GOOGLE_MAPS_API_KEY || !photoReference) {
    return null;
  }

  const { maxWidth = 400, maxHeight = 400 } = options;

  // Extract the photo name from the reference
  const photoName = photoReference.includes('/')
    ? photoReference
    : `places/${photoReference}/photos/${photoReference}`;

  return `https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_MAPS_API_KEY}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
};

/**
 * Search for accommodations near end-of-day location
 */
export const findAccommodations = async (options) => {
  try {
    const {
      location,
      budget = 'moderate', // 'economy', 'moderate', 'luxury'
      maxResults = 10
    } = options;

    // Determine types based on budget
    const types = budget === 'economy' 
      ? ['hostel', 'guest_house', 'lodging']
      : budget === 'luxury'
      ? ['hotel', 'resort_hotel']
      : ['hotel', 'lodging'];

    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    
    const requestBody = {
      includedTypes: types,
      maxResultCount: maxResults,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: 3000 // 3km radius
        }
      },
      rankPreference: 'RATING'
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': ESSENTIAL_FIELDS.join(',')
    };

    console.log(`🏨 Finding ${budget} accommodations near (${location.lat}, ${location.lng})`);

    const response = await axios.post(url, requestBody, { headers });

    const accommodations = (response.data.places || []).map(place => ({
      id: place.id,
      placeId: place.id,
      name: place.displayName?.text,
      category: 'Stay',
      location: {
        lat: place.location?.latitude,
        lng: place.location?.longitude
      },
      address: place.formattedAddress,
      rating: place.rating || 0,
      userRatingsTotal: place.userRatingCount || 0,
      priceLevel: place.priceLevel || 0,
      photos: place.photos?.slice(0, 1).map(photo => ({
        reference: photo.name,
        width: photo.widthPx,
        height: photo.heightPx
      })) || [],
      phone: place.internationalPhoneNumber,
      types: place.types || [],
      source: 'GOOGLE_SEARCH'
    }));

    // Sort by rating
    accommodations.sort((a, b) => b.rating - a.rating);

    console.log(`✅ Found ${accommodations.length} accommodations`);

    return {
      success: true,
      data: accommodations,
      count: accommodations.length
    };

  } catch (error) {
    console.error('Accommodation search error:', error.response?.data || error.message);
    throw new Error(`Failed to find accommodations: ${error.message}`);
  }
};

/**
 * Map Google Place types to our category system
 */
const mapTypeToCategory = (types = []) => {
  if (types.some(t => ['restaurant', 'cafe', 'food', 'bakery', 'bar'].includes(t))) return 'Food';
  if (types.some(t => ['lodging', 'hotel', 'hostel'].includes(t))) return 'Stay';
  if (types.some(t => ['tourist_attraction', 'museum', 'park'].includes(t))) return 'Activity';
  if (types.some(t => ['car_rental', 'bus_station', 'train_station', 'airport'].includes(t))) return 'Transport';
  return 'Activity';
};

/**
 * Autocomplete suggestions for places (with session token for billing)
 */
export const getAutocompleteSuggestions = async (input, sessionToken = null) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    
    const requestBody = {
      input: input,
      sessionToken: sessionToken,
      includedPrimaryTypes: ['locality', 'administrative_area_level_1', 'country']
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY
    };

    const response = await axios.post(url, requestBody, { headers });

    const suggestions = (response.data.suggestions || []).map(suggestion => ({
      placeId: suggestion.placePrediction?.placeId,
      description: suggestion.placePrediction?.text?.text,
      mainText: suggestion.placePrediction?.structuredFormat?.mainText?.text,
      secondaryText: suggestion.placePrediction?.structuredFormat?.secondaryText?.text
    }));

    return {
      success: true,
      data: suggestions,
      sessionToken: sessionToken
    };

  } catch (error) {
    console.error('Autocomplete error:', error.response?.data || error.message);
    throw new Error(`Failed to get autocomplete suggestions: ${error.message}`);
  }
};

export default {
  searchNearbyPlaces,
  getPlaceDetails,
  getPhotoUrl,
  findAccommodations,
  getAutocompleteSuggestions,
  CATEGORY_TYPE_MAP
};
