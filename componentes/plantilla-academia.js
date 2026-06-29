import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ================= FIREBASE =================

const firebaseConfig = {
    apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
    authDomain: "ucmi-13796634.firebaseapp.com",
    projectId: "ucmi-13796634",
    storageBucket: "ucmi-13796634.firebasestorage.app",
    messagingSenderId: "1090719609536",
    appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// ================= LOGO =================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {

        const snap = await getDoc(
            doc(db, "usuarios", user.uid)
        );

        if (snap.exists()) {

            const datos = snap.data();

            const logo = document.getElementById("logoAcademia");

            if (logo) {

                logo.src =
                    datos.logoCustom ||
                    "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

                logo.style.opacity = "1";
            }
        }

    } catch (e) {
        console.error(e);
    }

});

// ================= LOGOUT =================

document.addEventListener("click", (e) => {

    if (e.target.closest("#btnLogout")) {

        e.preventDefault();

        signOut(auth)
            .then(() => {
                window.location.href = "index.html";
            });

    }

});
