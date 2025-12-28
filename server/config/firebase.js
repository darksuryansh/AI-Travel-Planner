import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase 
const initializeFirebase = () => {
  try {
    // Check if already initialized

    if (admin.apps.length > 0) {
      return admin;
    }

    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        credential = admin.credential.cert(serviceAccount);
        console.log(' Using Firebase service account file');
      } catch (fileError) {
        console.warn('  Service account file not found, trying individual env vars...');
      }
    }
    admin.initializeApp({ credential });
    console.log(' Firebase Connected');
    return admin;
    
  } catch (error) {
    console.error(' Firebase initialization error:', error.message);
   
  }
};

export const firebaseAdmin = initializeFirebase();
export const db = firebaseAdmin ? firebaseAdmin.firestore() : null;


// Firestore collections

export const collections = {
  USERS: 'users',
  ITINERARIES: 'itineraries',
  // COLLABORATIONS: 'collaborations',
  // PRICE_WATCHES: 'priceWatches',
};

export default firebaseAdmin;
