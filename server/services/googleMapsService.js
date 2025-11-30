import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'google-maps-api-free.p.rapidapi.com';

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
 * Search for nearby places using RapidAPI Google Maps (Free)
 */
export const searchNearbyPlaces = async (location, category, radius = 5000) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const types = CATEGORY_TYPE_MAP[category] || ['tourist_attraction'];
    const type = types[0];
    
    // Use text search to find places near coordinates
    const query = `${type} near ${location.lat},${location.lng}`;
    const url = `https://${RAPIDAPI_HOST}/google-find-place-search`;
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        place: query,
        radius: radius,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.results) {
      return [];
    }

    const places = (response.data.results || []).slice(0, 20).map(place => ({
      id: place.place_id || place.id,
      name: place.name,
      address: place.vicinity || place.formatted_address || place.address,
      location: {
        lat: place.geometry?.location?.lat || place.lat,
        lng: place.geometry?.location?.lng || place.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || place.ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 3).map(p => p.photo_reference || p.reference) : [],
      isOpen: place.opening_hours?.open_now || place.open_now,
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : null,
      types: place.types || []
    }));

    return places;
  } catch (error) {
    console.error('Error searching nearby places:', error.message);
    // Return empty array instead of throwing to gracefully handle API errors
    return [];
  }
};

/**
 * Get place details by Place ID or name
 */
export const getPlaceDetails = async (placeId) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const url = `https://${RAPIDAPI_HOST}/google-find-place-search`;
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        place: placeId,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    
    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('Place not found');
    }

    const place = response.data.results[0];

    return {
      id: place.place_id || place.id,
      name: place.name,
      address: place.formatted_address || place.address || place.vicinity,
      location: {
        lat: place.geometry?.location?.lat || place.lat,
        lng: place.geometry?.location?.lng || place.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || place.ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 5).map(p => p.photo_reference || p.reference) : [],
      isOpen: place.opening_hours?.open_now || place.open_now,
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : null,
      types: place.types || [],
      website: place.website,
      phoneNumber: place.formatted_phone_number || place.phone,
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
  if (!RAPIDAPI_KEY || !photoReference) {
    return null;
  }

  // RapidAPI free version may not support photos, return placeholder
  return `https://via.placeholder.com/${maxWidth}x${maxWidth}?text=Photo+Not+Available`;
};

/**
 * Find accommodations (hotels, hostels, etc.)
 */
export const findAccommodations = async (location, budget = 'moderate', radius = 5000) => {
  try {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured');
    }

    const type = budget === 'economy' ? 'hostel' : budget === 'luxury' ? 'luxury hotel' : 'hotel';
    const query = `${type} near ${location.lat},${location.lng}`;
    
    const url = `https://${RAPIDAPI_HOST}/google-find-place-search`;
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        place: query,
        radius: radius,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.results) {
      return [];
    }

    const places = (response.data.results || []).map(place => ({
      id: place.place_id || place.id,
      name: place.name,
      address: place.vicinity || place.formatted_address || place.address,
      location: {
        lat: place.geometry?.location?.lat || place.lat,
        lng: place.geometry?.location?.lng || place.lng
      },
      rating: place.rating || 0,
      userRatings: place.user_ratings_total || place.ratings_total || 0,
      photos: place.photos ? place.photos.slice(0, 3).map(p => p.photo_reference || p.reference) : [],
      priceLevel: place.price_level || 0,
      types: place.types || []
    }));

    return places.slice(0, 10);
  } catch (error) {
    console.error('Error finding accommodations:', error.message);
    return [];
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

    const url = `https://${RAPIDAPI_HOST}/google-find-place-search`;
    
    const options = {
      method: 'GET',
      url: url,
      params: {
        place: input,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.results) {
      return [];
    }

    return (response.data.results || []).slice(0, 5).map(place => ({
      description: place.formatted_address || place.name,
      placeId: place.place_id || place.id,
      mainText: place.name,
      secondaryText: place.vicinity || place.address
    }));
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error.message);
    return [];
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
