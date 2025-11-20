/**
 * Request validation middleware
 */

export const validateParseIntent = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Text input is required and must be a non-empty string'
    });
  }
  
  if (text.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Text input is too long (max 1000 characters)'
    });
  }
  
  next();
};

export const validateGenerateItinerary = (req, res, next) => {
  const { destination, duration, budget, interests } = req.body;
  
  const errors = [];
  
  if (!destination || typeof destination !== 'string') {
    errors.push('destination is required and must be a string');
  }
  
  if (!duration || typeof duration !== 'number' || duration < 1 || duration > 30) {
    errors.push('duration is required and must be a number between 1 and 30');
  }
  
  if (budget && !['economy', 'moderate', 'luxury'].includes(budget)) {
    errors.push('budget must be one of: economy, moderate, luxury');
  }
  
  if (interests && !Array.isArray(interests)) {
    errors.push('interests must be an array');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

export const validatePriceWatch = (req, res, next) => {
  const { tripId, destination, origin, departureDate } = req.body;
  
  const errors = [];
  
  if (!tripId || typeof tripId !== 'string') {
    errors.push('tripId is required and must be a string');
  }
  
  if (!destination || typeof destination !== 'string') {
    errors.push('destination is required and must be a string');
  }
  
  if (!origin || typeof origin !== 'string') {
    errors.push('origin is required and must be a string');
  }
  
  if (!departureDate || typeof departureDate !== 'string') {
    errors.push('departureDate is required and must be a string');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

export const validateItineraryId = (req, res, next) => {
  const { itineraryId } = req.params;
  
  if (!itineraryId || typeof itineraryId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid itinerary ID'
    });
  }
  
  next();
};

export default {
  validateParseIntent,
  validateGenerateItinerary,
  validatePriceWatch,
  validateItineraryId
};
