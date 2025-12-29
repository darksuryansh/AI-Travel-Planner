/**

 * - Defines the shape/structure of data from backend
 * - Provides autocomplete in VS Code
 * - Catches type errors before runtime
 * 

 * - TypeScript prevents bugs by checking types
 * - Makes code self-documenting
 * - Better developer experience (autocomplete, hints)

/**
 * USER TYPES
 */
export interface User {
  uid: string;           // Firebase user ID
  email: string | null;  // User's email
  displayName?: string;  // Optional display name
  photoURL?: string;     // Optional profile picture
}

export interface Activity {
  time: string;              // "10:00 AM"
  title: string;             // "Visit Eiffel Tower"
  description: string;       // Detailed description
  location: string;          // Address or area
  category: string;          // "food" | "culture" | "sightseeing" | "adventure"
  estimatedCost: number;     // In rupees
  rating?: number;           // 0-5 stars
  image?: string;            // Optional image URL
  duration?: string;         // "2 hours"
  tips?: string[];           // ["Book tickets online", "Go early"]
}


export interface Day {
  day: number;               // Day number (1, 2, 3...)
  theme: string;             // "Cultural Exploration" or "Adventure Day"
  activities: Activity[];    // List of activities for this day
  meals?: {                  // Optional meal suggestions
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}


export interface Itinerary {
  id: string;                // Firestore document ID
  userId?: string;           // Owner's Firebase UID
  title: string;             // "5-Day Paris Adventure"
  description: string;       // Brief overview
  destination: string;       // "Paris, France"
  duration: number;          // Number of days (5)
  estimatedCost: number;     // Total estimated cost in USD
  days: Day[];               // Array of daily plans
  
  // Optional metadata
  budget?: string;           // "budget" | "moderate" | "luxury"
  travelStyle?: string;      // "relaxed" | "moderate" | "packed"
  interests?: string[];      // ["culture", "food", "museums"]
  accommodation?: string;    // "hostel" | "hotel" | "airbnb"
  
  // Firestore timestamps
  createdAt?: any;           // Firebase Timestamp
  updatedAt?: any;           // Firebase Timestamp
  
  // Sharing
  isPublic?: boolean;        // Can others view this?
  sharedWith?: string[];     // Array of user emails
}



// For POST /api/generate-itinerary
export interface GenerateItineraryRequest {
  destination: string;       // "Paris, France"
  duration: number;          // 5
  budget: string;            // "moderate"
  interests: string[];       // ["culture", "food"]
  travelStyle: string;       // "moderate"
  accommodation: string;     // "hotel"
}

// For POST /api/itineraries (manual creation)
export interface CreateItineraryRequest {
  title: string;
  description: string;
  destination: string;
  duration: number;
  estimatedCost: number;
  days: Day[];
  budget?: string;
  travelStyle?: string;
  interests?: string[];
}

// For PUT /api/itineraries/:id
export interface UpdateItineraryRequest extends Partial<CreateItineraryRequest> {
  // All fields optional (partial update)
}

/**
 * API RESPONSE TYPES
 */

// Standard success response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Error response
export interface ApiError {
  success: false;
  error: string;
  details?: any;
}

// For GET /api/itineraries
export interface ItinerariesResponse {
  success: boolean;
  data: Itinerary[];
  count: number;
}

// For POST /api/generate-itinerary
export interface GenerateItineraryResponse {
  success: boolean;
  data: Itinerary;
  saved: boolean;        // Was it saved to DB?
  itineraryId?: string;  // DB ID if saved
}

/**
 * AUTH TYPES
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;  // Firebase ID token
}
