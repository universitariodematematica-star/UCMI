import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Estos datos los sacas de tu Consola de Firebase -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
  authDomain: "ucmi-13796634.firebaseapp.com",
  projectId: "ucmi-13796634",
  storageBucket: "ucmi-13796634.firebasestorage.app",
  messagingSenderId: "1090719609536",
  appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325",
  measurementId: "G-3M3DH25722"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos para que el Repositorio la use
export const db = getFirestore(app);
