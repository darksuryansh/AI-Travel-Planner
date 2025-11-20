import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin;
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

export const firebaseAdmin = initializeFirebase();
export const db = firebaseAdmin.firestore();

// Firestore collections
export const collections = {
  USERS: 'users',
  ITINERARIES: 'itineraries',
  COLLABORATIONS: 'collaborations',
  PRICE_WATCHES: 'priceWatches',
};

export default firebaseAdmin;
