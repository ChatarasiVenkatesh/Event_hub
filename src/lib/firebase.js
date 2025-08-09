import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0l1KGN--ZvQxIFOVFPNiU8E0PpzJ2gzU",
  authDomain: "event-portal-7de19.firebaseapp.com",
  projectId: "event-portal-7de19",
  storageBucket: "event-portal-7de19.firebasestorage.app",
  messagingSenderId: "403477752642",
  appId: "1:403477752642:web:dcb7cb9b00307e55d336db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


