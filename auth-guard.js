// ========================================================
// PROTECTOR INTEGRAL UCMI (auth-guard.js) - VERSIÓN ROBUSTA
// ========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// IDENTIDAD MAESTRA
const MASTER_ID = "x0oBFbDP09d7I3VZvWuN6BOODf32";

// INACTIVIDAD
const TIEMPO_INACTIVIDAD = 30 * 60 * 1000;
let timer;

// BLOQUEO INICIAL
document.documentElement.style.display = "none";

// ========================================================
// MONITOR PRINCIPAL
// ========================================================
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        expulsarUsuario();
        return;
    }

    try {

        // 1. LEER USUARIO EN FIRESTORE
        const snap = await getDoc(doc(db, "usuarios", user.email.toLowerCase().trim()));

        if (!snap.exists()) {
            await registrarIntentoIntruso(user);
            expulsarUsuario();
            return;
        }

        const data = snap.data();

        // 2. MASTER SIEMPRE ENTRA
        if (user.uid === MASTER_ID) {
            mostrarSistema();
            return;
        }

        // 3. USUARIO INACTIVO
        if (data.estado !== "activo") {
            await signOut(auth);
            expulsarUsuario();
            return;
        }

        // 4. CONTROL DE PERFIL POR PÁGINA
        const perfilRequerido = window.PERFIL_REQUERIDO;

        if (perfilRequerido && data.perfil !== perfilRequerido) {
            await registrarIntentoIntruso(user);
            expulsarUsuario();
            return;
        }

        // 5. ACCESO OK
        mostrarSistema();

    } catch (error) {
        console.error("Error en auth-guard:", error);
        expulsarUsuario();
    }
});

// ========================================================
// MOSTRAR SISTEMA + INACTIVIDAD
// ========================================================
function mostrarSistema() {
    document.documentElement.style.display = "block";
    iniciarVigilanciaInactividad();
}

// ========================================================
// AUDITORÍA
// ========================================================
async function registrarIntentoIntruso(user) {
    try {
        await setDoc(doc(db, "logs_seguridad", `intento_${Date.now()}`), {
            uid: user.uid,
            email: user.email,
            fecha: serverTimestamp(),
            pagina: window.location.pathname,
            evento: "ACCESO_DENEGADO"
        });
    } catch (e) {
        console.error("No se pudo registrar log de seguridad");
    }
}

// ========================================================
// INACTIVIDAD
// ========================================================
function iniciarVigilanciaInactividad() {
    const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    eventos.forEach(ev => document.addEventListener(ev, resetearReloj));

    resetearReloj();
}

function resetearReloj() {
    clearTimeout(timer);

    timer = setTimeout(async () => {
        await signOut(auth);
        expulsarUsuario();
    }, TIEMPO_INACTIVIDAD);
}

// ========================================================
// EXPULSIÓN SEGURA
// ========================================================
function expulsarUsuario() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("index.html");
}

// ========================================================
// SANITIZACIÓN
// ========================================================
window.sanitizarTexto = function(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};
