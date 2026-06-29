import { auth, db, CONFIG } from "../firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


// ==========================================
// CARGAR LOGO DE LA ACADEMIA
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = CONFIG.URL_INDEX;
        return;
    }

    try {

        const snap = await getDoc(
            doc(db, "usuarios", user.uid)
        );

        if (!snap.exists()) return;

        const datos = snap.data();

        const logo = document.getElementById("logoAcademia");

        if (logo) {

            logo.src =
                datos.logoCustom ||
                "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

            logo.style.opacity = "1";

        }

    } catch (e) {

        console.error("Error cargando logo:", e);

    }

});


// ==========================================
// CERRAR SESIÓN
// ==========================================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", async (e) => {

        e.preventDefault();

        await signOut(auth);

        window.location.href = CONFIG.URL_INDEX;

    });

}
