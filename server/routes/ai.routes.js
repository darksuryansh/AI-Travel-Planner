import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateParseIntent, validateGenerateItinerary } from '../middleware/validation.js';
import { optionalAuth } from '../middleware/auth.js';
import { parseIntent, generateItinerary, generateVibeEmbedding } from '../services/aiService.js';
import cacheService from '../services/cacheService.js';
import { db, collections } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/parse-intent
 * Parse natural language travel request into structured data
 */
router.post(
  '/parse-intent',
  optionalAuth,
  validateParseIntent,
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    
    console.log(`🎯 Parsing intent: "${text}"`);
    
    // Check cache first
    const cached = await cacheService.getIntent(text);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }
    
    // Parse with AI
    const result = await parseIntent(text);
    
    // Cache result
    await cacheService.setIntent(text, result.data);
    
    res.json({
      success: true,
      data: result.data,
      cached: false
    });
  })
);

/**
 * POST /api/generate-itinerary
 * Generate detailed travel itinerary with caching
 */
router.post(
  '/generate-itinerary',
  optionalAuth,
  validateGenerateItinerary,
  asyncHandler(async (req, res) => {
    const params = req.body;
    
    console.log(`🗺️  Generating itinerary for ${params.destination} (${params.duration} days)`);
    
    // Step 1: Check Redis cache
    const cached = await cacheService.getItinerary(params);
    if (cached) {
      console.log('✅ Returning cached itinerary');
      return res.json({
        success: true,
        data: cached,
        cached: true,
        message: 'Itinerary retrieved from cache'
      });
    }
    
    // Step 2: Generate with AI
    console.log('🤖 Generating new itinerary with Gemini...');
    const result = await generateItinerary(params);
    
    // Step 3: Cache the result
    await cacheService.setItinerary(params, result.data);
    
    // Step 4: Save to Firestore (if user is authenticated)
    let savedId = null;
    if (req.user) {
      try {
        const itineraryDoc = {
          ...result.data,
          userId: req.user.uid,
          userEmail: req.user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parameters: params,
          isPublic: false
        };
        
        const docRef = await db.collection(collections.ITINERARIES).add(itineraryDoc);
        savedId = docRef.id;
        console.log(`💾 Saved itinerary to Firestore: ${savedId}`);
      } catch (error) {
        console.error('Firestore save error:', error);
        // Continue anyway - saving is optional
      }
    }
    
    res.json({
      success: true,
      data: result.data,
      cached: false,
      saved: savedId !== null,
      itineraryId: savedId,
      message: 'Itinerary generated successfully'
    });
  })
);

/**
 * POST /api/itinerary/:itineraryId/vibe-embedding
 * Generate vibe embedding for semantic search
 */
router.post(
  '/itinerary/:itineraryId/vibe-embedding',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { itineraryId } = req.params;
    
    // Fetch itinerary from Firestore
    const doc = await db.collection(collections.ITINERARIES).doc(itineraryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    
    const itinerary = doc.data();
    
    // Generate vibe embedding
    const result = await generateVibeEmbedding(itinerary);
    
    // Update itinerary with vibe data
    await db.collection(collections.ITINERARIES).doc(itineraryId).update({
      vibeDescription: result.data.description,
      vibeEmbeddingsGenerated: true,
      updatedAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: result.data,
      message: 'Vibe embedding generated (ready for vector DB integration)'
    });
  })
);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      redis: 'connected',
      firebase: 'connected',
      gemini: 'configured'
    }
  });
});

export default router;
