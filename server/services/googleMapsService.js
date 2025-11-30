import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'google-maps28.p.rapidapi.com';

// Category to search type mapping
export const CATEGORY_TYPE_MAP = {
  stays: ['lodging', 'hotel', 'hostel'],
  fun: ['amusement_park', 'aquarium', 'night_club', 'casino'],
  sightseeing: ['tourist_attraction', 'museum', 'park', 'landmark'],
  shopping: ['shopping_mall', 'store'],
  transport: ['bus_station', 'train_station', 'airport'],
  food: ['restaurant', 'cafe', 'bakery', 'bar']
};

/**
 * Search for nearby places using RapidAPI Google Maps
 */
export const searchNearbyPlaces = async (location, category, radius = 5000) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const types = CATEGORY_TYPE_MAP[category] || ['tourist_attraction'];
    const type = types[0];
    
    const url = 'https://google-maps28.p.rapidapi.com/maps/api/place/nearbysearch/json';
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        location: `${location.lat},${location.lng}`,
        radius: radius,
        type: type,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`RapidAPI error: ${response.data.status}`);
    }

    const places = (response.data.results || []).slice(0, 20).map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 3).map(p => p.photo_reference) : [],
      isOpen: place.opening_hours?.open_now,
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : null,
      types: place.types || []
    }));

    return places;
  } catch (error) {
    console.error('Error searching nearby places:', error.message);
    throw error;
  }
};

/**
 * Get place details by Place ID
 */
export const getPlaceDetails = async (placeId) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const url = 'https://google-maps28.p.rapidapi.com/maps/api/place/details/json';
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        place_id: placeId,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    
    if (response.data.status !== 'OK') {
      throw new Error(`RapidAPI error: ${response.data.status}`);
    }

    const place = response.data.result;

    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 5).map(p => p.photo_reference) : [],
      isOpen: place.opening_hours?.open_now,
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : null,
      types: place.types || [],
      website: place.website,
      phoneNumber: place.formatted_phone_number,
      openingHours: place.opening_hours?.weekday_text || [],
      reviews: place.reviews?.slice(0, 5).map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })) || []
    };
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    throw error;
  }
};

/**
 * Get photo URL from photo reference
 */
export const getPhotoUrl = (photoReference, maxWidth = 800) => {
  if (!RAPIDAPI_KEY) {
    throw new Error('RapidAPI key not configured');
  }

  // RapidAPI photo endpoint
  return `https://google-maps28.p.rapidapi.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${RAPIDAPI_KEY}`;
};

/**
 * Find accommodations (hotels, hostels, etc.)
 */
export const findAccommodations = async (location, budget = 'moderate', radius = 5000) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const type = budget === 'economy' ? 'hostel' : budget === 'luxury' ? 'hotel' : 'lodging';
    
    const url = 'https://google-maps28.p.rapidapi.com/maps/api/place/nearbysearch/json';
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        location: `${location.lat},${location.lng}`,
        radius: radius,
        type: type,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`RapidAPI error: ${response.data.status}`);
    }

    // Filter by budget
    const places = (response.data.results || []).map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 3).map(p => p.photo_reference) : [],
      priceLevel: place.price_level || 0,
      types: place.types || []
    }));

    // Filter by price level based on budget
    let filteredPlaces = places;
    if (budget === 'economy') {
      filteredPlaces = places.filter(p => p.priceLevel <= 2);
    } else if (budget === 'moderate') {
      filteredPlaces = places.filter(p => p.priceLevel >= 2 && p.priceLevel <= 3);
    } else if (budget === 'luxury') {
      filteredPlaces = places.filter(p => p.priceLevel >= 3);
    }

    return filteredPlaces.slice(0, 10);
  } catch (error) {
    console.error('Error finding accommodations:', error.message);
    throw error;
  }
};

/**
 * Get autocomplete suggestions
 */
export const getAutocompleteSuggestions = async (input, sessionToken = null) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const url = 'https://google-maps28.p.rapidapi.com/maps/api/place/autocomplete/json';
    
    const params = {
      input: input,
      language: 'en'
    };

    if (sessionToken) {
      params.sessiontoken = sessionToken;
    }

    const options = {
      method: 'GET',
      url: url,
      params: params,
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`RapidAPI error: ${response.data.status}`);
    }

    return (response.data.predictions || []).map(prediction => ({
      description: prediction.description,
      placeId: prediction.place_id,
      mainText: prediction.structured_formatting?.main_text,
      secondaryText: prediction.structured_formatting?.secondary_text
    }));
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error.message);
    throw error;
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
