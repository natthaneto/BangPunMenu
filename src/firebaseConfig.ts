import { initializeApp } from "firebase/app";
import { getFirestore, terminate, clearIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPwo1fHTO1tkCDN6QZlwDj11VG4c3O3Ec",
  authDomain: "lab06-ionic-firebase-e7ea5.firebaseapp.com",
  projectId: "lab06-ionic-firebase-e7ea5",
  storageBucket: "lab06-ionic-firebase-e7ea5.firebasestorage.app",
  messagingSenderId: "702090503498",
  appId: "1:702090503498:web:446abbf67ace1bf464cdb3",
  measurementId: "G-WC4V8R93VP"
};

const app = initializeApp(firebaseConfig);


// กลับมาใช้แบบมาตรฐาน (จะวิ่งเข้า default ทันที)
export const db = getFirestore(app); 
export const storage = getStorage(app);
export const auth = getAuth(app);
clearIndexedDbPersistence(db).catch((err) => {
  console.error("Could not clear persistence:", err);
});