# Travel Planner Backend

> **AI-Powered, Real-Time Collaborative Travel Itinerary Planner with Advanced Scalable Architecture**

A production-grade backend built with Node.js, Express, Google Gemini AI, Redis caching, Kafka message queuing, and Socket.io real-time collaboration.

---

## 🏗️ Architecture Overview

### Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **AI Provider**: Google Gemini API (with Search Grounding)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Caching**: Redis
- **Message Queue**: Kafka (for Price Watchdog)
- **Real-Time**: Socket.io (collaboration & presence)
- **Security**: Helmet, Rate Limiting, CORS

### Key Features

✅ **Intent Parsing**: Natural language → Structured travel data  
✅ **AI Itinerary Generation**: Detailed day-by-day plans with Google Search Grounding  
✅ **Redis Caching**: Smart caching with SHA256 hashing for fast responses  
✅ **Real-Time Collaboration**: Multi-user editing with day-level locking  
✅ **Price Watchdog**: Kafka-based flight price monitoring (worker service)  
✅ **Vibe Search**: Semantic embedding generation (vector DB ready)  
✅ **Presence System**: Track active viewers per itinerary  

---

## 📁 Project Structure

```
server/
├── index.js                    # Main Express server + Socket.io setup
├── package.json
├── .env.example
├── config/
│   ├── firebase.js            # Firebase Admin SDK initialization
│   ├── redis.js               # Redis client configuration
│   └── kafka.js               # Kafka producer/consumer setup
├── services/
│   ├── aiService.js           # Gemini API integration (intent, itinerary, vibe)
│   ├── cacheService.js        # Redis caching service
│   ├── collaborationService.js # Real-time presence & locking
│   └── kafkaProducer.js       # Kafka message producer
├── routes/
│   ├── ai.routes.js           # /api/parse-intent, /api/generate-itinerary
│   ├── itinerary.routes.js    # CRUD operations for itineraries
│   └── priceWatch.routes.js   # Price watch management
├── middleware/
│   ├── auth.js                # Firebase token verification
│   ├── errorHandler.js        # Global error handling
│   └── validation.js          # Request validation
└── workers/
    └── priceWatchWorker.js    # Kafka consumer for flight price monitoring
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (ES Modules support)
- **Redis** 7+ (running locally or cloud)
- **Kafka** 3+ (optional - graceful degradation)
- **Firebase Project** (Firestore + Auth enabled)
- **Google Gemini API Key**

### Installation

1. **Clone & Navigate**
   ```powershell
   cd c:\pc\Travel_Planner\server
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Environment Setup**
   ```powershell
   cp .env.example .env
   ```

4. **Configure `.env`**
   ```env
   PORT=5000
   NODE_ENV=development

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here

   # Firebase
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

   # Redis
   REDIS_URL=redis://localhost:6379
   REDIS_TTL=604800

   # Kafka (optional)
   KAFKA_BROKER=localhost:9092

   # Socket.io
   SOCKET_CORS_ORIGIN=http://localhost:5173
   ```

### Running Services

#### Start Redis (Windows)
```powershell
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# OR using WSL
wsl redis-server
```

#### Start Kafka (Optional)
```powershell
# Using the setup script (EASIEST)
.\setup-kafka.ps1 start

# OR using Docker Compose directly
docker-compose -f docker-compose.kafka.yml up -d

# Check status
.\setup-kafka.ps1 status
```

**📖 Need help with Kafka?** See [KAFKA_QUICKSTART.md](./KAFKA_QUICKSTART.md) for quick setup or [KAFKA_SETUP.md](./KAFKA_SETUP.md) for detailed instructions.

#### Start Main Server
```powershell
npm run dev
# Server: http://localhost:5000
# Socket.io: ws://localhost:5000
```

#### Start Price Watch Worker (Separate Terminal)
```powershell
npm run worker:price-watch
```

---

## 📡 API Endpoints

### AI & Itinerary Generation

#### `POST /api/parse-intent`
Parse natural language into structured travel data.

**Request:**
```json
{
  "text": "Trip to Italy, good wine, 5 days"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "Italy",
    "duration": 5,
    "budget": "moderate",
    "interests": ["wine", "food", "culture"],
    "travelStyle": "moderate",
    "accommodation": "hotel",
    "startDate": null
  },
  "cached": false
}
```

---

#### `POST /api/generate-itinerary`
Generate detailed travel itinerary with Google Search Grounding.

**Request:**
```json
{
  "destination": "Tokyo, Japan",
  "duration": 7,
  "budget": "moderate",
  "interests": ["food", "temples", "technology"],
  "travelStyle": "moderate",
  "accommodation": "hotel",
  "startDate": "2025-06-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Tokyo Tech & Culture Adventure",
    "destination": "Tokyo, Japan",
    "duration": 7,
    "overview": "Experience the perfect blend of ancient tradition...",
    "days": [
      {
        "day": 1,
        "date": "2025-06-15",
        "theme": "Arrival & Shibuya Exploration",
        "activities": [
          {
            "time": "09:00 AM",
            "title": "Arrival at Narita Airport",
            "description": "Take the Narita Express...",
            "location": "Narita International Airport",
            "duration": "2 hours",
            "cost": "$30",
            "category": "transport"
          }
        ],
        "meals": {
          "breakfast": "In-flight meal",
          "lunch": "Ichiran Ramen, Shibuya",
          "dinner": "Sushi Dai, Tsukiji"
        }
      }
    ],
    "estimatedCost": {
      "min": 1500,
      "max": 2500,
      "breakdown": {
        "accommodation": 700,
        "food": 500,
        "activities": 400,
        "transport": 200
      }
    }
  },
  "cached": false,
  "saved": true,
  "itineraryId": "abc123def456"
}
```

---

### Itinerary Management (Auth Required)

#### `GET /api/itineraries`
Get all user itineraries.

**Headers:**
```
Authorization: Bearer <firebase_token>
```

---

#### `GET /api/itineraries/:itineraryId`
Get specific itinerary.

---

#### `PUT /api/itineraries/:itineraryId`
Update itinerary.

---

#### `DELETE /api/itineraries/:itineraryId`
Delete itinerary.

---

### Price Watch

#### `POST /api/price-watch`
Start monitoring flight prices.

**Request:**
```json
{
  "tripId": "abc123",
  "destination": "LAX",
  "origin": "JFK",
  "departureDate": "2025-06-15",
  "returnDate": "2025-06-22",
  "passengers": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price watch activated successfully",
  "watchId": "watch_xyz789"
}
```

---

## 🔌 Socket.io Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-itinerary` | `{ itineraryId, userId, userName }` | Join collaboration room |
| `leave-itinerary` | `{ itineraryId, userId }` | Leave room |
| `lock-day` | `{ itineraryId, dayNumber, userId, userName }` | Lock day for editing |
| `unlock-day` | `{ itineraryId, dayNumber, userId }` | Release lock |
| `cursor-move` | `{ itineraryId, userId, position }` | Broadcast cursor |
| `activity` | `{ itineraryId, userId }` | Heartbeat |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `viewers-updated` | `[{ userId, userName, joinedAt }]` | Active viewers list |
| `locks-updated` | `{ dayNumber: lockData }` | Current locks |
| `day-locked` | `{ dayNumber, lockedBy }` | Day locked |
| `day-unlocked` | `{ dayNumber }` | Day unlocked |
| `lock-acquired` | `{ dayNumber }` | Lock success |
| `lock-failed` | `{ dayNumber, lockedBy }` | Lock conflict |

---

## 🧪 Testing with cURL

### Parse Intent
```powershell
curl -X POST http://localhost:5000/api/parse-intent `
  -H "Content-Type: application/json" `
  -d '{"text":"Weekend trip to Paris, art museums and cafes"}'
```

### Generate Itinerary
```powershell
curl -X POST http://localhost:5000/api/generate-itinerary `
  -H "Content-Type: application/json" `
  -d '{
    "destination":"Paris, France",
    "duration":3,
    "budget":"moderate",
    "interests":["art","food"]
  }'
```

### Price Watch
```powershell
curl -X POST http://localhost:5000/api/price-watch `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" `
  -d '{
    "tripId":"trip123",
    "destination":"CDG",
    "origin":"JFK",
    "departureDate":"2025-07-01"
  }'
```

---

## 🎯 Gemini Prompts

### Intent Parser Prompt
Located in `services/aiService.js` → `PROMPTS.INTENT_PARSER`

**Key Instructions:**
- Extract destination, duration, budget, interests from natural text
- Return **ONLY** valid JSON (no markdown, no code blocks)
- Use intelligent defaults for missing fields
- Handle ambiguous inputs gracefully

### Itinerary Generator Prompt
Located in `services/aiService.js` → `PROMPTS.ITINERARY_GENERATOR`

**Key Instructions:**
- Use Google Search Grounding for real-time data
- Generate realistic daily schedules (8 AM - 10 PM)
- Include specific venue names, addresses, costs
- Return structured JSON with days array
- 4-6 activities per day minimum
- Match budget and interests

### Example Output Enforcement
```javascript
// In aiService.js, we strip markdown:
const cleanedText = text
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .trim();

const itinerary = JSON.parse(cleanedText);
```

---

## 🔐 Security Features

- **Helmet.js**: HTTP header security
- **Rate Limiting**: 100 requests per 15 minutes
- **Firebase Auth**: JWT token verification
- **CORS**: Restricted origins
- **Input Validation**: Sanitized requests
- **Error Handling**: No stack traces in production

---

## 🐛 Troubleshooting

### Redis Connection Failed
```powershell
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Kafka Not Available
The server will start without Kafka (graceful degradation). Price watch will fail silently.

### Firebase Auth Errors
Verify your service account key has correct formatting:
```json
"FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Gemini API Quota Exceeded
Check your API usage at: https://makersuite.google.com/app/apikey

---

## 📊 Performance Optimizations

1. **Caching Strategy**
   - Intent parsing: 24 hours TTL
   - Itinerary generation: 7 days TTL
   - SHA256 hash-based cache keys

2. **Connection Pooling**
   - Redis: Persistent connection with reconnect logic
   - Firestore: Admin SDK handles pooling

3. **Real-Time Efficiency**
   - Lock TTL: 5 minutes (auto-release)
   - Presence TTL: 1 hour
   - Cursor updates: Debounced on client

---

## 🚢 Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use Redis Cloud (e.g., Upstash, Redis Labs)
- [ ] Deploy Kafka to Confluent Cloud or AWS MSK
- [ ] Enable Firebase Firestore security rules
- [ ] Set up monitoring (New Relic, DataDog)
- [ ] Configure CDN for Socket.io
- [ ] Enable SSL/TLS certificates
- [ ] Set up CI/CD pipeline

---

## 📚 Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Kafka.js Documentation](https://kafka.js.org/docs/getting-started)
- [Socket.io Docs](https://socket.io/docs/v4/)

---

## 🤝 Contributing

This is a showcase project. For production use:
1. Add comprehensive test coverage (Jest, Supertest)
2. Implement logging (Winston, Pino)
3. Add monitoring (Prometheus, Grafana)
4. Set up alerting (PagerDuty)
5. Document API with OpenAPI/Swagger

---

## 📄 License

MIT License - Feel free to use for learning or commercial projects.

---

**Built with ❤️ using Node.js, Gemini AI, Redis, Kafka, and Socket.io**
