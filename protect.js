document.body.style.visibility = "hidden";

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

let unlocked = false;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            block();
            return;
        }

        const data = snap.data();

        const expiration = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(expiration) || new Date() > expiration) {
            block();
            return;
        }

        unlock();

    });

});

function unlock() {
    if (unlocked) return;
    unlocked = true;
    document.body.style.visibility = "visible";
}

function block() {
    document.body.style.visibility = "visible";
    document.body.innerHTML = `
        <div style="text-align:center;margin-top:80px;font-family:Arial">
            <h2>Acceso denegado</h2>
            <button onclick="location.href='index.html'">Volver</button>
        </div>
    `;
}
