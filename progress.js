// ==========================================
// PROGRESS.JS — MANEJO DE PROGRESO Y CERTIFICADOS
// ==========================================

// 🔹 IMPORTS FIREBASE
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔹 CONFIGURACIÓN
const firebaseConfig = {
  apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
  authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
  projectId: "portal-autenticacion-a1ngles"
};

// 🔹 EVITAR DOBLE INICIALIZACIÓN
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔹 SERVICIOS
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================
// 🔥 OBTENER USUARIO (SOLUCIÓN CLAVE)
// ==========================================
async function getUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// ==========================================
// 🔥 GUARDAR PROGRESO
// ==========================================
export async function guardarProgreso(unit, topic, skill, score = 10) {

  const user = await getUser();

  if (!user) {
    console.warn("⚠ Usuario no autenticado");
    return false;
  }

  try {
    const id = `${unit}_${topic}_${skill}`;

    await setDoc(doc(db, "users", user.uid, "progress", id), {
      score,
      completed: true,
      unit,
      topic,
      skill,
      timestamp: new Date()
    });

    console.log(`✅ Progreso guardado: ${id}`);
    return true;

  } catch (error) {
    console.error("❌ Error al guardar progreso:", error);
    return false;
  }
}

// ==========================================
// 🔍 VERIFICAR CERTIFICADO
// ==========================================
export async function verificarCertificado(unit, topic) {

  const user = await getUser();

  if (!user) {
    console.warn("⚠ Usuario no autenticado");
    return false;
  }

  try {
    const skills = ["grammar", "listening", "reading", "writing"];
    let completadas = 0;

    for (let skill of skills) {
      const ref = doc(db, "users", user.uid, "progress", `${unit}_${topic}_${skill}`);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().completed) {
        completadas++;
      }
    }

    return completadas === skills.length;

  } catch (error) {
    console.error("❌ Error verificando certificado:", error);
    return false;
  }
}

// ==========================================
// 🏆 GUARDAR CERTIFICADO
// ==========================================
export async function guardarCertificado(unit, topic) {

  const user = await getUser();

  if (!user) {
    console.warn("⚠ Usuario no autenticado");
    return false;
  }

  try {
    const id = `${unit}_${topic}`;

    await setDoc(doc(db, "users", user.uid, "certificates", id), {
      obtained: true,
      unit,
      topic,
      date: new Date()
    });

    console.log(`🏆 Certificado guardado: ${id}`);
    return true;

  } catch (error) {
    console.error("❌ Error guardando certificado:", error);
    return false;
  }
}

// ==========================================
// 🚀 FUNCIÓN PRINCIPAL
// ==========================================
export async function procesarResultado(unit, topic, skill, score = 10) {

  // 1. Guardar progreso
  const guardado = await guardarProgreso(unit, topic, skill, score);
  if (!guardado) return false;

  // 2. Verificar certificado
  const aprobado = await verificarCertificado(unit, topic);

  // 3. Si completó todo → guardar certificado
  if (aprobado) {
    await guardarCertificado(unit, topic);
  }

  return true;
}
