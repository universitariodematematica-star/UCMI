import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AUTH_KEY = "auth_ok";

/* 🔒 BLOQUEO VISUAL INMEDIATO (evita flash de contenido) */
document.documentElement.style.visibility = "hidden";

/* 🧠 GATE TIPO COOKIES (INSTANTÁNEO) */
const isInternalPage = location.pathname.includes(".html") &&
                       !location.pathname.endsWith("index.html");

if (isInternalPage && !sessionStorage.getItem(AUTH_KEY)) {
    location.replace("index.html");
}

/* 🔐 FIREBASE AUTH */
onAuthStateChanged(auth, (user) => {

    if (!user) {
        sessionStorage.removeItem(AUTH_KEY);
        location.replace("index.html");
        return;
    }

    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            return deny("No tienes licencia activa");
        }

        const data = snap.data();
        const fecha = (data.expiration || "").trim();
        const expiration = new Date(fecha + "T23:59:59");

        if (isNaN(expiration.getTime())) {
            return deny("Error en fecha de licencia");
        }

        if (new Date() > expiration) {
            return deny("Licencia expirada");
        }

        /* ✅ ACCESO PERMITIDO */
        sessionStorage.setItem(AUTH_KEY, "1");
        document.documentElement.style.visibility = "visible";
    });

});

/* ⛔ BLOQUEO CENTRAL */
function deny(msg) {
    sessionStorage.removeItem(AUTH_KEY);

    document.documentElement.innerHTML = `
        <div style="
            margin-top:100px;
            text-align:center;
            font-family:Arial;
        ">
            <h2>⛔ Acceso restringido</h2>
            <p>${msg}</p>
            <button onclick="location.href='index.html'">Volver</button>
        </div>
    `;

    document.documentElement.style.visibility = "visible";
}
