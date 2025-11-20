import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyAuth } from '../middleware/auth.js';
import { validatePriceWatch } from '../middleware/validation.js';
import { sendPriceWatchRequest } from '../services/kafkaProducer.js';
import { db, collections } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/price-watch
 * Create a new price watch request
 */
router.post(
  '/',
  verifyAuth,
  validatePriceWatch,
  asyncHandler(async (req, res) => {
    const { tripId, destination, origin, departureDate, returnDate, passengers } = req.body;
    const { uid, email } = req.user;
    
    console.log(`💰 Price watch requested for trip: ${tripId}`);
    
    // Store in Firestore
    const watchData = {
      tripId,
      userId: uid,
      userEmail: email,
      destination,
      origin,
      departureDate,
      returnDate: returnDate || null,
      passengers: passengers || 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastChecked: null,
      priceHistory: []
    };
    
    const docRef = await db.collection(collections.PRICE_WATCHES).add(watchData);
    const watchId = docRef.id;
    
    // Send to Kafka for worker processing
    await sendPriceWatchRequest({
      watchId,
      ...watchData
    });
    
    res.json({
      success: true,
      message: 'Price watch activated successfully',
      watchId,
      data: {
        watchId,
        tripId,
        status: 'active'
      }
    });
  })
);

/**
 * GET /api/price-watch
 * Get all price watches for user
 */
router.get(
  '/',
  verifyAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.user;
    
    const snapshot = await db
      .collection(collections.PRICE_WATCHES)
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const watches = [];
    snapshot.forEach(doc => {
      watches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: watches,
      count: watches.length
    });
  })
);

/**
 * GET /api/price-watch/:watchId
 * Get specific price watch with history
 */
router.get(
  '/:watchId',
  verifyAuth,
  asyncHandler(async (req, res) => {
    const { watchId } = req.params;
    const { uid } = req.user;
    
    const doc = await db.collection(collections.PRICE_WATCHES).doc(watchId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Price watch not found'
      });
    }
    
    const data = doc.data();
    
    if (data.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data
      }
    });
  })
);

/**
 * DELETE /api/price-watch/:watchId
 * Cancel price watch
 */
router.delete(
  '/:watchId',
  verifyAuth,
  asyncHandler(async (req, res) => {
    const { watchId } = req.params;
    const { uid } = req.user;
    
    const doc = await db.collection(collections.PRICE_WATCHES).doc(watchId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Price watch not found'
      });
    }
    
    const data = doc.data();
    
    if (data.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    // Mark as cancelled
    await db.collection(collections.PRICE_WATCHES).doc(watchId).update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Price watch cancelled successfully'
    });
  })
);

export default router;
