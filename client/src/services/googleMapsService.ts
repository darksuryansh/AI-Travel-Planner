// Mock Google Maps API Service
// Simulates Google Maps Platform API responses with Field Masking

export interface PlacePhoto {
  url: string;
  attribution: string;
}

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface GooglePlace {
  id: string;
  placeId: string;
  name: string;
  location: PlaceLocation;
  rating?: number;
  photoUrl?: string;
  photos?: PlacePhoto[];
  category: string;
  priceLevel?: number;
  openNow?: boolean;
  vicinity?: string;
}

export type PlaceCategory = 'lodging' | 'amusement_park' | 'tourist_attraction' | 'shopping_mall' | 'car_rental' | 'restaurant' | 'cafe' | 'night_club' | 'park' | 'museum';

// Mock data for different categories
const mockPlaces: Record<string, GooglePlace[]> = {
  lodging: [
    {
      id: '1',
      placeId: 'ChIJ1',
      name: 'Grand Tokyo Hotel',
      location: { lat: 35.6762, lng: 139.6503 },
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      category: 'lodging',
      priceLevel: 3,
      openNow: true,
      vicinity: 'Shibuya District',
    },
    {
      id: '2',
      placeId: 'ChIJ2',
      name: 'Sakura Capsule Hotel',
      location: { lat: 35.6764, lng: 139.6520 },
      rating: 4.5,
      photoUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      category: 'lodging',
      priceLevel: 1,
      openNow: true,
      vicinity: 'Shibuya, Near Station',
    },
    {
      id: '3',
      placeId: 'ChIJ3',
      name: 'Tokyo Bay Luxury Suites',
      location: { lat: 35.6758, lng: 139.6515 },
      rating: 4.9,
      photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      category: 'lodging',
      priceLevel: 4,
      openNow: true,
      vicinity: 'Odaiba Waterfront',
    },
  ],
  amusement_park: [
    {
      id: '4',
      placeId: 'ChIJ4',
      name: 'Tokyo Disneyland',
      location: { lat: 35.6329, lng: 139.8804 },
      rating: 4.8,
      photoUrl: 'https://images.unsplash.com/photo-1513735539099-cf6e5d583f64?w=800',
      category: 'amusement_park',
      priceLevel: 3,
      openNow: true,
      vicinity: 'Urayasu, Chiba',
    },
    {
      id: '5',
      placeId: 'ChIJ5',
      name: 'Joypolis Tokyo',
      location: { lat: 35.6246, lng: 139.7743 },
      rating: 4.6,
      photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      category: 'amusement_park',
      priceLevel: 2,
      openNow: true,
      vicinity: 'Odaiba',
    },
  ],
  tourist_attraction: [
    {
      id: '6',
      placeId: 'ChIJ6',
      name: 'Tokyo Tower',
      location: { lat: 35.6586, lng: 139.7454 },
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
      category: 'tourist_attraction',
      priceLevel: 2,
      openNow: true,
      vicinity: 'Minato City',
    },
    {
      id: '7',
      placeId: 'ChIJ7',
      name: 'Senso-ji Temple',
      location: { lat: 35.7148, lng: 139.7967 },
      rating: 4.9,
      photoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      category: 'tourist_attraction',
      priceLevel: 0,
      openNow: true,
      vicinity: 'Asakusa',
    },
    {
      id: '8',
      placeId: 'ChIJ8',
      name: 'Meiji Shrine',
      location: { lat: 35.6764, lng: 139.6993 },
      rating: 4.8,
      photoUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
      category: 'tourist_attraction',
      priceLevel: 0,
      openNow: true,
      vicinity: 'Shibuya, Yoyogi Park',
    },
  ],
  shopping_mall: [
    {
      id: '9',
      placeId: 'ChIJ9',
      name: 'Shibuya 109',
      location: { lat: 35.6608, lng: 139.6983 },
      rating: 4.5,
      photoUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
      category: 'shopping_mall',
      priceLevel: 2,
      openNow: true,
      vicinity: 'Shibuya Crossing',
    },
    {
      id: '10',
      placeId: 'ChIJ10',
      name: 'Ginza Six',
      location: { lat: 35.6706, lng: 139.7628 },
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=800',
      category: 'shopping_mall',
      priceLevel: 4,
      openNow: true,
      vicinity: 'Ginza District',
    },
  ],
  restaurant: [
    {
      id: '11',
      placeId: 'ChIJ11',
      name: 'Ichiran Ramen Shibuya',
      location: { lat: 35.6595, lng: 139.7004 },
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      category: 'restaurant',
      priceLevel: 1,
      openNow: true,
      vicinity: 'Shibuya Station',
    },
    {
      id: '12',
      placeId: 'ChIJ12',
      name: 'Sukiyabashi Jiro',
      location: { lat: 35.6717, lng: 139.7638 },
      rating: 4.9,
      photoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      category: 'restaurant',
      priceLevel: 4,
      openNow: false,
      vicinity: 'Ginza',
    },
  ],
  cafe: [
    {
      id: '13',
      placeId: 'ChIJ13',
      name: 'Starbucks Reserve Roastery',
      location: { lat: 35.6557, lng: 139.6989 },
      rating: 4.6,
      photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      category: 'cafe',
      priceLevel: 2,
      openNow: true,
      vicinity: 'Nakameguro',
    },
  ],
  park: [
    {
      id: '14',
      placeId: 'ChIJ14',
      name: 'Yoyogi Park',
      location: { lat: 35.6719, lng: 139.6963 },
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800',
      category: 'park',
      priceLevel: 0,
      openNow: true,
      vicinity: 'Shibuya',
    },
  ],
};

export const googleMapsService = {
  /**
   * Nearby Search with Field Masking
   * Only fetches: id, name, photos, rating, location
   */
  async searchNearby(
    location: PlaceLocation,
    category: PlaceCategory | PlaceCategory[],
    radius: number = 2000
  ): Promise<GooglePlace[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const categories = Array.isArray(category) ? category : [category];
    
    let results: GooglePlace[] = [];
    
    categories.forEach(cat => {
      if (mockPlaces[cat]) {
        results = [...results, ...mockPlaces[cat]];
      }
    });

    // Simulate radius filtering (simplified)
    return results.slice(0, 6);
  },

  /**
   * Get Place Details (expanded view only to save API costs)
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find place in mock data
    for (const category of Object.values(mockPlaces)) {
      const place = category.find(p => p.placeId === placeId);
      if (place) {
        return {
          ...place,
          photos: [
            { url: place.photoUrl || '', attribution: 'Google Maps' },
            { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800', attribution: 'Google Maps' },
          ],
        };
      }
    }
    
    return null;
  },

  /**
   * Autocomplete with Session Tokens (for search)
   */
  async autocomplete(input: string, sessionToken: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { description: 'Tokyo, Japan', placeId: 'ChIJ_Tokyo' },
      { description: 'Tokyo Tower, Tokyo, Japan', placeId: 'ChIJ6' },
      { description: 'Tokyo Disneyland, Chiba, Japan', placeId: 'ChIJ4' },
    ];
  },

  /**
   * Get directions between two points
   */
  async getDirections(origin: PlaceLocation, destination: PlaceLocation): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      distance: '3.5 km',
      duration: '12 mins',
      steps: [
        'Head east on Main St toward 2nd Ave',
        'Turn right onto Highway 1',
        'Arrive at destination',
      ],
    };
  },

  /**
   * Get popular photos for a location
   */
  async getLocationPhotos(location: string): Promise<PlacePhoto[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', attribution: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800', attribution: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', attribution: 'Unsplash' },
      { url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800', attribution: 'Unsplash' },
    ];
  },
};

/**
 * Category Mapper - Maps UI categories to Google Place Types
 */
export const categoryMapper = {
  stays: ['lodging'] as PlaceCategory[],
  fun: ['amusement_park', 'night_club', 'park'] as PlaceCategory[],
  sightseeing: ['tourist_attraction', 'museum', 'park'] as PlaceCategory[],
  shopping: ['shopping_mall'] as PlaceCategory[],
  transport: ['car_rental'] as PlaceCategory[],
  food: ['restaurant', 'cafe'] as PlaceCategory[],
};
