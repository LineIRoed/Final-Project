// Imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase project configuration object
const firebaseConfig = {
    apiKey: "AIzaSyC4RLrsm0Tctw1zD_UMSoqqmlBjdHUbWHk",
    authDomain: "final-project-fe494.firebaseapp.com",
    projectId: "final-project-fe494",
    storageBucket: "final-project-fe494.firebasestorage.app",
    messagingSenderId: "467497076080",
    appId: "1:467497076080:web:443335cdc99c80be9bbbb5",
    measurementId: "G-RYVEVELCYR"
};

// Initialize Firebase app with the config object
const app = initializeApp(firebaseConfig)

// Initialize and export Firebase Authentication service
export const auth = getAuth(app)
// Initialize and export Firestore database service
export const db = getFirestore(app)
