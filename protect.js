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

// 🔐 CONTROL GLOBAL
onAuthStateChanged(auth, (user) => {

    try {

        if (!user) {
            window.location.href = "index.html";
            return;
        }

        const ref = doc(db, "licenses", user.email);

        // 🔥 ESCUCHA EN TIEMPO REAL
        unsubscribe = onSnapshot(ref, (snap) => {

            if (!snap.exists()) {
                block("No tienes licencia activa");
                return;
            }

            const data = snap.data();
            const expiration = new Date(data.expiration + "T23:59:59");

            if (new Date() > expiration) {
                block("Tu licencia ha expirado");
                return;
            }

            // ✅ ACCESO PERMITIDO
            if (!accesoConcedido) {
                accesoConcedido = true;
                document.body.style.display = "block";
                activarProteccionBasica();
            }

        });

    } catch (e) {
        console.error(e);
        block("Error de verificación");
    }

});

// 🔒 BLOQUEO FINAL
function block(msg) {

    document.body.style.display = "block";

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

// 🛡️ PROTECCIÓN BÁSICA (ANTI-INSPECCIÓN + INACTIVIDAD)
function activarProteccionBasica() {

    // 🚫 CLIC DERECHO
    document.addEventListener("contextmenu", e => e.preventDefault());

    // 🚫 TECLAS DEVTOOLS
    document.addEventListener("keydown", e => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
            (e.ctrlKey && e.key === "U")
        ) {
            e.preventDefault();
        }
    });

    // 🔍 DETECCIÓN DE INSPECCIÓN
    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 160) {
            document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>⛔ Acceso bloqueado</h2>";
        }
    }, 1000);

    // 🔇 DESACTIVAR LOGS
    console.log = function () {};

    // ⏳ CONTROL DE INACTIVIDAD (NUEVO)
    let tiempoInactividad;
    const LIMITE = 1 * 60 * 1000; // 5 minutos

    function reiniciarTimer() {
        clearTimeout(tiempoInactividad);
        tiempoInactividad = setTimeout(() => {
            block("Sesión cerrada por inactividad");
        }, LIMITE);
    }

    // 📡 EVENTOS DE ACTIVIDAD
    ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evento => {
        document.addEventListener(evento, reiniciarTimer);
    });

    // 🚀 INICIAR
    reiniciarTimer();
}
