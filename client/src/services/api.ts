/**
 * API Service Layer - Handles all backend communication
 */

// Use Vite proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use Vite proxy
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

export interface ParseIntentRequest {
  text: string;
}

export interface ParseIntentResponse {
  success: boolean;
  data: {
    destination: string;
    duration: number;
    budget: string;
    interests: string[];
    travelStyle: string;
    accommodation: string;
    startDate: string | null;
  };
  cached: boolean;
}

export interface GenerateItineraryRequest {
  destination: string;
  duration: number;
  budget: string;
  interests?: string[];
  travelStyle?: string;
  accommodation?: string;
  startDate?: string | null;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  duration?: string;
  cost?: string;
  tips?: string;
  category: string;
  estimatedCost?: number;
  rating?: number;
  image?: string;
  photoWorthy?: boolean;
}

export interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  startLocation?: { lat: number; lng: number; name: string };
  endLocation?: { lat: number; lng: number; name: string };
  activities: Activity[];
  meals?: {
    breakfast?: any;
    lunch?: any;
    dinner?: any;
  };
  accommodation?: any;
}

export interface Itinerary {
  id?: string;
  title: string;
  destination: string;
  duration: number;
  budget?: string;
  overview?: string;
  description?: string;
  bestTimeToVisit?: string;
  destinationInfo?: any;
  travelInfo?: any;
  faqs?: any[];
  estimatedCost: number | { min: number; max: number; breakdown: any };
  days: DayPlan[];
  packingList?: string[];
  localTips?: string[];
  emergencyInfo?: any;
  generatedAt?: string;
  version?: string;
  userId?: string;
  userEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  parameters?: any;
  isPublic?: boolean;
}

export interface GenerateItineraryResponse {
  success: boolean;
  data: Itinerary;
  cached: boolean;
  saved?: boolean;
  itineraryId?: string;
  message: string;
}

export interface ItineraryListResponse {
  success: boolean;
  data: Itinerary[];
  count: number;
}

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Get headers with optional auth
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || errorData.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Parse natural language travel intent
   */
  async parseIntent(text: string): Promise<ParseIntentResponse> {
    return this.fetchApi<ParseIntentResponse>('/parse-intent', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Generate detailed itinerary
   */
  async generateItinerary(
    params: GenerateItineraryRequest
  ): Promise<GenerateItineraryResponse> {
    return this.fetchApi<GenerateItineraryResponse>('/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get all user itineraries (requires auth)
   */
  async getItineraries(limit = 20, offset = 0): Promise<ItineraryListResponse> {
    return this.fetchApi<ItineraryListResponse>(
      `/itineraries?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get single itinerary by ID (requires auth)
   */
  async getItinerary(itineraryId: string): Promise<{ success: boolean; data: Itinerary }> {
    return this.fetchApi<{ success: boolean; data: Itinerary }>(
      `/itineraries/${itineraryId}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update itinerary (requires auth)
   */
  async updateItinerary(
    itineraryId: string,
    updates: Partial<Itinerary>
  ): Promise<{ success: boolean; message: string; itineraryId: string }> {
    return this.fetchApi<{ success: boolean; message: string; itineraryId: string }>(
      `/itineraries/${itineraryId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  }

  /**
   * Delete itinerary (requires auth)
   */
  async deleteItinerary(
    itineraryId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.fetchApi<{ success: boolean; message: string }>(
      `/itineraries/${itineraryId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Share/unshare itinerary (requires auth)
   */
  async shareItinerary(
    itineraryId: string,
    isPublic: boolean
  ): Promise<{ success: boolean; message: string; isPublic: boolean }> {
    return this.fetchApi<{ success: boolean; message: string; isPublic: boolean }>(
      `/itineraries/${itineraryId}/share`,
      {
        method: 'POST',
        body: JSON.stringify({ isPublic }),
      }
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.fetchApi<any>('/health', {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);

export default apiService;
