import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);
