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

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

let unsubscribe = null;
let accesoOK = false;

/* 🔒 OVERLAY (bloquea visualmente sin romper la página) */
const overlay = document.createElement("div");
overlay.id = "authOverlay";
overlay.style.cssText = `
position:fixed;
inset:0;
background:#fff;
display:flex;
align-items:center;
justify-content:center;
font-family:Arial;
z-index:999999;
`;
overlay.innerHTML = "🔄 Verificando acceso...";
document.documentElement.appendChild(overlay);

/* 🧠 fallback anti-bloqueo */
setTimeout(() => {
    if (overlay) overlay.remove();
}, 6000);

/* 🔐 AUTH */
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "licenses", user.email);

    unsubscribe = onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            return block("No tienes licencia activa");
        }

        const data = snap.data();

        const fecha = (data.expiration || "").trim();
        const expiration = new Date(`${fecha}T23:59:59`);

        if (isNaN(expiration.getTime())) {
            return block("Error interno en fecha de licencia");
        }

        if (new Date() > expiration) {
            return block("Tu licencia ha expirado");
        }

        /* ✅ ACCESO PERMITIDO */
        accesoOK = true;

        if (overlay) overlay.remove();

        activarProteccionBasica();
        activarControlInactividad();

    });

});

/* 🔒 BLOQUEO FINAL */
function block(msg) {

    if (overlay) overlay.remove();

    document.body.innerHTML = `
        <div style="margin-top:100px;text-align:center;font-family:Arial">
            <h2>⛔ Acceso restringido</h2>
            <p>${msg}</p>
            <button onclick="location.href='index.html'">Volver</button>
        </div>
    `;

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

/* 🛡️ PROTECCIÓN BÁSICA */
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

/* ⏱️ INACTIVIDAD */
function activarControlInactividad() {

    let t;

    const reset = () => {
        clearTimeout(t);
        t = setTimeout(() => {
            alert("Sesión cerrada por inactividad");
            location.href = "index.html";
        }, 60 * 60 * 1000);
    };

    ["click","mousemove","keydown","scroll","touchstart"]
        .forEach(e => document.addEventListener(e, reset));

    reset();
}
