import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin;
    }

    let credential;

    // Option 1: Service Account File (recommended for local development)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        credential = admin.credential.cert(serviceAccount);
        console.log('✅ Using Firebase service account file');
      } catch (fileError) {
        console.warn('⚠️  Service account file not found, trying individual env vars...');
      }
    }

    // Option 2: Individual Environment Variables
    if (!credential && process.env.FIREBASE_PROJECT_ID) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error('Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL');
      }

      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      });
      console.log('✅ Using Firebase environment variables');
    }

    // Option 3: No Firebase (development mode without persistence)
    if (!credential) {
      console.warn('⚠️  Firebase not configured - running in NO PERSISTENCE mode');
      console.warn('⚠️  To enable Firebase:');
      console.warn('   1. Get serviceAccountKey.json from Firebase Console');
      console.warn('   2. Place it in server/ directory');
      console.warn('   3. Set FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json in .env');
      return null;
    }

    admin.initializeApp({ credential });
    console.log('✅ Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.warn('⚠️  Continuing without Firebase - some features will be disabled');
    return null;
  }
};

export const firebaseAdmin = initializeFirebase();
export const db = firebaseAdmin ? firebaseAdmin.firestore() : null;

// Firestore collections
export const collections = {
  USERS: 'users',
  ITINERARIES: 'itineraries',
  COLLABORATIONS: 'collaborations',
  PRICE_WATCHES: 'priceWatches',
};

export default firebaseAdmin;
