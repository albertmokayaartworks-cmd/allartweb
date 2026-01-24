// src/services/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQWJkpwgliF6TFtHwAZXWaF-qHXNJEwDY",
  authDomain: "eccomerce-768db.firebaseapp.com",
  projectId: "eccomerce-768db",
  storageBucket: "eccomerce-768db.firebasestorage.app",
  messagingSenderId: "1077104985410",
  appId: "1:1077104985410:web:a776922d9e78294a7534db",
  measurementId: "G-02GNK8LP8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;