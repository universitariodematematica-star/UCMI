document.documentElement.style.visibility = "hidden";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
    apiKey: "AIza...",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
});

const auth = getAuth(app);
const db = getFirestore(app);

let unsubscribe = null;
let ok = false;

// 🔐 1. GUARDIA SIMPLE (evita acceso directo sin login)
if (sessionStorage.getItem("auth_ok") !== "1") {
    window.location.replace("index.html");
}

// ⏱️ 2. INACTIVIDAD
let timer;

function reset() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        cerrar("Inactividad");
    }, 10 * 60 * 1000);
}

function cerrar(msg) {
    sessionStorage.removeItem("auth_ok");

    alert(msg);

    signOut(auth).finally(() => {
        window.location.replace("index.html");
    });
}

// 🔁 3. VALIDACIÓN FIREBASE
onAuthStateChanged(auth, (user) => {

    if (!user) {
        cerrar("Sin sesión");
        return;
    }

    const ref = doc(db, "licenses", user.email);

    unsubscribe = onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            cerrar("Sin licencia");
            return;
        }

        const data = snap.data();
        const exp = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(exp) || new Date() > exp) {
            cerrar("Licencia inválida");
            return;
        }

        // ✔️ TODO OK
        mostrar();
    });
});

function mostrar() {
    if (ok) return;
    ok = true;

    document.documentElement.style.visibility = "visible";

    ["click","mousemove","keydown","scroll","touchstart"]
        .forEach(e => document.addEventListener(e, reset));

    reset();
}
