import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 PROTECCIÓN GLOBAL
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {

        const ref = doc(db, "licenses", user.email);
        const snap = await getDoc(ref);

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

        // ✅ acceso permitido

    } catch (e) {
        block("Error de verificación");
    }

});

// 🔒 BLOQUEO VISUAL
function block(msg) {

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
}
