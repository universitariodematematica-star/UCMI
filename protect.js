// 🔐 BLOQUEO INICIAL (evita flash de contenido)
document.documentElement.style.visibility = "hidden";

// 🔐 CONTROL DE SESIÓN DE PLATAFORMA (NO FIREBASE)
if (!sessionStorage.getItem("session_active")) {
    window.location.href = "index.html";
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let unsubscribe = null;
let accesoConcedido = false;

// ⏱️ CONTROL DE INACTIVIDAD
let timeoutInactividad;
const TIEMPO_INACTIVIDAD = 1 * 60 * 1000; // 1 hora

function cerrarSesionPorInactividad() {
    alert("Sesión cerrada por inactividad");

    sessionStorage.removeItem("session_active");

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    window.location.href = "index.html";
}

function resetInactividad() {
    clearTimeout(timeoutInactividad);

    timeoutInactividad = setTimeout(() => {
        cerrarSesionPorInactividad();
    }, TIEMPO_INACTIVIDAD);
}

function activarInactividad() {
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(evt => {
        document.addEventListener(evt, resetInactividad);
    });

    resetInactividad();
}

// 🔐 CONTROL GLOBAL FIREBASE
onAuthStateChanged(auth, (user) => {

    try {

        if (!user) {
            sessionStorage.removeItem("session_active");
            window.location.href = "index.html";
            return;
        }

        const ref = doc(db, "licenses", user.email);

        unsubscribe = onSnapshot(ref, (snap) => {

            if (!snap.exists()) {
                block("No tienes licencia activa");
                return;
            }

            const data = snap.data();

            const fecha = (data.expiration || "").trim();
            const expiration = new Date(`${fecha}T23:59:59`);

            if (isNaN(expiration.getTime())) {
                block("Error interno en fecha de licencia");
                return;
            }

            if (new Date() > expiration) {
                block("Tu licencia ha expirado");
                return;
            }

            // ✅ ACCESO PERMITIDO
            document.documentElement.style.visibility = "visible";

            if (!accesoConcedido) {
                accesoConcedido = true;
                activarProteccionBasica();
                activarInactividad();
            }

        });

    } catch (e) {
        console.error(e);
        block("Error de verificación");
    }

});

// 🔒 BLOQUEO FINAL (NO ROMPER UI)
function block(msg) {

    document.documentElement.style.visibility = "visible";

    document.body.innerHTML = `
        <div style="
            margin-top:100px;
            text-align:center;
            font-family:Arial;
        ">
            <h2>⛔ Acceso restringido</h2>
            <p>${msg}</p>
            <br>
            <button onclick="window.location.href='index.html'">
                Volver
            </button>
        </div>
    `;

    sessionStorage.removeItem("session_active");

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

// 🛡️ PROTECCIÓN BÁSICA (NO AGRESIVA)
function activarProteccionBasica() {

    document.addEventListener("contextmenu", e => e.preventDefault());

    document.addEventListener("keydown", e => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
            (e.ctrlKey && e.key === "U")
        ) {
            e.preventDefault();
        }
    });

    console.log = function () {};
}
