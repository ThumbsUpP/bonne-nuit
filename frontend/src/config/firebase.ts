import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Replace these with your Firebase project configuration
// You can find this in Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "AIzaSyC8BElKVRPXc-b9Og-Nzr_rCdov7ewPxQM",
  authDomain: "bonne-nuit-98a0f.firebaseapp.com",
  projectId: "bonne-nuit-98a0f",
  storageBucket: "bonne-nuit-98a0f.firebasestorage.app",
  messagingSenderId: "532857616238",
  appId: "1:532857616238:ios:ccb008dd98f528e961337f"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    const existingAuth = getAuth(app);
    return existingAuth;
  } catch (error) {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  }
})();
export const db = getFirestore(app);

export default app;
