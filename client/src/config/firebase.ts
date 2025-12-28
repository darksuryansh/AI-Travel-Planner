


//  Firebase handles all authentication complexity (tokens, sessions, security)
//  No need to build custom login system
//  Integrates seamlessly with Firebase Admin SDK on backend



import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';


dotenv.config();


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,              // Public API key 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,      // Where auth redirects go
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,        //  project ID
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // For file uploads 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // For push notifications 
  appId: import.meta.env.VITE_FIREBASE_APP_ID                 // Unique app identifier
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export default app;
