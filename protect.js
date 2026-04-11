// 1. Ocultar el contenido de inmediato para evitar "parpadeos" de información
document.documentElement.style.visibility = "hidden";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración (asegúrate de que el apiKey esté completo)
const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let ok = false;
let timer;

// 🔐 GUARDIA SIMPLE: Si no hay llave en sessionStorage, fuera de aquí.
if (sessionStorage.getItem("auth_ok") !== "1") {
    window.location.replace("index.html");
}

// 🔁 VALIDACIÓN DE FIREBASE Y LICENCIA
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Solo cerramos si Firebase confirma que NO hay usuario
        // Damos un pequeño margen para evitar falsos positivos
        setTimeout(() => {
            if (!auth.currentUser) cerrar("Sesión expirada o no encontrada");
        }, 1500);
        return;
    }

    // Si hay usuario, verificamos su licencia en Firestore
    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
            cerrar("No tienes una licencia activa asignada.");
            return;
        }

        const data = snap.data();
        // Ajuste de fecha: asume que la expiración es YYYY-MM-DD
        const exp = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Tu licencia ha caducado.");
            return;
        }

        // ✔️ TODO CORRECTO: Mostramos la página
        mostrar();
    }, (error) => {
        console.error("Error en Snapshot:", error);
        cerrar("Error verificando licencia.");
    });
});

// ⏱️ FUNCIONES DE CONTROL
function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        cerrar("Sesión cerrada por inactividad (10 min)");
    }, 10 * 60 * 1000);
}

function cerrar(msg) {
    sessionStorage.clear(); // Limpia toda la memoria
    if (msg) alert(msg);
    signOut(auth).finally(() => {
        window.location.replace("index.html");
    });
}

function mostrar() {
    if (ok) return;
    ok = true;

    // Hacemos visible el contenido
    document.documentElement.style.visibility = "visible";

    // Iniciamos control de inactividad
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(e => {
        document.addEventListener(e, resetTimer);
    });

    resetTimer();
}
