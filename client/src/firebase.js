// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "l-mern-estate-b01.firebaseapp.com",
  projectId: "l-mern-estate-b01",
  storageBucket: "l-mern-estate-b01.appspot.com",
  messagingSenderId: "126355272139",
  appId: "1:126355272139:web:42bcecf09840d9ea92c64e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);