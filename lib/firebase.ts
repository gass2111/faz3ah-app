// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwyIX3ic8nbVYaIthztKIQf9fk1gSn7lc",
  authDomain: "faz3ah.firebaseapp.com",
  projectId: "faz3ah",
  storageBucket: "faz3ah.firebasestorage.app",
  messagingSenderId: "82166033689",
  appId: "1:82166033689:web:3e7803f6fca12579ed6988"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);