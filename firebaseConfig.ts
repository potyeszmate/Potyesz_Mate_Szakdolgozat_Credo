import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCevIOdziT9r8ZR-W0ILfCC8rLvqWJcAQ8",
  authDomain: "credo-demo.firebaseapp.com",
  databaseURL: "https://credo-demo-default-rtdb.firebaseio.com",
  projectId: "credo-demo",
  storageBucket: "credo-demo.appspot.com",
  messagingSenderId: "1081560990096",
  appId: "1:1081560990096:web:1d9e8b5d77d0e52dfd7315",
  measurementId: "G-58NDQQ3J43"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore(app); // Use getFirestore to initialize Firestore

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);

// export default app; // Optionally, you can export the app instance if needed elsewhere
