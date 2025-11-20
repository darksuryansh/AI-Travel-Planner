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

**Last Updated**: November 20, 2025  
**API Version**: 1.0.0
