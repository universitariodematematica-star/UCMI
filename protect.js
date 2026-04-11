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

// ⏱️ CONTROL DE INACTIVIDAD (1 hora)
let timeoutInactividad;

function resetInactividad() {
    clearTimeout(timeoutInactividad);

    timeoutInactividad = setTimeout(() => {
        alert("Sesión cerrada por inactividad");
        window.location.href = "index.html";
    }, 60 * 60 * 1000);
}

// 🔐 BLOQUEO INICIAL (NO rompe render)
document.body.style.visibility = "hidden";

// 🧠 TIMEOUT DE SEGURIDAD (evita pantalla en blanco)
const fallback = setTimeout(() => {
    document.body.style.visibility = "visible";
}, 6000);

// 🔐 CONTROL GLOBAL
onAuthStateChanged(auth, (user) => {

    try {

        if (!user) {
            clearTimeout(fallback);
            window.location.href = "index.html";
            return;
        }

        const ref = doc(db, "licenses", user.email);

        unsubscribe = onSnapshot(ref, (snap) => {

            try {

                if (!snap.exists()) {
                    return block("No tienes licencia activa");
                }

                const data = snap.data();

                // 🛠️ VALIDACIÓN DE FECHA
                const fecha = (data.expiration || "").trim();
                const expiration = new Date(`${fecha}T23:59:59`);

                if (isNaN(expiration.getTime())) {
                    console.error("Fecha inválida:", fecha);
                    return block("Error interno en fecha de licencia");
                }

                if (new Date() > expiration) {
                    return block("Tu licencia ha expirado");
                }

                // ✅ ACCESO PERMITIDO
                clearTimeout(fallback);
                document.body.style.visibility = "visible";

                if (!accesoConcedido) {
                    accesoConcedido = true;
                    activarProteccionBasica();
                    activarControlInactividad();
                }

            } catch (err) {
                console.error(err);
                block("Error de verificación");
            }

        });

    } catch (e) {
        console.error(e);
        block("Error de sistema");
    }

});

// 🔒 BLOQUEO FINAL
function block(msg) {

    clearTimeout(fallback);
    document.body.style.visibility = "visible";

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

    console.log = function () {};
}

// ⏱️ INACTIVIDAD
function activarControlInactividad() {

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(evt => {
        document.addEventListener(evt, resetInactividad);
    });

    resetInactividad();
}
