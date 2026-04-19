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
// BLOQUE 4: VALIDACIÓN DE IDENTIDAD Y LICENCIA (UNIFICADO)
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

        // --- Lógica de Validación Unificada ---
        const data = snap.data();
        const role = data.role || "student"; // Capturamos si es 'teacher' o 'student'
        const exp = new Date((data.expiration || "") + "T23:59:59");

        // Validación de fecha: si expiró o la fecha es inválida
        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Tu licencia ha expirado. Contacta al administrador.");
            return;
        }

        // ✅ TODO CORRECTO: Pasamos el rol a la función mostrar
        mostrar(role);

    } catch (error) {
        console.error("Error en la guardia de seguridad:", error);
        // Mantenemos la página oculta si hay un error crítico de carga
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
// BLOQUE 6: FUNCIÓN DE ACCESO CONCEDIDO (ACTUALIZADO)
// ==========================================
function mostrar() {
    if (ok) return;
    ok = true;

    // 1. Inyectamos los estilos finales (Contenedor, Menú y Enlaces)
    const style = document.createElement("style");
    style.innerHTML = `
        body { background-color: #f0f2f5 !important; margin: 0 !important; padding: 0 !important; display: block !important; }
        .main-container {
            max-width: 1000px; margin: 40px auto !important; background: #E0FFFF !important;
            padding: 50px !important; border-radius: 25px !important; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; min-height: 80vh; box-sizing: border-box;
        }
        .sidebar-trigger { position: fixed; left: 0; top: 0; width: 20px; height: 100vh; z-index: 9998; }
        .side-menu {
            position: fixed; left: -260px; top: 0; width: 240px; height: 100vh;
            background: #7FFFD4 !important; color: #000080; transition: 0.4s ease;
            z-index: 9999; display: flex; flex-direction: column; align-items: center;
            padding-top: 60px; box-shadow: 5px 0 15px rgba(0,0,0,0.2);
        }
        .sidebar-trigger:hover + .side-menu, .side-menu:hover { left: 0; }
        
        /* Estilos para los enlaces clicables */
        .menu-link {
            color: #000080; text-decoration: none; font-weight: 500;
            margin: 15px 0; font-size: 1.1rem; transition: 0.3s;
            cursor: pointer;
        }
        .menu-link:hover { text-decoration: underline; color: #0000FF; }

        .logout-side-btn {
            background: #0000FF !important; color: white !important; border: none; padding: 15px;
            border-radius: 12px; cursor: pointer; font-weight: bold; width: 80%; margin-top: 30px;
        }
    `;
    document.head.appendChild(style);

    // 2. Metemos el contenido en el contenedor aguamarina
    const container = document.createElement("div");
    container.className = "main-container";
    const children = Array.from(document.body.childNodes);
    children.forEach(child => {
        if (child.tagName !== "SCRIPT") container.appendChild(child);
    });
    document.body.appendChild(container);

    // 3. Creamos el Menú Lateral con HOME y TEMARIO
    const trigger = document.createElement("div");
    trigger.className = "sidebar-trigger";
    const menu = document.createElement("div");
    menu.className = "side-menu";
    menu.id = "side-menu-ucmi";
    
    // Aquí inyectamos los links como texto y luego el botón
    menu.innerHTML = `
        <div style="font-weight:bold; color:#000080; margin-bottom:30px; font-size: 1.2rem; border-bottom: 2px solid #000080; width: 80%; text-align: center; padding-bottom: 10px;">UCMI - MENÚ</div>
        
        <a href="home.html" class="menu-link">🏠 Home</a>
        <a href="temario.html" class="menu-link">📋 Temario</a>
        <a href="dashboard.html" class="menu-link">🎓 Mis Notas</a>
        
        <button class="logout-side-btn" id="btn-logout-lateral">🚪 Cerrar Sesión</button>
    `;
    document.body.appendChild(trigger);
    document.body.appendChild(menu);

    document.getElementById("btn-logout-lateral").onclick = () => {
        if (typeof logout === "function") logout(); else cerrar("Sesión finalizada");
    };

    // 4. REVALIDACIÓN CÍCLICA (Revisa la fecha cada 30 seg)
    setInterval(async () => {
        try {
            const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
            const reSnap = await getDoc(doc(db, "users", auth.currentUser.email));
            if (reSnap.exists()) {
                const reData = reSnap.data();
                const reExp = new Date((reData.expiration || "") + "T23:59:59");
                if (isNaN(reExp.getTime()) || new Date() > reExp) {
                    cerrar("Tu licencia ha expirado. Sesión finalizada.");
                }
            }
        } catch (e) { console.log("Error de red en validación"); }
    }, 30000);

    // Revelar página
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
    timer = setTimeout(() => cerrar("Sesión cerrada por inactividad"), 30 * 60 * 1000);
}
