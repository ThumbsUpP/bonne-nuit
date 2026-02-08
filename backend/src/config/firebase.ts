import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../serviceAccountKey.json');

let initialized = false;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp();
      console.log('Firebase Admin initialized with default credentials.');
  } else {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      console.log('Firebase Admin initialized with service account key.');
  }
  initialized = true;
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  console.error('Make sure serviceAccountKey.json is in the root or GOOGLE_APPLICATION_CREDENTIALS is set.');
}

// Initialize Firestore with specific database ID if provided
export const db = initialized 
  ? (process.env.FIREBASE_DATABASE_ID 
      ? getFirestore(admin.app(), process.env.FIREBASE_DATABASE_ID) 
      : getFirestore()) 
  : null;

export const auth = initialized ? admin.auth() : null;
export const storage = initialized ? admin.storage() : null;
