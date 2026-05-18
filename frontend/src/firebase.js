import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD5h6aGwAAeGrC_EvmFn7PZeV6Ig6BuLHw",
    authDomain: "santa-ad7a0.firebaseapp.com",
    projectId: "santa-ad7a0",
    storageBucket: "santa-ad7a0.firebasestorage.app",
    messagingSenderId: "877078979860",
    appId: "1:877078979860:web:aeecc5bc7841fcbb004e01",
    measurementId: "G-WHPHF30TJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
