import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===== Firebase =====

const firebaseConfig = {
    apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
    authDomain: "ucmi-13796634.firebaseapp.com",
    projectId: "ucmi-13796634",
    storageBucket: "ucmi-13796634.firebasestorage.app",
    messagingSenderId: "1090719609536",
    appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325",
    measurementId: "G-3M3DH25722"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== CSS =====

const estilo = document.createElement("style");
estilo.textContent = `
#alertaCorreosGlobal {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #c0392b;
    color: white;
    padding: 15px;
    border-radius: 12px;
    z-index: 999999;
    box-shadow: 0 0 15px rgba(0,0,0,.4);
    display: none;
    max-width: 350px;
    animation: parpadeo 1s infinite;
}

#alertaCorreosGlobal button {
    margin-top: 10px;
    width: 100%;
    border: none;
    padding: 8px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
}

@keyframes parpadeo {
    0% { opacity:1; }
    50% { opacity:.6; }
    100% { opacity:1; }
}
`;

document.head.appendChild(estilo);

// ===== HTML =====

const alerta = document.createElement("div");

alerta.id = "alertaCorreosGlobal";

alerta.innerHTML = `
    <div>
        ⚠️ Existen correos pendientes de eliminación.
    </div>

    <button id="btnIrEliminarCorreo">
        Ir a gestionar correos
    </button>
`;

document.body.appendChild(alerta);

// ===== Botón =====

document
    .getElementById("btnIrEliminarCorreo")
    .addEventListener("click", () => {

        window.location.href = "correos-desechados.html";
    });

// ===== Sonido =====

let intervaloSonido = null;

// ===== Listener tiempo real =====

onSnapshot(
    collection(db, "correosPendientesEliminar"),
    (snapshot) => {

        if (!snapshot.empty) {

            alerta.style.display = "block";

            if (!intervaloSonido) {

                intervaloSonido = setInterval(() => {

                    const audio = new Audio(
                        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
                    );

                    audio.play().catch(() => {});

                }, 5000);
            }

        } else {

            alerta.style.display = "none";

            if (intervaloSonido) {

                clearInterval(intervaloSonido);

                intervaloSonido = null;
            }
        }
    }
);
