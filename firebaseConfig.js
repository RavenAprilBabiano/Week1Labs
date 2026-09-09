import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; //This must be included
const firebaseConfig = {
apiKey: "AIzaSyDIsRlkor2JJeK66O4eDdkTPler8afgtfU",
authDomain: "week1labs-d34a2.firebaseapp.com",
projectId: "week1labs-d34a2",
storageBucket: "week1labs-d34a2.firebasestorage.app",
messagingSenderId: "783975810382",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); //This must be included