import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDocFromServer,
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

// 🔐 CONTROL GLOBAL
onAuthStateChanged(auth, async (user) => {

    try {

        if (!user) {
            window.location.href = "index.html";
            return;
        }

        const email = user.email;
        const ref = doc(db, "licenses", email);

        // 🔥 ESCUCHA EN TIEMPO REAL (CLAVE)
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
            document.body.style.display = "block";
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

    // 🔥 DETENER LISTENER
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}
