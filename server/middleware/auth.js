
//  FIREBASE AUTHENTICATION (Firebase's built-in auth system)

// 1.  User logs in with Firebase Auth (email/password, Google, etc.)
// 2.  Firebase gives user a JWT token (ID token)
// 3. Sends token in header: "Authorization: Bearer <token>"
// 4.   verify the token with Firebase Admin SDK
// 5.If valid, allow request to proceed



// verifyAuth     → REQUIRED authentication (blocks if no token)  --- protected route
// optionalAuth   → OPTIONAL authentication (continues without token)---- private routes


import { firebaseAdmin } from '../config/firebase.js';


export const verifyAuth = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    
    //  Check if token exists 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }
    
    //  Extract the token (remove "Bearer " prefix)
    const token = authHeader.split('Bearer ')[1];
    
    try {
      //  Verify token with Firebase Admin SDK

      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      
     
      req.user = {
        uid: decodedToken.uid,              // Firebase user ID (unique)
        email: decodedToken.email,          // User's email
        name: decodedToken.name || decodedToken.email  // Display name
      };
      
    
      next();
      
    } catch (error) {
      // Token verification failed (expired, invalid, tampered)
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid token'
      });
    }
  } catch (error) {
    // Unexpected error
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};



 
//   Purpose: Allow both logged-in and guest users to access the route

  // AI generation works for anyone
  // But if logged in, we also save to their account

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // If token exists, try to verify it
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      
      try {
        // Try to verify the token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        
        // Success! User is logged in
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email
        };
      } catch (error) {
        // Token is invalid, but we don't block the request
        // req.user stays undefined
        console.warn('Optional auth - invalid token, continuing anyway');
      }
    }
    
    // Continue to route handler regardless of auth status
    // Route handler can check if (req.user) to see if user is logged in
    next();
    
  } catch (error) {
    // Even if something goes wrong, don't block the request
    next();
  }
};

export default {
  verifyAuth,
  optionalAuth
};



// Firebase manage all these complexities --
// Creates JWT tokens when users log in
// Signs tokens securely
// Manages token expiration
// Handles token refresh automatically
// Provides user management UI
// Handles password reset, email verification, etc.
