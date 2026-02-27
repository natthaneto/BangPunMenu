// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// นำค่าเหล่านี้มาจาก Firebase Console (Project Settings > General)
const firebaseConfig = {
  apiKey: "AIzaSyB1T_a5ZqzAyPYmnjZmvODoQck_QK33AHQ",
  authDomain: "bangpanmenu.firebaseapp.com",
  projectId: "bangpanmenu",
  storageBucket: "bangpanmenu.firebasestorage.app",
  messagingSenderId: "424286678215",
  appId: "1:424286678215:web:4710a5e351b83449f222e2",
  measurementId: "G-4Y5MX89EK4"
};

const app = initializeApp(firebaseConfig);

// Export เพื่อนำไปใช้ในหน้า EditProfile หรือ CreateRecipe
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);