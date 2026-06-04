import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ======================
// CONFIG
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
  authDomain: "ucmi-13796634.firebaseapp.com",
  projectId: "ucmi-13796634",
  storageBucket: "ucmi-13796634.firebasestorage.app",
  messagingSenderId: "1090719609536",
  appId: "1:1090719609531:web:8d7f269d991d8dc3c6b325"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================
// IDENTIDAD MAESTRA
// ======================
const MASTER_ID = "x0oBFbDP09d7I3VZvWuN6BOODf32";

// ======================
// CONFIG INACTIVIDAD
// ======================
const TIEMPO_INACTIVIDAD = 30 * 60 * 1000;
let timer;

// ======================
// MAPA DE RUTAS
// ======================
const RUTAS = {
  "academia": "admin-academia.html",
  "docente academia": "panel-docente-academia.html",
  "estudiante academia": "aula-academia.html",
  "profesor independiente": "panel-profesor-independiente.html",
  "estudiante profesor independiente": "aula-profesor-independiente.html",
  "estudiante ucmi": "aula-ucmi.html"
};

// ======================
// BLOQUEO INICIAL
// ======================
document.documentElement.style.display = "none";

// ======================
// AUTH LISTENER
// ======================
onAuthStateChanged(auth, async (user) => {
  if (!user) return bloquear();

  // MASTER bypass total
  if (user.uid === MASTER_ID) {
    document.documentElement.style.display = "block";
    iniciarInactividad();
    return;
  }

  const email = user.email.toLowerCase().trim();
  const snap = await getDoc(doc(db, "usuarios", email));

  if (!snap.exists()) return bloquear();

  const data = snap.data();

  // ======================
  // BLOQUEO POR ESTADO
  // ======================
  if (data.estado !== "activo") return bloquear();

  // ======================
  // VALIDACIÓN DE PERFIL
  // ======================
  const perfil = (data.perfil || "").toLowerCase().trim();
  const rutaActual = window.location.pathname.split("/").pop();
  const rutaPermitida = RUTAS[perfil];

  if (!rutaPermitida) {
    console.warn("Perfil sin ruta asignada:", perfil);
    return bloquear();
  }

  if (rutaPermitida !== rutaActual) {
    console.warn("Acceso a ruta no permitida");
    await signOut(auth);
    return bloquear();
  }

  // TODO OK
  document.documentElement.style.display = "block";
  iniciarInactividad();
});

// ======================
// INACTIVIDAD
// ======================
function iniciarInactividad() {
  const eventos = ["mousemove", "keydown", "scroll", "touchstart"];

  eventos.forEach(ev =>
    document.addEventListener(ev, resetTimer)
  );

  resetTimer();
}

function resetTimer() {
  clearTimeout(timer);

  timer = setTimeout(async () => {
    await signOut(auth);
    bloquear();
  }, TIEMPO_INACTIVIDAD);
}

// ======================
// AUDITORÍA (OPCIONAL)
// ======================
async function logIntento(user, motivo) {
  try {
    await setDoc(doc(db, "logs_seguridad", `log_${Date.now()}`), {
      uid: user.uid,
      email: user.email,
      motivo,
      ruta: window.location.pathname,
      fecha: serverTimestamp()
    });
  } catch (e) {
    console.error("Error log seguridad", e);
  }
}

// ======================
// BLOQUEO TOTAL
// ======================
function bloquear() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace("index.html");
}
