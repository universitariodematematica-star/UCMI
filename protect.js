// 🔒 OCULTAR TODO INMEDIATO
document.documentElement.style.visibility = "hidden";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let unsubscribe = null;

// ⛔ SI NO ESTÁ LOGUEADO: BLOQUEO INMEDIATO (ANTES DE RENDER)
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    const ref = doc(db, "licenses", user.email);

    unsubscribe = onSnapshot(ref, (snap) => {

        // ❌ no existe licencia
        if (!snap.exists()) {
            block("No tienes licencia activa");
            return;
        }

        const data = snap.data();

        // 🧠 validar fecha
        const fecha = (data.expiration || "").trim();
        const expiration = new Date(`${fecha}T23:59:59`);

        if (isNaN(expiration.getTime())) {
            block("Error en licencia");
            return;
        }

        if (new Date() > expiration) {
            block("Licencia expirada");
            return;
        }

        // ✅ TODO OK → MOSTRAR PÁGINA
        showPage();

    }, () => {
        block("Error de conexión");
    });
});

// ✅ MOSTRAR PÁGINA SOLO CUANDO ES VÁLIDO
function showPage() {
    document.documentElement.style.visibility = "visible";

    activarProteccionBasica();
    activarControlInactividad();
}

// ❌ BLOQUEO TOTAL
function block(msg) {

    document.documentElement.style.visibility = "visible";

    document.body.innerHTML = `
        <div style="text-align:center;margin-top:100px;font-family:Arial">
            <h2>⛔ Acceso restringido</h2>
            <p>${msg}</p>
            <button onclick="window.location.replace('index.html')">
                Volver
            </button>
        </div>
    `;

    if (unsubscribe) unsubscribe();
}

// 🛡️ PROTECCIÓN BÁSICA
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
}

// ⏱️ INACTIVIDAD
let timeout;

function resetInactividad() {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        alert("Sesión cerrada por inactividad");
        window.location.replace("index.html");
    }, 60 * 60 * 1000);
}

function activarControlInactividad() {
    ["click", "mousemove", "keydown", "scroll", "touchstart"]
        .forEach(e => document.addEventListener(e, resetInactividad));

    resetInactividad();
}
