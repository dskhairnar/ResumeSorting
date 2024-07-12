// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "notebook-8e68d.firebaseapp.com",
  projectId: "notebook-8e68d",
  storageBucket: "notebook-8e68d.appspot.com",
  messagingSenderId: "303208715088",
  appId: "1:303208715088:web:6f7be3325a65cb1939d255"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);