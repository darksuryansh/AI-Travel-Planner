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
    
    if (admin.apps.length > 0) {
      return admin;
    }

    let credential;

    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
        console.log(' Using Firebase service account from FIREBASE_SERVICE_ACCOUNT');
      } catch (error) {
        console.error(' Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
      }
    }
    
 
    if (!credential && process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const pathValue = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
     
      if (!pathValue.trim().startsWith('{')) {
        const serviceAccountPath = resolve(__dirname, '..', pathValue);
        try {
          const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
          credential = admin.credential.cert(serviceAccount);
          console.log(' Using Firebase service account file from path');
        } catch (fileError) {
          console.warn(' Service account file not found:', fileError.message);
        }
      } else {
      
        try {
          const serviceAccount = JSON.parse(pathValue);
          credential = admin.credential.cert(serviceAccount);
          console.log(' Using Firebase service account from FIREBASE_SERVICE_ACCOUNT_PATH (JSON content)');
        } catch (error) {
          console.error(' Failed to parse FIREBASE_SERVICE_ACCOUNT_PATH as JSON:', error.message);
        }
      }
    }

    

    if (!credential) {
      throw new Error('No Firebase credentials found. ');
    }

    admin.initializeApp({ credential });
    console.log('Firebase Admin SDK initialized successfully');
    return admin;
    
  } catch (error) {
    console.error(' Firebase initialization error:', error.message);
    return null;
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
