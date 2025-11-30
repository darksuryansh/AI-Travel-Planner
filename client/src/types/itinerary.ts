// Standardized Data Schema for IntelliTrek

export interface ItineraryItem {
  id?: string;
  source: 'AI' | 'GOOGLE_SEARCH';
  time?: string;
  title: string;
  name: string;
  description: string;
  location: string | { lat: number; lng: number };
  category: 'Activity' | 'Stay' | 'Food' | 'Transport' | 'culture' | 'sightseeing' | 'shopping' | 'adventure' | 'relaxation';
  estimatedCost?: number;
  rating?: number;
  photoUrl?: string;
  image?: string;
  placeId?: string; // Google Place ID for linking back to Maps
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: ItineraryItem[];
  accommodation?: ItineraryItem; // Best hotel/hostel recommendation for end of day
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  estimatedCost: number;
  days: DayPlan[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  type: 'itinerary' | 'suggestion';
  category?: string;
  day?: number;
}
