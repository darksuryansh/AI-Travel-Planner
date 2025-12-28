

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateGenerateItinerary } from '../middleware/validation.js';
import { optionalAuth } from '../middleware/auth.js';
import { generateItinerary } from '../services/aiService.js';
import { db, collections } from '../config/firebase.js';

const router = express.Router();


/*
  create a detailed day-by-day travel plan

 * Request body example:
 * {
 *   "destination": "Paris, France",
 *   "duration": 5,
 *   "budget": "moderate",
 *   "interests": ["culture", "food", "museums"],
 *   "travelStyle": "moderate",
 *   "accommodation": "hotel"
 * }
 * 

 * 
 * Auth: Optional - works without login, but saves to DB if logged in
 */


router.post('/generate-itinerary',
  optionalAuth,                     
  validateGenerateItinerary,        
  asyncHandler(async (req, res) => {  
    
    
    const params = req.body;
    console.log(`🗺️  Generating itinerary for ${params.destination} (${params.duration} days)`);
    
   
    console.log('🤖 Calling Gemini AI...');
    const result = await generateItinerary(params);  
    
 
    let savedId = null;
    if (req.user && db) {
      try {
        // Create a document to save
        const itineraryDoc = {
          ...result.data,              // The AI-generated itinerary
          userId: req.user.uid,        // Who created it
          userEmail: req.user.email,   // User's email
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parameters: params,          // Save the original request params
          isPublic: false              // Private by default
        };
        
        // Save to Firestore and get the document ID
        const docRef = await db.collection(collections.ITINERARIES).add(itineraryDoc);
        savedId = docRef.id;
        console.log(`💾 Saved to Firebase with ID: ${savedId}`);
      } catch (error) {
        console.error( error);
        
      }
    }
    
    //  Send response back to frontend
    res.json({
      success: true,
      data: result.data,              // The full itinerary
      saved: savedId !== null,        // Did we save it?
      itineraryId: savedId,           // Firebase document ID (if saved)
      message: 'Itinerary generated successfully'
    });
  })
);


export default router;



