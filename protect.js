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

const isIndex = location.pathname.endsWith("index.html") || location.pathname === "/";

/* 🔒 SI NO ES INDEX, BLOQUEAR VISUALMENTE INMEDIATO */
if (!isIndex) {
    document.documentElement.style.display = "none";
}

/* 🔐 CONTROL */
onAuthStateChanged(auth, (user) => {

    if (!user) {
        forceRedirect();
        return;
    }

    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
            forceRedirect();
            return;
        }

        const data = snap.data();
        const exp = new Date((data.expiration || "").trim() + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) {
            forceRedirect();
            return;
        }

        /* ✅ PERMITIDO */
        document.documentElement.style.display = "block";
    });
});

/* ⛔ REDIRECCIÓN FORZADA */
function forceRedirect() {
    sessionStorage.clear();
    location.replace("index.html");
}
