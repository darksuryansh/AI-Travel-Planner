# 🌍 AI Travel Itinerary Planner

An intelligent travel planning application that leverages Google's Gemini AI to create personalized, detailed travel itineraries. Users can generate custom trip plans based on their preferences, budget, and interests, complete with day-by-day activities, cultural insights, and weather forecasts.

## ✨ Features

### 🤖 AI-Powered Itinerary Generation
- **Natural Language Processing**: Describe your trip in plain English and let AI understand your intent
- **Personalized Recommendations**: Get tailored suggestions based on your interests, budget, and travel style
- **Comprehensive Details**: Each itinerary includes:
  - Day-by-day activity schedules with specific times and locations
  - Cultural tips and local phrases
  - Photo-worthy spots with best timing recommendations
  - Estimated costs breakdown (accommodation, food, activities, transport)
  - Travel information (how to reach, local transport, visa requirements)
  - Packing list suggestions
  - FAQs about the destination

### 🔐 User Authentication
- Firebase Authentication integration
- User dashboard to manage saved itineraries
- Optional login (works for guest users too)
- Secure session management

### 🌤️ Weather Integration
- Real-time weather forecasts using OpenWeather API
- 5-day weather predictions for destinations
- Current conditions with temperature, humidity, and wind speed
- Weather-based travel recommendations

### 🎨 Modern UI/UX
- Dark/Light theme support with system preference detection
- Responsive design for all devices
- Beautiful gradient backgrounds and smooth animations
- Component library powered by Radix UI
- Interactive itinerary boards
- PDF export capability for itineraries

### 💾 Data Persistence
- Firebase Firestore for storing user itineraries
- Automatic save for logged-in users
- Retrieve and manage past itineraries
- Update and delete functionality

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Firebase SDK** - Authentication and Firestore
- **html2canvas & jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Generative AI (Gemini)** - AI itinerary generation
- **Firebase Admin SDK** - Authentication verification and Firestore
- **OpenWeather API** - Weather data
- **Axios** - HTTP client for external APIs
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Compression** - Response compression

## 📁 Project Structure

```
Travel_Planner/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── HomePage.tsx         # Landing page with itinerary form
│   │   │   ├── TripDashboard.tsx    # User's saved itineraries
│   │   │   ├── ItineraryView.tsx    # Detailed itinerary display
│   │   │   ├── ItineraryBoard.tsx   # Main itinerary board
│   │   │   ├── ActivityCard.tsx     # Individual activity cards
│   │   │   ├── WeatherForecast.tsx  # Weather display component
│   │   │   ├── Navigation.tsx       # Navigation bar
│   │   │   ├── LoginPage.tsx        # User login
│   │   │   ├── SignupPage.tsx       # User registration
│   │   │   └── ui/                  # Reusable UI components (Radix)
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx      # Authentication state management
│   │   │   └── ThemeContext.tsx     # Theme (dark/light) management
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance and interceptors
│   │   │   ├── authService.ts       # Authentication logic
│   │   │   ├── itineraryService.ts  # Itinerary CRUD operations
│   │   │   └── weatherService.ts    # Weather API calls
│   │   ├── config/
│   │   │   └── firebase.ts          # Firebase configuration
│   │   ├── types/
│   │   │   └── api.ts               # TypeScript type definitions
│   │   ├── styles/
│   │   │   └── globals.css          # Global styles and Tailwind
│   │   ├── App.tsx                  # Main app component with routing
│   │   └── main.tsx                 # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts               # Vite configuration
│   └── vercel.json                  # Vercel deployment config
│
└── server/                          # Backend Express application
    ├── config/
    │   └── firebase.js              # Firebase Admin SDK setup
    ├── middleware/
    │   ├── auth.js                  # JWT verification middleware
    │   ├── errorHandler.js          # Error handling middleware
    │   └── validation.js            # Request validation
    ├── routes/
    │   ├── aiIntegration.js         # AI itinerary generation endpoint
    │   ├── itinerary.js             # CRUD operations for itineraries
    │   └── weather.js               # Weather forecast endpoints
    ├── services/
    │   ├── aiService.js             # Gemini AI integration
    │   └── weatherService.js        # OpenWeather API integration
    ├── app.js                       # Express app setup and configuration
    ├── package.json
    ├── Dockerfile                   # Docker containerization
    └── serviceAccountKey.json       # Firebase service account (gitignored)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** (for authentication and database)
- **Google AI Studio account** (for Gemini API key)
- **OpenWeather account** (for weather API key)

### Environment Variables

#### Client (`.env` in `/client`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Server (`.env` in `/server`)
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
NODE_ENV=development
```

### Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password provider)
   - Create a Firestore Database

2. **Get Client Configuration**:
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a web app
   - Copy the config values to client `.env`

3. **Generate Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `server/serviceAccountKey.json`
   - **Important**: Add this file to `.gitignore`

### API Keys

1. **Google Gemini API**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add to server `.env` as `GEMINI_API_KEY`

2. **OpenWeather API**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Generate an API key (free tier is sufficient)
   - Add to server `.env` as `OPENWEATHER_API_KEY`

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Travel_Planner
```

2. **Install client dependencies**:
```bash
cd client
npm install
```

3. **Install server dependencies**:
```bash
cd ../server
npm install
```

### Running the Application

#### Development Mode

1. **Start the backend server**:
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**:
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

3. **Access the application**:
Open your browser and navigate to `http://localhost:5173`

#### Production Mode

1. **Build the client**:
```bash
cd client
npm run build
```

2. **Start the server**:
```bash
cd server
npm start
```

## 🐳 Docker Deployment

Build and run using Docker:

```bash
cd server
docker build -t travel-planner-backend .
docker run -p 5000:5000 --env-file .env travel-planner-backend
```

## 🌐 Deployment

### Frontend (Vercel)
The client is configured for Vercel deployment with `vercel.json`:
```bash
cd client
vercel --prod
```

### Backend Options
- **Render**: Deploy the Express server
- **Railway**: Easy Node.js deployment
- **Heroku**: Traditional PaaS option
- **Google Cloud Run**: Containerized deployment

## 📖 API Documentation

### Endpoints

#### Generate Itinerary
```
POST /api/generate-itinerary
```
**Request Body**:
```json
{
  "destination": "Paris, France",
  "duration": 5,
  "budget": "moderate",
  "interests": ["culture", "food", "museums"],
  "travelStyle": "moderate",
  "accommodation": "hotel",
  "startDate": "2025-06-01"
}
```

#### Get All Itineraries
```
GET /api/itineraries?limit=20&offset=0
```
**Headers**: `Authorization: Bearer <firebase-token>`

#### Get Single Itinerary
```
GET /api/itineraries/:id
```
**Headers**: `Authorization: Bearer <firebase-token>`

#### Update Itinerary
```
PUT /api/itineraries/:id
```
**Headers**: `Authorization: Bearer <firebase-token>`

#### Delete Itinerary
```
DELETE /api/itineraries/:id
```
**Headers**: `Authorization: Bearer <firebase-token>`

#### Get Weather Forecast
```
POST /api/weather/forecast
```
**Request Body**:
```json
{
  "location": {
    "lat": 48.8566,
    "lng": 2.3522
  }
}
```

## 🎯 Usage Flow

1. **Visit Homepage**: User lands on the hero section
2. **Enter Trip Details**: Fill out destination, duration, budget, interests
3. **AI Generation**: Click "Generate" - AI creates personalized itinerary (takes 30-90 seconds)
4. **View Itinerary**: Explore day-by-day plans, activities, costs, and tips
5. **Optional Login**: Sign up/login to save itinerary
6. **Dashboard**: Access saved trips, edit, or delete
7. **Export**: Download itinerary as PDF

## 🛠️ Key Features in Detail

### AI Intent Parsing
The system uses a two-step AI process:
1. **Intent Parser**: Extracts structured data from natural language
2. **Itinerary Generator**: Creates detailed day-by-day plans

### Smart Budget Handling
- **Economy**: Budget accommodations, street food, free activities
- **Moderate**: Mid-range hotels, local restaurants, mix of paid/free activities
- **Luxury**: Premium hotels, fine dining, exclusive experiences

### Travel Style Options
- **Relaxed**: 3-4 activities per day, lots of downtime
- **Moderate**: 5-6 activities, balanced pace
- **Packed**: 7+ activities, maximize every moment

### Weather Integration
- Fetches real-time weather for destination
- Displays 5-day forecast
- Includes packing recommendations based on weather

## 🔒 Security Features

- Firebase Authentication with secure token verification
- CORS protection
- Helmet.js security headers
- Rate limiting on API endpoints
- Input validation middleware
- Environment variable protection
- Firestore security rules (should be configured in Firebase Console)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [ISC License](LICENSE).

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent itinerary generation
- **OpenWeather** for weather data
- **Firebase** for authentication and database
- **Radix UI** for accessible component primitives
- **Vercel** for frontend hosting capabilities

## 📧 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built by using React, TypeScript, Node.js, and AI**
