// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 CONFIGURACIÓN REAL DE TU PROYECTO
const firebaseConfig = {
  apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
  authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
  projectId: "portal-autenticacion-a1ngles",
  storageBucket: "portal-autenticacion-a1ngles.firebasestorage.app",
  messagingSenderId: "1039504020190",
  appId: "1:1039504020190:web:212cf030c3e6feb175a84f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vas a usar
const auth = getAuth(app);
const db = getFirestore(app);

// 🔥 EXPORTAR (CLAVE)
export { auth, db };
