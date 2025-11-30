# API DOCUMENTATION

## Overview
Complete REST API documentation for Travel Planner Backend.

**Base URL**: `http://localhost:5000/api`

---

## Authentication

Most endpoints require Firebase Authentication token.

**Header Format:**
```
Authorization: Bearer <firebase_id_token>
```

**Obtaining Token:**
```javascript
// Frontend (Firebase Client SDK)
const token = await firebase.auth().currentUser.getIdToken();
```

---

## Endpoints

### 🤖 AI Services

#### Parse Intent
```
POST /api/parse-intent
```

**Purpose**: Convert natural language to structured travel data

**Auth**: Optional

**Request Body:**
```json
{
  "text": "string (required, max 1000 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "string",
    "duration": "number",
    "budget": "economy|moderate|luxury",
    "interests": ["array"],
    "travelStyle": "relaxed|moderate|packed",
    "accommodation": "hostel|hotel|resort|airbnb",
    "startDate": "YYYY-MM-DD or null"
  },
  "cached": "boolean"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/parse-intent \
  -H "Content-Type: application/json" \
  -d '{"text":"Weekend getaway to Kyoto, temples and food"}'
```

---

#### Generate Itinerary
```
POST /api/generate-itinerary
```

**Purpose**: Generate detailed AI-powered travel itinerary

**Auth**: Optional (saved to Firestore if authenticated)

**Request Body:**
```json
{
  "destination": "string (required)",
  "duration": "number (1-30, required)",
  "budget": "economy|moderate|luxury",
  "interests": ["array"],
  "travelStyle": "relaxed|moderate|packed",
  "accommodation": "hostel|hotel|resort|airbnb",
  "startDate": "YYYY-MM-DD (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "destination": "string",
    "duration": "number",
    "overview": "string",
    "bestTimeToVisit": "string",
    "estimatedCost": {
      "min": "number",
      "max": "number",
      "breakdown": {
        "accommodation": "number",
        "food": "number",
        "activities": "number",
        "transport": "number"
      }
    },
    "days": [
      {
        "day": "number",
        "date": "string",
        "theme": "string",
        "activities": [
          {
            "time": "string",
            "title": "string",
            "description": "string",
            "location": "string",
            "duration": "string",
            "cost": "string",
            "tips": "string",
            "category": "food|culture|adventure|relaxation|transport"
          }
        ],
        "meals": {
          "breakfast": "string",
          "lunch": "string",
          "dinner": "string"
        }
      }
    ],
    "packingList": ["array"],
    "localTips": ["array"],
    "emergencyInfo": {
      "embassy": "string",
      "emergencyNumber": "string",
      "hospitals": ["array"]
    },
    "generatedAt": "ISO timestamp",
    "version": "string"
  },
  "cached": "boolean",
  "saved": "boolean",
  "itineraryId": "string or null"
}
```

---

#### Generate Vibe Embedding
```
POST /api/itinerary/:itineraryId/vibe-embedding
```

**Purpose**: Generate semantic description for vector search

**Auth**: Optional

**Response:**
```json
{
  "success": true,
  "data": {
    "description": "string (evocative paragraph)",
    "embeddings": null,
    "note": "Vector embeddings would be generated here"
  }
}
```

---

### 📝 Itinerary Management

#### List User Itineraries
```
GET /api/itineraries?limit=20&offset=0
```

**Auth**: Required

**Query Params:**
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "destination": "string",
      "duration": "number",
      "createdAt": "ISO timestamp",
      "userId": "string",
      ...
    }
  ],
  "count": "number"
}
```

---

#### Get Single Itinerary
```
GET /api/itineraries/:itineraryId
```

**Auth**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    // Full itinerary object
  }
}
```

**Errors:**
- `404`: Itinerary not found
- `403`: Access denied (not owner or not public)

---

#### Update Itinerary
```
PUT /api/itineraries/:itineraryId
```

**Auth**: Required (must be owner)

**Request Body:** (Partial update allowed)
```json
{
  "title": "string",
  "days": [...],
  "isPublic": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Itinerary updated successfully",
  "itineraryId": "string"
}
```

---

#### Delete Itinerary
```
DELETE /api/itineraries/:itineraryId
```

**Auth**: Required (must be owner)

**Response:**
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

---

#### Share Itinerary
```
POST /api/itineraries/:itineraryId/share
```

**Auth**: Required (must be owner)

**Request Body:**
```json
{
  "isPublic": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Itinerary is now public/private",
  "isPublic": "boolean"
}
```

---

### 💰 Price Watch

#### Create Price Watch
```
POST /api/price-watch
```

**Auth**: Required

**Request Body:**
```json
{
  "tripId": "string (required)",
  "destination": "string (airport code, required)",
  "origin": "string (airport code, required)",
  "departureDate": "YYYY-MM-DD (required)",
  "returnDate": "YYYY-MM-DD (optional)",
  "passengers": "number (default: 1)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price watch activated successfully",
  "watchId": "string",
  "data": {
    "watchId": "string",
    "tripId": "string",
    "status": "active"
  }
}
```

---

#### List Price Watches
```
GET /api/price-watch
```

**Auth**: Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "tripId": "string",
      "destination": "string",
      "origin": "string",
      "status": "active|cancelled",
      "currentPrice": "number or null",
      "priceHistory": [
        {
          "price": "number",
          "currency": "string",
          "checkedAt": "ISO timestamp",
          "airline": "string"
        }
      ],
      "createdAt": "ISO timestamp",
      "lastChecked": "ISO timestamp or null"
    }
  ],
  "count": "number"
}
```

---

#### Get Price Watch Details
```
GET /api/price-watch/:watchId
```

**Auth**: Required (must be owner)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    // Full price watch object with history
  }
}
```

---

#### Cancel Price Watch
```
DELETE /api/price-watch/:watchId
```

**Auth**: Required (must be owner)

**Response:**
```json
{
  "success": true,
  "message": "Price watch cancelled successfully"
}
```

---

### 🏥 Health & Monitoring

#### Health Check
```
GET /api/health
```

**Auth**: None

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "ISO timestamp",
  "services": {
    "redis": "connected",
    "firebase": "connected",
    "gemini": "configured"
  }
}
```

---

## Socket.io Events

**Connection URL**: `ws://localhost:5000`

### Client Emits

#### Join Itinerary
```javascript
socket.emit('join-itinerary', {
  itineraryId: 'string',
  userId: 'string',
  userName: 'string'
});
```

#### Leave Itinerary
```javascript
socket.emit('leave-itinerary', {
  itineraryId: 'string',
  userId: 'string'
});
```

#### Lock Day
```javascript
socket.emit('lock-day', {
  itineraryId: 'string',
  dayNumber: 1,
  userId: 'string',
  userName: 'string'
});
```

#### Unlock Day
```javascript
socket.emit('unlock-day', {
  itineraryId: 'string',
  dayNumber: 1,
  userId: 'string'
});
```

#### Cursor Move
```javascript
socket.emit('cursor-move', {
  itineraryId: 'string',
  userId: 'string',
  position: { x: 100, y: 200 }
});
```

#### Activity Heartbeat
```javascript
socket.emit('activity', {
  itineraryId: 'string',
  userId: 'string'
});
```

---

### Server Emits

#### Viewers Updated
```javascript
socket.on('viewers-updated', (viewers) => {
  // viewers: [{ userId, userName, joinedAt, lastActive }]
});
```

#### Locks Updated
```javascript
socket.on('locks-updated', (locks) => {
  // locks: { dayNumber: { userId, userName, lockedAt, lockId } }
});
```

#### Day Locked
```javascript
socket.on('day-locked', (data) => {
  // data: { dayNumber, lockedBy: { userId, userName, lockedAt } }
});
```

#### Day Unlocked
```javascript
socket.on('day-unlocked', (data) => {
  // data: { dayNumber }
});
```

#### Lock Acquired
```javascript
socket.on('lock-acquired', (data) => {
  // data: { dayNumber }
});
```

#### Lock Failed
```javascript
socket.on('lock-failed', (data) => {
  // data: { dayNumber, lockedBy: { userId, userName } }
});
```

#### Cursor Update
```javascript
socket.on('cursor-update', (data) => {
  // data: { userId, position: { x, y } }
});
```

#### Error
```javascript
socket.on('error', (error) => {
  // error: { message: 'string' }
});
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["array of validation errors (if applicable)"]
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (access denied)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: varies
  - `X-RateLimit-Reset`: timestamp

---

## Caching

### Cache Headers
Cache-enabled endpoints return:
```json
{
  "cached": true  // Data from Redis cache
}
```

### Cache Invalidation
- Manual: `DELETE /api/cache/:cacheKey` (admin only)
- Automatic: 7 days TTL for itineraries, 24 hours for intents

---

## WebSocket Best Practices

1. **Reconnection**: Implement exponential backoff
2. **Heartbeat**: Send `activity` event every 30 seconds
3. **Lock Release**: Always unlock when leaving edit mode
4. **Error Handling**: Listen for `error` events

---

## Example Frontend Integration

### React Hook for Itinerary Generation

```javascript
import { useState } from 'react';
import axios from 'axios';

export const useItinerary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-itinerary',
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getFirebaseToken()}`
          }
        }
      );
      
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
};
```

### Socket.io Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to server');
  
  socket.emit('join-itinerary', {
    itineraryId: 'abc123',
    userId: 'user456',
    userName: 'John Doe'
  });
});

socket.on('viewers-updated', (viewers) => {
  console.log('Active viewers:', viewers);
});
```

---

## 🗺️ Places API (Google Maps Integration)

### Search Nearby Places
```
GET /api/places/nearby
```

**Purpose**: Find nearby places by category (stays, fun, sightseeing, shopping, transport, food)

**Auth**: Required

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `category` (required): One of: stays, fun, sightseeing, shopping, transport, food
- `radius` (optional): Search radius in meters (default: 2000)

**Response:**
```json
{
  "success": true,
  "category": "fun",
  "location": { "lat": 40.7128, "lng": -74.0060 },
  "radius": 2000,
  "count": 15,
  "places": [
    {
      "id": "ChIJ...",
      "name": "Central Park",
      "address": "New York, NY 10024",
      "location": { "lat": 40.7829, "lng": -73.9654 },
      "rating": 4.8,
      "userRatings": 125000,
      "photos": ["photo_reference_1", "photo_reference_2"],
      "isOpen": true,
      "priceLevel": "$",
      "types": ["park", "tourist_attraction"]
    }
  ]
}
```

### Get Place Details
```
GET /api/places/:placeId
```

**Purpose**: Get comprehensive details about a specific place

**Auth**: Required

**Response:**
```json
{
  "success": true,
  "place": {
    "id": "ChIJ...",
    "name": "Central Park",
    "address": "New York, NY 10024",
    "location": { "lat": 40.7829, "lng": -73.9654 },
    "rating": 4.8,
    "userRatings": 125000,
    "photos": ["photo_reference_1"],
    "isOpen": true,
    "priceLevel": "$",
    "types": ["park"],
    "website": "https://centralparknyc.org",
    "phoneNumber": "+1-212-310-6600",
    "openingHours": {
      "monday": "6:00 AM - 1:00 AM",
      "tuesday": "6:00 AM - 1:00 AM"
    },
    "reviews": [
      {
        "author": "John D.",
        "rating": 5,
        "text": "Amazing park!",
        "time": 1699999999
      }
    ]
  }
}
```

### Get Photo URL
```
GET /api/places/photo/:photoReference
```

**Purpose**: Convert Google Places photo reference to accessible URL

**Auth**: Required

**Query Parameters:**
- `maxWidth` (optional): Maximum photo width (default: 800)

**Response:**
```json
{
  "success": true,
  "photoUrl": "https://maps.googleapis.com/maps/api/place/photo?..."
}
```

### Find Accommodations
```
GET /api/places/accommodations/search
```

**Purpose**: Search for hotels, hostels, and Airbnb options

**Auth**: Required

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `budget` (optional): economy, moderate, luxury (default: moderate)
- `radius` (optional): Search radius in meters (default: 5000)

**Response:**
```json
{
  "success": true,
  "budget": "moderate",
  "location": { "lat": 40.7128, "lng": -74.0060 },
  "radius": 5000,
  "count": 25,
  "accommodations": [
    {
      "id": "ChIJ...",
      "name": "Hotel Example",
      "address": "123 Main St",
      "location": { "lat": 40.7128, "lng": -74.0060 },
      "rating": 4.5,
      "userRatings": 890,
      "photos": ["photo_ref"],
      "priceLevel": "$$",
      "types": ["hotel", "lodging"]
    }
  ]
}
```

### Autocomplete Suggestions
```
GET /api/places/autocomplete
```

**Purpose**: Get place autocomplete suggestions (billing optimized with session tokens)

**Auth**: Required

**Query Parameters:**
- `input` (required): Search query
- `sessionToken` (optional): Session token for billing optimization

**Response:**
```json
{
  "success": true,
  "input": "new york",
  "count": 5,
  "suggestions": [
    {
      "description": "New York, NY, USA",
      "placeId": "ChIJ...",
      "mainText": "New York",
      "secondaryText": "NY, USA"
    }
  ]
}
```

---

## 🌤️ Weather API

### Get Weather Forecast
```
GET /api/weather/forecast
```

**Purpose**: Get 7-day weather forecast with optimal day recommendation

**Auth**: Required

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `location` (optional): Location name for display

**Response:**
```json
{
  "success": true,
  "location": "Paris, France",
  "forecast": [
    {
      "date": "2024-01-15",
      "dayOfWeek": "Monday",
      "temperature": {
        "min": 8,
        "max": 15,
        "feels_like": 12
      },
      "weather": {
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      },
      "precipitation": {
        "probability": 10,
        "rain": 0
      },
      "wind": {
        "speed": 3.5,
        "direction": 180
      },
      "humidity": 65,
      "uvIndex": 2,
      "visibility": 10000
    }
  ],
  "optimalDay": {
    "date": "2024-01-15",
    "dayOfWeek": "Monday",
    "score": 95,
    "reason": "Perfect conditions with clear skies and comfortable temperatures (15°C). Low wind speeds and minimal UV exposure make it ideal for outdoor activities."
  }
}
```

### Get Air Quality Index
```
GET /api/weather/aqi
```

**Purpose**: Get current Air Quality Index and pollutant levels

**Auth**: Required

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `location` (optional): Location name

**Response:**
```json
{
  "success": true,
  "location": "Paris, France",
  "aqi": 45,
  "level": {
    "value": 2,
    "label": "Fair",
    "color": "#80C342",
    "description": "Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor activities."
  },
  "healthAdvice": "Generally acceptable air quality. Unusually sensitive people should consider limiting prolonged outdoor exertion.",
  "components": {
    "pm2_5": 12.5,
    "pm10": 20.3,
    "o3": 35.2,
    "no2": 18.7,
    "co": 0.3,
    "so2": 5.1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Optimal Day
```
GET /api/weather/optimal-day
```

**Purpose**: Calculate the best day to visit based on weather conditions

**Auth**: Required

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `location` (optional): Location name

**Response:**
```json
{
  "success": true,
  "location": "Paris, France",
  "optimalDay": {
    "date": "2024-01-17",
    "dayOfWeek": "Wednesday",
    "score": 98,
    "reason": "Exceptional conditions with clear skies and ideal temperatures (18°C). Calm winds and excellent visibility make it perfect for sightseeing and outdoor activities."
  },
  "forecast": [
    // Next 3 days for comparison
  ]
}
```

---

**Last Updated**: November 20, 2025  
**API Version**: 2.0.0
