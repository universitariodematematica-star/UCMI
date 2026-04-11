// 🔒 OCULTAR HASTA VALIDACIÓN
document.documentElement.style.visibility = "hidden";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= ESTADO ================= */

let unsubscribe = null;
let accesoActivo = false;

/* ================= SESIÓN ================= */

if (sessionStorage.getItem("auth_ok") !== "1") {
    window.location.replace("index.html");
}

/* ================= INACTIVIDAD ================= */

let timerInactividad;

const TIEMPO_INACTIVIDAD = 1 * 60 * 1000; // 10 min

function resetInactividad() {
    clearTimeout(timerInactividad);

    timerInactividad = setTimeout(() => {
        cerrarSesion("Sesión cerrada por inactividad");
    }, TIEMPO_INACTIVIDAD);
}

function activarInactividad() {

    const eventos = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    eventos.forEach(evt => {
        document.addEventListener(evt, resetInactividad, { passive: true });
    });

    resetInactividad();
}

/* ================= CIERRE DE SESIÓN ================= */

function cerrarSesion(mensaje) {

    sessionStorage.removeItem("auth_ok");

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    alert(mensaje);

    signOut(auth).finally(() => {
        window.location.href = "index.html";
    });
}

/* ================= VALIDACIÓN PRINCIPAL ================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {
        cerrarSesion("Sesión inválida");
        return;
    }

    const ref = doc(db, "licenses", user.email);

    unsubscribe = onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            cerrarSesion("Licencia no encontrada");
            return;
        }

        const data = snap.data();

        const fecha = (data.expiration || "").trim();
        const expiration = new Date(`${fecha}T23:59:59`);

        if (isNaN(expiration.getTime())) {
            cerrarSesion("Licencia inválida");
            return;
        }

        if (new Date() > expiration) {
            cerrarSesion("Licencia expirada");
            return;
        }

        // ================= ACCESO OK =================

        sessionStorage.setItem("auth_ok", "1");

        if (!accesoActivo) {
            accesoActivo = true;

            document.documentElement.style.visibility = "visible";

            activarInactividad();
        }
    });

});
