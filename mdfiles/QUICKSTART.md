# QUICK START GUIDE

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies (Already Done ✅)
```powershell
npm install
```

### Step 2: Setup Redis on Windows

**Option A: Using Memurai (Native Windows Redis)**
```powershell
# Download and install Memurai (free Redis for Windows)
# https://www.memurai.com/get-memurai

# After installation, Redis will run automatically on port 6379
```

**Option B: Using WSL (Windows Subsystem for Linux)**
```powershell
# Install WSL if not already installed
wsl --install

# In WSL terminal
sudo apt update
sudo apt install redis-server
redis-server --daemonize yes

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

**Option C: Use Redis Cloud (No Local Install)**
```powershell
# Sign up for free at: https://redis.com/try-free/
# Get your connection URL (e.g., redis://default:password@redis-12345.cloud.redislabs.com:12345)
# Update .env file with your Redis Cloud URL
```

### Step 3: Configure Firebase (Optional for Basic Testing)

**Option A: Without Firebase (Quick Test)**
The server will run without Firebase, but data won't persist. You can still:
- ✅ Parse intents
- ✅ Generate itineraries (without saving)
- ✅ Use caching
- ❌ Cannot save to database
- ❌ Cannot use authentication

**Option B: With Firebase (Full Features)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `serviceAccountKey.json` in `server/` folder
6. That's it! The `.env` file is already configured to use it.

### Step 4: Start the Server
```powershell
npm run dev
```

You should see:
```
✅ Redis client ready
⚠️  Firebase not configured - running in NO PERSISTENCE mode
⚠️  Kafka initialization failed (continuing without Kafka)
✅ SERVER READY
📍 Server: http://localhost:5000
```

### Step 5: Test the API

**Test 1: Health Check**
```powershell
curl http://localhost:5000/api/health
```

**Test 2: Parse Intent (No Auth Required)**
```powershell
curl -X POST http://localhost:5000/api/parse-intent `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"5 days in Paris, love art and food\"}'
```

**Test 3: Generate Itinerary (No Auth Required)**
```powershell
curl -X POST http://localhost:5000/api/generate-itinerary `
  -H "Content-Type: application/json" `
  -d '{\"destination\":\"Paris\",\"duration\":3,\"budget\":\"moderate\",\"interests\":[\"art\",\"food\"]}'
```

---

## 🐛 Troubleshooting

### Issue: "Redis connection refused"
**Solution:**
```powershell
# Check if Redis is running
redis-cli ping

# If not, start Redis (WSL)
wsl redis-server --daemonize yes

# Or restart Memurai service (Windows)
Restart-Service Memurai
```

### Issue: "Firebase error"
**Solution:** The server will run without Firebase. For full features:
1. Download `serviceAccountKey.json` from Firebase Console
2. Place in `server/` directory
3. Restart server

### Issue: "Kafka connection failed"
**Solution:** Kafka is optional. The server will work without it. Price watch feature won't work but everything else will.

### Issue: Docker Redis failed
**Solution:** Docker Desktop needs to be running. Alternative:
```powershell
# Check if Docker is running
docker ps

# If not, start Docker Desktop from Start Menu

# If you don't have Docker, use Memurai or WSL Redis instead
```

---

## 📝 Configuration Files

### .env File
Located at `c:\pc\Travel_Planner\server\.env`

**Current Configuration:**
- ✅ Gemini API Key: Configured
- ⚠️  Firebase: Not configured (optional)
- ⚠️  Redis: Localhost (needs to be running)
- ⚠️  Kafka: Optional (will gracefully degrade)

### Minimal Working Configuration
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=AIzaSyBa3-QfbJ2K-dEVTiQG3pQgZKtBrQCFEIo
REDIS_URL=redis://localhost:6379
SOCKET_CORS_ORIGIN=http://localhost:5173
```

---

## 🎯 What Works Without Firebase?

✅ **Working Features:**
- AI Intent Parsing
- AI Itinerary Generation
- Redis Caching
- Health Check API
- Real-time Socket.io (in-memory only)

❌ **Disabled Features:**
- User Authentication
- Saving itineraries to database
- Retrieving saved itineraries
- Price watch persistence

---

## 🔥 Firebase Setup (Detailed)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "travel-planner" (or any name)

2. **Enable Firestore**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Start in test mode (for development)

3. **Get Service Account Key**
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json`
   - Move to `C:\pc\Travel_Planner\server\`

4. **Verify Configuration**
   The `.env` file already has:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```

5. **Restart Server**
   ```powershell
   npm run dev
   ```

---

## 📊 Server Startup Checklist

When you run `npm run dev`, you should see:

✅ **Required (Server Won't Start)**
- Node.js running

✅ **Recommended (Core Features)**
- Redis connected
- Gemini API key valid

⚠️ **Optional (Enhanced Features)**
- Firebase configured (for persistence)
- Kafka connected (for price watch)

---

## 🚦 Next Steps

1. **Install Redis** (Memurai or WSL)
2. **Restart Server** (`npm run dev`)
3. **Test API** (use curl commands above)
4. **Optional:** Setup Firebase for full features
5. **Build Frontend** (when you're ready)

---

## 💡 Quick Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Start price watch worker (optional)
npm run worker:price-watch

# Check Redis
redis-cli ping

# Test API
curl http://localhost:5000/api/health
```

---

## 📞 Need Help?

Common issues:
1. **Redis not running** → Install Memurai or use WSL
2. **Firebase error** → Server works without it (limited features)
3. **Port 5000 in use** → Change PORT in `.env`
4. **Gemini API error** → Check API key at https://makersuite.google.com/

---

**You're almost there! Just install Redis and restart the server.** 🚀
