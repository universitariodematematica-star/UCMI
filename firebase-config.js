import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ======================================================
// CONFIGURACIÓN CENTRAL UCMI
// ======================================================

export const CONFIG = {

    // SUPERADMIN
    UID_MAESTRO: "x0oBFbDP09d7I3VZvWuN6BOODf32",

    // URLS DEL SISTEMA
    URL_FORMULARIO_ESTUDIANTE:
        "https://universitariodematematica-star.github.io/UCMI/formulario-postulacion.html",

    URL_FORMULARIO_DOCENTE:
        "https://universitariodematematica-star.github.io/UCMI/postulacion-docente.html",

    URL_POSTULACION_ACADEMICA:
        "https://universitariodematematica-star.github.io/UCMI/postulacion-academica.html",

    URL_INDEX:
        "index.html"
};

// ======================================================
// FIREBASE
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
    authDomain: "ucmi-13796634.firebaseapp.com",
    projectId: "ucmi-13796634",
    storageBucket: "ucmi-13796634.firebasestorage.app",
    messagingSenderId: "1090719609536",
    appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325",
    measurementId: "G-3M3DH25722"
};

// ======================================================
// INICIALIZACIÓN
// ======================================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
