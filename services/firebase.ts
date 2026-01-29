import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gadget-addiction.firebaseapp.com",
  projectId: "gadget-addiction",
  storageBucket: "gadget-addiction.appspot.com",
  messagingSenderId: "625192308034",
  appId: "1:625192308034:web:5f8a7ab7014985505f4cdb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
