import { firebaseAdmin } from '../config/firebase.js';

/**
 * Middleware to verify Firebase Authentication token
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email
      };
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Optional auth - adds user if token present but doesn't block
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      
      try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email
        };
      } catch (error) {
        // Token invalid but continue anyway
        console.warn('Optional auth - invalid token');
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

export default {
  verifyAuth,
  optionalAuth
};
