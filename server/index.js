import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Config imports
import { initializeRedis } from './config/redis.js';
import { firebaseAdmin } from './config/firebase.js';
import { initializeProducer } from './services/kafkaProducer.js';

// Route imports
import aiRoutes from './routes/ai.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import priceWatchRoutes from './routes/priceWatch.routes.js';
import placesRoutes from './routes/places.routes.js';
import weatherRoutes from './routes/weather.routes.js';

// Middleware imports
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Service imports
import collaborationService from './services/collaborationService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ==================== MIDDLEWARE ====================

// Security
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging (dev)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

app.get('/', (req, res) => {
  res.json({
    message: 'Travel Planner API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      ai: '/api/*',
      itineraries: '/api/itineraries',
      places: '/api/places',
      weather: '/api/weather',
      priceWatch: '/api/price-watch'
    }
  });
});

app.use('/api', aiRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/price-watch', priceWatchRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/weather', weatherRoutes);

// ==================== SOCKET.IO REAL-TIME COLLABORATION ====================

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  
  // Join itinerary room
  socket.on('join-itinerary', async (data) => {
    try {
      const { itineraryId, userId, userName } = data;
      
      socket.join(itineraryId);
      
      // Add to presence
      const viewers = await collaborationService.addViewer(itineraryId, userId, userName);
      
      // Notify all users in room
      io.to(itineraryId).emit('viewers-updated', viewers);
      
      // Send current locks
      const locks = await collaborationService.getAllLocks(itineraryId);
      socket.emit('locks-updated', locks);
      
      console.log(`👥 ${userName} joined itinerary: ${itineraryId}`);
    } catch (error) {
      console.error('Join itinerary error:', error);
      socket.emit('error', { message: 'Failed to join itinerary' });
    }
  });
  
  // Leave itinerary room
  socket.on('leave-itinerary', async (data) => {
    try {
      const { itineraryId, userId } = data;
      
      socket.leave(itineraryId);
      
      // Remove from presence
      const viewers = await collaborationService.removeViewer(itineraryId, userId);
      
      // Notify all users in room
      io.to(itineraryId).emit('viewers-updated', viewers);
      
      console.log(`👥 User ${userId} left itinerary: ${itineraryId}`);
    } catch (error) {
      console.error('Leave itinerary error:', error);
    }
  });
  
  // Lock day for editing
  socket.on('lock-day', async (data) => {
    try {
      const { itineraryId, dayNumber, userId, userName } = data;
      
      const result = await collaborationService.lockDay(itineraryId, dayNumber, userId, userName);
      
      if (result.success) {
        // Notify all users in room
        io.to(itineraryId).emit('day-locked', {
          dayNumber,
          lockedBy: result.lockedBy
        });
        
        socket.emit('lock-acquired', { dayNumber });
      } else {
        socket.emit('lock-failed', {
          dayNumber,
          lockedBy: result.lockedBy
        });
      }
    } catch (error) {
      console.error('Lock day error:', error);
      socket.emit('error', { message: 'Failed to lock day' });
    }
  });
  
  // Unlock day
  socket.on('unlock-day', async (data) => {
    try {
      const { itineraryId, dayNumber, userId } = data;
      
      const result = await collaborationService.unlockDay(itineraryId, dayNumber, userId);
      
      if (result.success) {
        // Notify all users in room
        io.to(itineraryId).emit('day-unlocked', { dayNumber });
      }
    } catch (error) {
      console.error('Unlock day error:', error);
    }
  });
  
  // Broadcast cursor position
  socket.on('cursor-move', async (data) => {
    try {
      const { itineraryId, userId, position } = data;
      
      await collaborationService.updateCursor(itineraryId, userId, position);
      
      // Broadcast to others in room
      socket.to(itineraryId).emit('cursor-update', {
        userId,
        position
      });
    } catch (error) {
      console.error('Cursor move error:', error);
    }
  });
  
  // Activity heartbeat
  socket.on('activity', async (data) => {
    try {
      const { itineraryId, userId } = data;
      await collaborationService.updateActivity(itineraryId, userId);
    } catch (error) {
      console.error('Activity update error:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ==================== ERROR HANDLING ====================

app.use(notFound);
app.use(errorHandler);

// ==================== SERVER INITIALIZATION ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Starting Travel Planner Backend...\n');
    
    // Initialize Redis
    console.log('📦 Initializing Redis...');
    await initializeRedis();
    
    // Initialize Firebase (already initialized in config)
    console.log('📦 Firebase Admin initialized');
    
    // Initialize Kafka Producer
    console.log('📦 Initializing Kafka Producer...');
    try {
      await initializeProducer();
    } catch (error) {
      console.warn('⚠️  Kafka initialization failed (continuing without Kafka):', error.message);
    }
    
    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log('\n✅ SERVER READY');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🔌 Socket.io: ws://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n📚 API Endpoints:');
      console.log('   POST /api/parse-intent');
      console.log('   POST /api/generate-itinerary');
      console.log('   GET  /api/itineraries');
      console.log('   POST /api/price-watch');
      console.log('   GET  /api/health\n');
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
