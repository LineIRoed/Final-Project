import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC4RLrsm0Tctw1zD_UMSoqqmlBjdHUbWHk",
    authDomain: "final-project-fe494.firebaseapp.com",
    projectId: "final-project-fe494",
    storageBucket: "final-project-fe494.firebasestorage.app",
    messagingSenderId: "467497076080",
    appId: "1:467497076080:web:443335cdc99c80be9bbbb5",
    measurementId: "G-RYVEVELCYR"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
