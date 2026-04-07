// src/services/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * 🔴 Firebase Configuration
 * Note: If you are seeing errors here, ensure you have set up your
 * Firebase project and provided the correct keys in your .env file
 * or directly in this object.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validation: Check if the API Key is provided (basic check)
const isConfigured =
  !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key";

if (!isConfigured && !getApps().length) {
  console.warn(
    "⚠️ Firebase is not properly configured. \n" +
      "Please check your .env file or src/services/firebase.ts. \n" +
      "Functionality like Auth and Firestore will fail until configured.",
  );
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
