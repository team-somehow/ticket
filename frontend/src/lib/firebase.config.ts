// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxBxQxYJioSKJpoeF1wC9Co1gbKdt7jnc",
  authDomain: "personal-projects-e8a07.firebaseapp.com",
  projectId: "personal-projects-e8a07",
  storageBucket: "personal-projects-e8a07.firebasestorage.app",
  messagingSenderId: "873434627474",
  appId: "1:873434627474:web:34a83747c2f1a6cfcf954b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
