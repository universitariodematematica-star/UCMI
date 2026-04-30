// ==========================================
// CENTRALIZADOR DE SEGURIDAD UCMI (auth-guard.js)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
    authDomain: "ucmi-13796634.firebaseapp.com",
    projectId: "ucmi-13796634",
    storageBucket: "ucmi-13796634.firebasestorage.app",
    messagingSenderId: "1090719609536",
    appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// TU UID DE SUPERADMINISTRADOR
const MASTER_ID = "m56REyF19sOsC6BE5sJdJG6eR863";

// 1. BLOQUEO VISUAL INMEDIATO
// Aplicamos el estilo directamente al elemento raíz para evitar parpadeos
document.documentElement.style.display = "none";

// 2. MONITOR DE IDENTIDAD
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ¿Es el Superadministrador legítimo?
        if (user.uid === MASTER_ID) {
            console.log("Acceso Maestro Concedido");
            document.documentElement.style.display = "block"; // Revelamos la página
        } else {
            // Es un usuario autenticado pero NO es el administrador
            console.error("Acceso no autorizado para este UID");
            redirigirAlLogin();
        }
    } else {
        // No hay sesión iniciada
        redirigirAlLogin();
    }
});

/**
 * Función centralizada para expulsar intrusos
 */
function redirigirAlLogin() {
    // Usamos replace para que no puedan volver atrás con el historial del navegador
    window.location.replace("index.html");
}
