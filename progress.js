// ==========================================
// PROGRESS.JS — MANEJO DE PROGRESO Y CERTIFICADOS
// ==========================================

// 🔹 IMPORTS FIREBASE
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔹 CONFIGURACIÓN (misma que protect.js)
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
// 🔥 GUARDAR PROGRESO
// ==========================================
export async function guardarProgreso(unit, topic, skill, score = 10) {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.warn("⚠ Usuario no autenticado");
      return;
    }

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

  } catch (error) {
    console.error("❌ Error al guardar progreso:", error);
  }
}

// ==========================================
// 🔍 VERIFICAR CERTIFICADO
// ==========================================
export async function verificarCertificado(unit, topic) {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.warn("⚠ Usuario no autenticado");
      return false;
    }

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
// 🏆 GUARDAR CERTIFICADO (OPCIONAL)
// ==========================================
export async function guardarCertificado(unit, topic) {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.warn("⚠ Usuario no autenticado");
      return;
    }

    const id = `${unit}_${topic}`;

    await setDoc(doc(db, "users", user.uid, "certificates", id), {
      obtained: true,
      unit,
      topic,
      date: new Date()
    });

    console.log(`🏆 Certificado guardado: ${id}`);

  } catch (error) {
    console.error("❌ Error guardando certificado:", error);
  }
}

// ==========================================
// 🚀 FUNCIÓN COMPLETA (TODO EN UNO)
// ==========================================
export async function procesarResultado(unit, topic, skill, score = 10) {
  // 1. Guardar progreso
  await guardarProgreso(unit, topic, skill, score);

  // 2. Verificar certificado
  const aprobado = await verificarCertificado(unit, topic);

  // 3. Si aprobó todo → guardar certificado
  if (aprobado) {
    await guardarCertificado(unit, topic);
  }

  return aprobado;
}
