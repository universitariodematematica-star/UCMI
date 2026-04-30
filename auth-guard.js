// ========================================================
// PROTECTOR INTEGRAL UCMI (auth-guard.js) - VERSIÓN FINAL
// Capas: Identidad, Inactividad, Auditoría y Sanitización
// ========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
    authDomain: "ucmi-13796634.firebaseapp.com",
    projectId: "ucmi-13796634",
    storageBucket: "ucmi-13796634.firebasestorage.app",
    messagingSenderId: "1090719609536",
    appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// TU IDENTIDAD MAESTRA
const MASTER_ID = "m56REyF19sOsC6BE5sJdJG6eR863";

// CONFIGURACIÓN DE INACTIVIDAD (30 minutos)
const TIEMPO_INACTIVIDAD = 30 * 60 * 1000; 
let timer;

// 1. BLOQUEO VISUAL INMEDIATO
document.documentElement.style.display = "none";

// 2. MONITOR DE ESTADO DE SESIÓN
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (user.uid === MASTER_ID) {
            // ACCESO CONCEDIDO
            document.documentElement.style.display = "block";
            iniciarVigilanciaInactividad();
            console.log("Sesión activa: Bienvenido, Administrador.");
        } else {
            // INTRUSO: Usuario autenticado pero sin permisos
            console.error("UID no autorizado. Registrando intento...");
            await registrarIntentoIntruso(user);
            expulsarUsuario();
        }
    } else {
        // SIN SESIÓN INICIADA
        expulsarUsuario();
    }
});

// 3. CAPA DE AUDITORÍA: Registro en Firestore
async function registrarIntentoIntruso(user) {
    const logId = `intento_${Date.now()}`;
    try {
        await setDoc(doc(db, "logs_seguridad", logId), {
            uid: user.uid,
            email: user.email,
            fecha: serverTimestamp(),
            pagina: window.location.pathname,
            evento: "ACCESO_DENEGADO_NO_MASTER"
        });
    } catch (e) {
        console.error("Error al reportar log de seguridad");
    }
}

// 4. CAPA DE INACTIVIDAD: Detecta movimiento
function iniciarVigilanciaInactividad() {
    const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    eventos.forEach(ev => document.addEventListener(ev, resetearReloj));
    resetearReloj();
}

function resetearReloj() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        console.warn("Sesión expirada por inactividad.");
        await signOut(auth);
        expulsarUsuario();
    }, TIEMPO_INACTIVIDAD);
}

// 5. FUNCIÓN DE LIMPIEZA Y SALIDA
function expulsarUsuario() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("index.html");
}

// 6. HERRAMIENTA EXTRA: Sanitización de datos (Prevención XSS)
window.sanitizarTexto = function(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};
