
//axios instance with interceptors for Firebase auth token handling
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from '../config/firebase';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 120000, // 120 seconds (2 minutes) - AI generation can take time
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * 
 * This runs BEFORE every request is sent to the server.
 * 
 * WHAT IT DOES:
 * - Gets the current user's Firebase ID token
 * - Adds it to the Authorization header
 * - Backend will verify this token to authenticate the user
 * 
 * HOW IT WORKS:
 * 1. Check if user is logged in (auth.currentUser exists)
 * 2. Get fresh ID token from Firebase
 * 3. Add "Bearer <token>" to Authorization header
 * 4. Send request with token included
 * 
 * WHY:
 * - Every protected endpoint needs this token
 * - Automatic - you don't need to manually add token to each request
 * - Always gets fresh token (Firebase auto-refreshes expired tokens)
 */

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
   
      const currentUser = auth.currentUser;
      
      if (currentUser) {

        // Get fresh ID token (Firebase handles expiration automatically)
        // forceRefresh: false = use cached token if still valid
        const token = await currentUser.getIdToken(false);
 
        config.headers.Authorization = `Bearer ${token}`;
        
        console.log(' Added auth token to request:', config.url);
      } else {
        console.log(' No user logged in, sending request without auth');
      }
    } catch (error) {
      console.error(' Error getting auth token:', error);
      // Continue request without token (will fail if endpoint requires auth)
    }
    
    return config;
  },
  (error) => {
    // Handle request setup errors
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * This runs AFTER every response is received from the server.
 * 
 * WHAT IT DOES:
 * - Handles errors consistently
 * - Extracts error messages
 * - Logs responses for debugging
 * 
 * HOW IT WORKS:
 * - Success (2xx): Just return the response
 * - Error (4xx/5xx): Extract error message and reject
 */
api.interceptors.response.use(
  (response) => {
    // Success response (status 200-299)
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error: AxiosError<any>) => {
    // Error response (status 400-599)
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      
      console.error(` API Error [${status}]:`, message);
      
      // Handle specific status codes
      if (status === 401) {
        console.error(' Unauthorized - Token invalid or expired');
        // Could trigger logout here if needed
      } else if (status === 403) {
        console.error(' Forbidden - Access denied');
      } else if (status === 404) {
        console.error(' Not Found');
      } else if (status >= 500) {
        console.error(' Server Error');
      }
      
      // Attach user-friendly message
      error.message = message;
      
    } else if (error.request) {
      // Request sent but no response received (network error)
      console.error(' Network Error - No response from server');
      error.message = 'Network error - please check your connection';
      
    } else {
      // Something wrong with request setup
      console.error(' Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Export the configured axios instance
 * 
 * USAGE:
 * import api from '@/services/api';
 * 
 * const response = await api.get('/itineraries');
 * const data = await api.post('/generate-itinerary', { ... });
 */
export default api;
