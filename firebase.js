import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9HEUh_8X2Q5DzNhiu21cytQamB5JUaak",
  authDomain: "ai-pantry-tracker-91fe5.firebaseapp.com",
  projectId: "ai-pantry-tracker-91fe5",
  storageBucket: "ai-pantry-tracker-91fe5.appspot.com",
  messagingSenderId: "584341412524",
  appId: "1:584341412524:web:887738b85a79275b151d09",
  measurementId: "G-KLX6Y0X8ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };


