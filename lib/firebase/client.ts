// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACEaoBm_XxiOVVQbJC4BwarONzFyn6d-8",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "toddlers-website.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "toddlers-website",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "toddlers-website.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "507349535828",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:507349535828:web:a4a76adf5a71bfc6ddf1c1",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-93RF76D19D"
};

// Initialize Firebase (only once)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize Firebase Auth
auth = getAuth(app);

// Initialize Firestore
db = getFirestore(app);

// Initialize Analytics (only in browser)
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Export Firebase services
export { app, auth, db, analytics };

// Note: Firebase Storage is NOT initialized as per requirements
// DO NOT import or use Firebase Storage in this file
