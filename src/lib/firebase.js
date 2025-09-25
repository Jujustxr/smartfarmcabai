// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7smwu2yy8vXvG5vYeglst70wAG7kPJb4",
  authDomain: "smartfarmcabai.firebaseapp.com",
  projectId: "smartfarmcabai",
  storageBucket: "smartfarmcabai.firebasestorage.app",
  messagingSenderId: "30308796718",
  appId: "1:30308796718:web:cc4d1b19f343c5eadfd2bf",
  measurementId: "G-RSDSY3TBMW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
