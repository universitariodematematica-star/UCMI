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
// BLOQUE 6: FUNCIÓN DE ACCESO CONCEDIDO (REDiseño TOTAL)
// ==========================================
function mostrar() {
    if (ok) return;
    ok = true;

    // 1. Inyectamos los estilos primero con máxima prioridad
    const style = document.createElement("style");
    style.innerHTML = `
        body { 
            background-color: #f0f2f5 !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            display: block !important;
            font-family: Arial, sans-serif;
        }

        /* La caja que centrará tu contenido */
        .main-container {
            max-width: 1000px; 
            margin: 40px auto !important; 
            background: #E0FFFF !important; /* Aguamarina claro */
            padding: 50px !important; 
            border-radius: 25px !important; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
            min-height: 80vh;
            box-sizing: border-box;
        }

        /* Estilos del Menú Lateral */
        .sidebar-trigger { position: fixed; left: 0; top: 0; width: 20px; height: 100vh; z-index: 9998; }
        .side-menu {
            position: fixed; left: -260px; top: 0; width: 240px; height: 100vh;
            background: #7FFFD4 !important; color: #000080; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9999; display: flex; flex-direction: column; align-items: center;
            padding-top: 60px; box-shadow: 5px 0 15px rgba(0,0,0,0.2);
        }
        .sidebar-trigger:hover + .side-menu, .side-menu:hover { left: 0; }

        .logout-side-btn {
            background: #0000FF !important; color: white !important; border: none; 
            padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; 
            width: 80%; margin-top: 30px; transition: 0.3s;
        }
        .logout-side-btn:hover { background: #000080 !important; transform: scale(1.05); }
    `;
    document.head.appendChild(style);

    // 2. CREACIÓN DEL CONTENEDOR Y REUBICACIÓN DE ELEMENTOS
    // Esto evita que el contenido se vea "horrible" y lo centra
    const container = document.createElement("div");
    container.className = "main-container";
    
    // Movemos todo el contenido del body al contenedor, EXCEPTO los scripts
    const children = Array.from(document.body.childNodes);
    children.forEach(child => {
        if (child.tagName !== "SCRIPT" && child.nodeName !== "#text" || child.textContent.trim() !== "") {
            container.appendChild(child);
        }
    });
    document.body.appendChild(container);

    // 3. INYECCIÓN DEL MENÚ
    const trigger = document.createElement("div");
    trigger.className = "sidebar-trigger";
    const menu = document.createElement("div");
    menu.id = "side-menu-ucmi";
    menu.className = "side-menu";
    menu.innerHTML = `
        <div style="font-weight:bold; color:#000080; margin-bottom:10px; font-size:18px;">UCMI</div>
        <div style="color:#000080; margin-bottom:30px; font-size:12px;">MENÚ DE NAVEGACIÓN</div>
        <button class="logout-side-btn" id="btn-logout-lateral">🚪 Cerrar Sesión</button>
    `;
    document.body.appendChild(trigger);
    document.body.appendChild(menu);

    // Botón de cierre
    document.getElementById("btn-logout-lateral").onclick = () => {
        if (typeof logout === "function") logout(); else cerrar("Sesión finalizada");
    };

    // 4. FINALIZACIÓN: HACER VISIBLE
    document.documentElement.style.visibility = "visible";
    
    resetTimer();
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(e => {
        document.addEventListener(e, resetTimer);
    });
}

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => cerrar("Sesión cerrada por inactividad"), 60 * 60 * 1000);
}
