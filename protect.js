import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
});

const auth = getAuth(app);
const db = getFirestore(app);

/* 🔒 OVERLAY FIJO */
const overlay = document.createElement("div");
overlay.style.cssText = `
position:fixed;
inset:0;
background:white;
display:flex;
align-items:center;
justify-content:center;
font-family:Arial;
z-index:999999;
`;
overlay.innerText = "Verificando acceso...";
document.body.appendChild(overlay);

/* 🔐 AUTH */
onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            return block("Sin licencia");
        }

        const data = snap.data();
        const fecha = (data.expiration || "").trim();
        const exp = new Date(fecha + "T23:59:59");

        if (isNaN(exp)) return block("Fecha inválida");
        if (new Date() > exp) return block("Licencia expirada");

        overlay.remove(); // ✅ desbloquea

    });
});

/* ⛔ BLOQUEO */
function block(msg) {
    document.body.innerHTML = `
        <div style="text-align:center;font-family:Arial;margin-top:100px">
            <h2>Acceso restringido</h2>
            <p>${msg}</p>
            <button onclick="location.href='index.html'">Volver</button>
        </div>
    `;
}
