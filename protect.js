// ==========================================
// BLOQUE 1: CONTROL DE PRIVACIDAD INICIAL
// ==========================================
// Este bloque oculta el HTML apenas carga el script.
// Funciona cambiando la visibilidad del documento a "hidden" para evitar que el usuario 
// vea el contenido de la página antes de que el sistema verifique si tiene permiso.
document.documentElement.style.visibility = "hidden";

// ==========================================
// BLOQUE 2: IMPORTACIÓN DE MÓDULOS Y CONFIGURACIÓN
// ==========================================
// Carga las herramientas necesarias de Firebase (Auth y Firestore).
// Funciona conectando el script con los servidores de Google mediante tu apiKey 
// y configurando las constantes 'auth' para usuarios y 'db' para la base de datos.
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles"
};

let app;

try {
    app = getApp();
} catch (e) {
    app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
const db = getFirestore(app);

let ok = false;
let timer;

// ==========================================
// BLOQUE 3: GUARDIA PERIMETRAL (SESSION STORAGE)
// ==========================================
// Verifica la existencia de la "llave" local en el navegador.
// Funciona revisando el sessionStorage tras 500ms. Si no encuentra 'auth_ok' con valor '1',
// asume que el usuario entró saltándose el login y lo expulsa inmediatamente al Index.
// Validación inmediata sin timeout
const llave = sessionStorage.getItem("auth_ok");
if (llave !== "1") {
    console.log("Acceso denegado: No hay sesión válida.");
    window.location.replace("index.html");
}

// ==========================================
// BLOQUE 4: VALIDACIÓN DE IDENTIDAD Y LICENCIA
// ==========================================
// Monitor de estado de usuario y base de datos en tiempo real.
// Funciona en dos pasos: primero confirma que haya un usuario firmado en Firebase. 
// Segundo, consulta en Firestore si su correo tiene una licencia activa y vigente.
onAuthStateChanged(auth, (user) => {
    if (!user) {
        setTimeout(() => {
            if (!auth.currentUser) cerrar();
        }, 2000);
        return;
    }

    const ref = doc(db, "licenses", user.email);
    onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
            cerrar("No tienes licencia activa.");
            return;
        }

        const data = snap.data();
        const exp = new Date((data.expiration || "") + "T23:59:59");

        if (isNaN(exp.getTime()) || new Date() > exp) {
            cerrar("Licencia expirada.");
            return;
        }

        mostrar(); // Si pasa todas las pruebas, activa la visibilidad
    });
});

// ==========================================
// BLOQUE 5: FUNCIÓN DE CIERRE DE SESIÓN (CERRAR)
// ==========================================
// Limpia el rastro del usuario y lo redirige fuera.
// Funciona borrando el sessionStorage para invalidar la "llave" y ejecutando 
// signOut de Firebase. Al terminar, envía al usuario al Index.
function cerrar(msg) {
    if (msg) alert(msg);
    sessionStorage.clear();
    signOut(auth).finally(() => {
        window.location.replace("index.html");
    });
}

// ==========================================
// BLOQUE 6: FUNCIÓN DE ACCESO CONCEDIDO (MOSTRAR)
// ==========================================
// Revela el contenido y activa el cronómetro de seguridad.
// Funciona devolviendo la visibilidad al documento y activando detectores de movimiento
// (clics, teclado, scroll) para saber si el usuario sigue frente a la pantalla.
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
// Controla el tiempo de espera antes de cerrar la sesión automáticamente.
// Funciona reiniciando un contador cada vez que se detecta actividad. Si el usuario
// no hace nada durante 1 minuto (según el código actual), llama a la función cerrar().
function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => cerrar("Sesión cerrada por inactividad"), 60 * 60 * 1000);
}
