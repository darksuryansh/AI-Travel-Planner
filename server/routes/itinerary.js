import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyAuth } from '../middleware/auth.js';
import { validateItineraryId } from '../middleware/validation.js';
import { db, collections } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/itineraries
 * Get all itineraries for authenticated user
 */
router.get(
  '/',
  verifyAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const { limit = 20, offset = 0 } = req.query;
    
    // Temporarily removed orderBy to avoid index requirement
    // Add back later after creating composite index in Firebase Console
    const snapshot = await db
      .collection(collections.ITINERARIES)
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')  
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();
    
    const itineraries = [];
    snapshot.forEach(doc => {
      itineraries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: itineraries,
      count: itineraries.length
    });
  })
);

/**
 * GET /api/itineraries/:itineraryId
 * Get single itinerary by ID
 */
router.get(
  '/:itineraryId',
  verifyAuth,
  validateItineraryId,
  asyncHandler(async (req, res) => {
    const { itineraryId } = req.params;
    const { uid } = req.user;
    
    const doc = await db.collection(collections.ITINERARIES).doc(itineraryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    
    const data = doc.data();
    
    // Check ownership or public access
    if (data.userId !== uid && !data.isPublic) {
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
 * PUT /api/itineraries/:itineraryId
 * Update itinerary
 */
router.put(
  '/:itineraryId',
  verifyAuth,
  validateItineraryId,
  asyncHandler(async (req, res) => {
    const { itineraryId } = req.params;
    const { uid } = req.user;
    const updates = req.body;
    
    // Check ownership
    const doc = await db.collection(collections.ITINERARIES).doc(itineraryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    
    const data = doc.data();
    
    if (data.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied - not the owner'
      });
    }
    
    // Update
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: uid
    };
    
    await db.collection(collections.ITINERARIES).doc(itineraryId).update(updateData);
    
    res.json({
      success: true,
      message: 'Itinerary updated successfully',
      itineraryId
    });
  })
);

/**
 * DELETE /api/itineraries/:itineraryId
 * Delete itinerary
 */
router.delete(
  '/:itineraryId',
  verifyAuth,
  validateItineraryId,
  asyncHandler(async (req, res) => {
    const { itineraryId } = req.params;
    const { uid } = req.user;
    
    // Check ownership
    const doc = await db.collection(collections.ITINERARIES).doc(itineraryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    
    const data = doc.data();
    
    if (data.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied - not the owner'
      });
    }
    
    // Delete
    await db.collection(collections.ITINERARIES).doc(itineraryId).delete();
    
    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });
  })
);

/**
 * POST /api/itineraries/:itineraryId/share
 * Share itinerary (make public/private)
 */
router.post(
  '/:itineraryId/share',
  verifyAuth,
  validateItineraryId,
  asyncHandler(async (req, res) => {
    const { itineraryId } = req.params;
    const { uid } = req.user;
    const { isPublic } = req.body;
    
    // Check ownership
    const doc = await db.collection(collections.ITINERARIES).doc(itineraryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }
    
    const data = doc.data();
    
    if (data.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied - not the owner'
      });
    }
    
    // Update sharing settings
    await db.collection(collections.ITINERARIES).doc(itineraryId).update({
      isPublic: isPublic === true,
      updatedAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: `Itinerary is now ${isPublic ? 'public' : 'private'}`,
      isPublic
    });
  })
);

export default router;
