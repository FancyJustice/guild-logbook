import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDn9uDPgsKgauBqIoWA04LIBvTA2KCyO8k",
  authDomain: "logbook-de087.firebaseapp.com",
  projectId: "logbook-de087",
  storageBucket: "logbook-de087.firebasestorage.app",
  messagingSenderId: "614762996993",
  appId: "1:614762996993:web:ff692aef695180a2992700",
  measurementId: "G-NLVMW5BH1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
