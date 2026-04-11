// 1. Ocultamos el contenido para que nadie vea nada sin permiso
document.documentElement.style.visibility = "hidden";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// 🔐 GUARDIA CON PAUSA (Para evitar falsos negativos al cambiar de página)
setTimeout(() => {
    const llave = sessionStorage.getItem("auth_ok");
    if (llave !== "1") {
        console.log("Acceso denegado: No se encontró la llave de sesión.");
        window.location.replace("index.html");
    }
}, 500); // Esperamos medio segundo para que la sesión se asiente

// 🔁 VALIDACIÓN DE FIREBASE
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si después de 2 segundos Firebase dice que no hay nadie, cerramos
        setTimeout(() => {
            if (!auth.currentUser) cerrar();
        }, 2000);
        return;
    }

    // Verificación de Licencia en Firestore
    const ref = doc(db, "licenses", user.email);
    onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
            cerrar("No tienes licencia activa.");
            return;
        }

        const data = snap.data();
        const exp = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Licencia expirada.");
            return;
        }

        mostrar(); // Todo bien, adelante
    });
});

function cerrar(msg) {
    if (msg) alert(msg);
    sessionStorage.clear();
    signOut(auth).finally(() => {
        window.location.replace("index.html");
    });
}

function mostrar() {
    if (ok) return;
    ok = true;
    document.documentElement.style.visibility = "visible";
    resetTimer();
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(e => {
        document.addEventListener(e, resetTimer);
    });
}

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => cerrar("Sesión cerrada por inactividad"), 10 * 60 * 1000);
}
