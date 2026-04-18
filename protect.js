// ==========================================
// BLOQUE 1: CONTROL DE PRIVACIDAD INICIAL
// ==========================================
document.documentElement.style.visibility = "hidden";

// ==========================================
// BLOQUE 2: IMPORTACIÓN DE MÓDULOS Y CONFIGURACIÓN
// ==========================================
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

let app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let ok = false;
let timer;

// ==========================================
// BLOQUE 3: GUARDIA PERIMETRAL (SESSION STORAGE)
// ==========================================
const llave = sessionStorage.getItem("auth_ok");
if (llave !== "1") {
    window.location.replace("index.html");
}

// ==========================================
// BLOQUE 4: VALIDACIÓN DE IDENTIDAD Y LICENCIA (CORREGIDO)
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Margen de 2 segundos por si es un refresco de página
        setTimeout(() => {
            if (!auth.currentUser) cerrar();
        }, 2000);
        return;
    }

    try {
        // Importamos getDoc para asegurar una lectura única y limpia
        const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
        const ref = doc(db, "users", user.email);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            cerrar("No se encontró tu registro de usuario.");
            return;
        }

        const data = snap.data();
        const exp = new Date((data.expiration || "") + "T23:59:59");

        // Validación de fecha: si expiró o la fecha es inválida
        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Tu licencia ha expirado. Contacta al administrador.");
            return;
        }

        // ✅ Si llegamos aquí, todo está perfecto: revelamos la página
        mostrar(); 

    } catch (error) {
        console.error("Error en la guardia de seguridad:", error);
        // Nota: No ejecutamos cerrar() aquí para evitar expulsiones por errores temporales de internet
    }
});

// ==========================================
// BLOQUE 5: FUNCIÓN DE CIERRE DE SESIÓN
// ==========================================
function cerrar(msg) {
    if (msg) alert(msg);
    sessionStorage.clear();
    signOut(auth).finally(() => {
        window.location.replace("index.html");
    });
}

// ==========================================
// BLOQUE 6: FUNCIÓN DE ACCESO CONCEDIDO
// ==========================================
function mostrar() {
    if (ok) return;
    ok = true;
    document.documentElement.style.visibility = "visible";
    resetTimer();
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(e => {
        document.addEventListener(e, resetTimer);
    });
}

// ==========================================
// BLOQUE 7: TEMPORIZADOR DE INACTIVIDAD
// ==========================================
function resetTimer() {
    clearTimeout(timer);
    // Configurado para 1 hora (60 min * 60 seg * 1000 ms)
    timer = setTimeout(() => cerrar("Sesión cerrada por inactividad"), 60 * 60 * 1000);
}

// ==========================================
// ESTILOS DEL MENÚ LATERAL DESPLEGABLE
// ==========================================
const estilosMenu = document.createElement("style");
estilosMenu.innerHTML = `
    .sidebar-trigger {
        position: fixed;
        left: 0;
        top: 0;
        width: 15px; /* Zona sensible al tacto del ratón */
        height: 100vh;
        background: transparent;
        z-index: 9998;
    }

    .side-menu {
        position: fixed;
        left: -250px; /* Escondido por defecto */
        top: 0;
        width: 200px;
        height: 100vh;
        background: #000080; /* Azul UCMI */
        color: white;
        transition: 0.3s ease;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
        box-shadow: 4px 0 10px rgba(0,0,0,0.3);
    }

    .sidebar-trigger:hover + .side-menu, .side-menu:hover {
        left: 0; /* Se desliza hacia afuera */
    }

    .logout-side-btn {
        background: #f44336;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 20px;
        width: 80%;
    }

    .logout-side-btn:hover {
        background: #d32f2f;
    }

    .menu-title {
        font-size: 14px;
        margin-bottom: 20px;
        font-weight: bold;
        text-transform: uppercase;
    }
`;
document.head.appendChild(estilosMenu);

// ==========================================
// INYECCIÓN DEL MENÚ LATERAL
// ==========================================
function inyectarMenuLateral() {
    // Evitar duplicados
    if (document.getElementById("side-menu-ucmi")) return;

    // Crear zona de activación
    const trigger = document.createElement("div");
    trigger.className = "sidebar-trigger";
    
    // Crear el menú
    const menu = document.createElement("div");
    menu.id = "side-menu-ucmi";
    menu.className = "side-menu";
    menu.innerHTML = `
        <div class="menu-title">UCMI - SESIÓN</div>
        <button class="logout-side-btn" id="btn-logout-lateral">
            🚪 Cerrar Sesión
        </button>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(menu);

    // Asignar evento al botón
    document.getElementById("btn-logout-lateral").addEventListener("click", () => {
        if (typeof logout === "function") {
            logout(); // Llama a la función logout que ya tienes en tus páginas
        } else {
            // Si la página no tiene la función logout definida, usamos la de cerrar del protector
            cerrar("Cerrando sesión...");
        }
    });
}

// Modificamos la función mostrar() que ya tienes en protect.js para que inyecte el menú
const mostrarOriginal = mostrar;
mostrar = function() {
    mostrarOriginal();
    inyectarMenuLateral();
};
