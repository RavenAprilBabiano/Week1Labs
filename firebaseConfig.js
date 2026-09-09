import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDIsRlkor2JJeK66O4eDdkTPler8afgtfU",
  authDomain: "week1labs-d34a2.firebaseapp.com",
  projectId: "week1labs-d34a2",
  storageBucket: "week1labs-d34a2.firebasestorage.app",
  messagingSenderId: "783975810382",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}
export { auth };