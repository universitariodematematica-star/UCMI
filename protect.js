// 🔒 BLOQUEO INMEDIATO
document.documentElement.style.display = "none";

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

// ⏱️ CONTROL DE INACTIVIDAD (5 minutos)
let timeoutInactividad;

function resetInactividad() {
    clearTimeout(timeoutInactividad);

    timeoutInactividad = setTimeout(() => {
        alert("Sesión cerrada por inactividad");
        window.location.href = "index.html";
    }, 60 * 60 * 1000); // 1 hora
}

// 🔐 CONTROL GLOBAL
onAuthStateChanged(auth, (user) => {

    try {

        if (!user) {
            block("Debes iniciar sesión");
            return;
        }

        const ref = doc(db, "licenses", user.email);

        unsubscribe = onSnapshot(ref, (snap) => {

            if (!snap.exists()) {
                block("No tienes licencia activa");
                return;
            }

            const data = snap.data();

            // 🛠️ FIX ROBUSTO DE FECHA
            const fecha = (data.expiration || "").trim();
            const expiration = new Date(`${fecha}T23:59:59`);

            if (isNaN(expiration.getTime())) {
                console.error("Fecha inválida:", fecha);
                block("Error interno en fecha de licencia");
                return;
            }

            if (new Date() > expiration) {
                block("Tu licencia ha expirado");
                return;
            }

            // ✅ ACCESO PERMITIDO
            document.documentElement.style.display = "block";

            if (!accesoConcedido) {
                accesoConcedido = true;

                activarProteccionBasica();
                activarControlInactividad();
            }

        });

    } catch (e) {
        console.error(e);
        block("Error de verificación");
    }

});

// 🔒 BLOQUEO FINAL
function block(msg) {

    document.documentElement.style.display = "block";

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

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

// 🛡️ PROTECCIÓN BÁSICA (SUAVE, SIN ROMPER)
function activarProteccionBasica() {

    // 🚫 CLIC DERECHO
    document.addEventListener("contextmenu", e => e.preventDefault());

    // 🚫 TECLAS DEVTOOLS (sin romper navegación)
    document.addEventListener("keydown", e => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
            (e.ctrlKey && e.key === "U")
        ) {
            e.preventDefault();
        }
    });

    // 🔇 DESACTIVAR LOGS
    console.log = function () {};
}

// ⏱️ ACTIVAR DETECCIÓN DE INACTIVIDAD
function activarControlInactividad() {

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(evt => {
        document.addEventListener(evt, resetInactividad);
    });

    resetInactividad();
}
