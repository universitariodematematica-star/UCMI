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
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Pequeño margen para recargas de página
        setTimeout(() => {
            if (!auth.currentUser) cerrar();
        }, 2000);
        return;
    }

    // ✅ CORRECCIÓN CLAVE: Cambiado de "licenses" a "users"
    const ref = doc(db, "users", user.email);
    
    onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
            cerrar("No se encontró tu registro de usuario.");
            return;
        }

        const data = snap.data();
        // Ajustamos la hora para que expire al final del día indicado
        const exp = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Tu licencia ha expirado. Contacta al administrador.");
            return;
        }

        mostrar(); // Todo correcto, revelamos la página
    });
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
