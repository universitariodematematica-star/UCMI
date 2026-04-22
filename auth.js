// auth.js - El "cerebro" de la autenticación de UCMI
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración real de tu proyecto UCMI
const firebaseConfig = {
  apiKey: "AIzaSyCbZU7aTOgpkxFIH_s2dOiMiBANEWKPXA4",
  authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
  projectId: "portal-autenticacion-a1ngles",
  storageBucket: "portal-autenticacion-a1ngles.firebasestorage.app",
  messagingSenderId: "1039504020190",
  appId: "1:1039504020190:web:212cf030c3e6feb175a84f",
  measurementId: "G-FHXCQSWG5H"
};

// Inicializar la conexión con el backend
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar cuando el usuario pulsa el botón "Entrar"
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Obtener los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-submit');

    // 2. Feedback visual
    btn.innerText = "Verificando en UCMI...";
    btn.disabled = true;

    try {
        // 3. Intentar el inicio de sesión en Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 4. Si los datos son correctos
        alert("Acceso concedido. ¡Bienvenido!");
        console.log("Éxito:", userCredential.user.email);
        
        // Aquí puedes redirigir a la siguiente página de tu tesis
        // window.location.href = "supralogica_dashboard.html";

    } catch (error) {
        // 5. Si hay error (usuario no existe, clave mal, etc.)
        console.error("Error capturado:", error.code);
        alert("Error de acceso: Verifique su usuario y contraseña.");
        
        // Restaurar el botón
        btn.innerText = "Entrar a UCMI";
        btn.disabled = false;
    }
});
