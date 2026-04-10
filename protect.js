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

// 🔥 CONTROL PARA EVITAR MÚLTIPLES INTERVALOS
let intervalActivo = null;

// 🔐 PROTECCIÓN GLOBAL
onAuthStateChanged(auth, async (user) => {

    try {

        if (!user) {
            window.location.href = "index.html";
            return;
        }

        const email = user.email;

        const ref = doc(db, "licenses", email);
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

        // ✅ PERMITIR ACCESO
        document.body.style.display = "block";

        // 🔄 VERIFICACIÓN CADA 30 SEGUNDOS (GLOBAL)
        if (!intervalActivo) {
            intervalActivo = setInterval(async () => {

                try {

                    const currentUser = auth.currentUser;

                    if (!currentUser) {
                        location.reload();
                        return;
                    }

                    const ref = doc(db, "licenses", currentUser.email);
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

                } catch (e) {
                    console.error("Error en verificación continua", e);
                }

            }, 30000);
        }

    } catch (e) {
        console.error(e);
        block("Error de verificación");
    }

});

// 🔒 BLOQUEO VISUAL
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

    // 🔥 DETENER LOOP SI EXISTE
    if (intervalActivo) {
        clearInterval(intervalActivo);
        intervalActivo = null;
    }
}
