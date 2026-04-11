import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===================== FIREBASE ===================== */

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===================== ESTADO ===================== */

let unsubscribe = null;
let accesoConcedido = false;

/* ===================== INACTIVIDAD ===================== */

let timeoutInactividad;

function resetInactividad() {
    clearTimeout(timeoutInactividad);

    timeoutInactividad = setTimeout(() => {
        cerrarSesion("Sesión cerrada por inactividad");
    }, 60 * 60 * 1000); // 1 hora
}

function activarInactividad() {
    ["click", "mousemove", "keydown", "scroll", "touchstart"]
        .forEach(evt => document.addEventListener(evt, resetInactividad));

    resetInactividad();
}

/* ===================== CIERRE ===================== */

function cerrarSesion(mensaje) {

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    alert(mensaje);

    signOut(auth).finally(() => {
        window.location.href = "index.html";
    });
}

/* ===================== CONTROL GLOBAL ===================== */

onAuthStateChanged(auth, (user) => {

    try {

        if (!user) {
            window.location.replace("index.html");
            return;
        }

        const ref = doc(db, "licenses", user.email);

        unsubscribe = onSnapshot(ref, (snap) => {

            if (!snap.exists()) {
                cerrarSesion("No tienes licencia activa");
                return;
            }

            const data = snap.data();

            const fecha = (data.expiration || "").trim();
            const expiration = new Date(fecha + "T23:59:59");

            if (isNaN(expiration.getTime())) {
                cerrarSesion("Error en licencia");
                return;
            }

            if (new Date() > expiration) {
                cerrarSesion("Tu licencia ha expirado");
                return;
            }

            /* ===================== ACCESO OK ===================== */

            if (!accesoConcedido) {
                accesoConcedido = true;

                document.documentElement.style.visibility = "visible";

                activarInactividad();
            }

        });

    } catch (e) {
        console.error(e);
        cerrarSesion("Error de verificación");
    }

});
