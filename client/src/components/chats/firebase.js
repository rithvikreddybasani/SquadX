// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDZVDCEcCoK5p1zSqf1S2J7RD_NQKaHZw",
  authDomain: "lasttproject-31fca.firebaseapp.com",
  projectId: "lasttproject-31fca",
  storageBucket: "lasttproject-31fca.firebasestorage.app",
  messagingSenderId: "750999091360",
  appId: "1:750999091360:web:8303d97ece0bd19f7f31c5",
  measurementId: "G-NY7LW6R0TV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
