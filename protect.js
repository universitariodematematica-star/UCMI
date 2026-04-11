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

const KEY = "auth_ok";

/* 🔒 BLOQUEO INMEDIATO VISUAL */
document.documentElement.style.visibility = "hidden";

/* 🚨 ROUTE GUARD REAL (ESTO ES LO IMPORTANTE) */
const isInternalPage =
    location.pathname.endsWith(".html") &&
    !location.pathname.endsWith("index.html");

if (isInternalPage && !sessionStorage.getItem(KEY)) {
    location.replace("index.html");
}

/* 🔐 FIREBASE */
onAuthStateChanged(auth, (user) => {

    if (!user) {
        sessionStorage.removeItem(KEY);
        location.replace("index.html");
        return;
    }

    const ref = doc(db, "licenses", user.email);

    onSnapshot(ref, (snap) => {

        if (!snap.exists()) return kick();

        const data = snap.data();
        const exp = new Date((data.expiration || "").trim() + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) return kick();

        /* ✅ OK */
        sessionStorage.setItem(KEY, "1");
        document.documentElement.style.visibility = "visible";
    });

});

/* ⛔ BLOQUEO */
function kick() {
    sessionStorage.removeItem(KEY);
    location.replace("index.html");
}
