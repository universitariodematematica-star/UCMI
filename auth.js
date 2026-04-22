// auth.js - Núcleo de Autenticación UCMI
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: PEGA AQUÍ EL BLOQUE firebaseConfig QUE COPIASTE DE LA CONSOLA
const firebaseConfig = {
  apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
  authDomain: "ucmi-13796634.firebaseapp.com",
  projectId: "ucmi-13796634",
  storageBucket: "ucmi-13796634.firebasestorage.app",
  messagingSenderId: "1090719609536",
  appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325",
  measurementId: "G-3M3DH25722"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Lógica de acceso
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-submit');

    // Estado de carga
    btn.innerText = "Verificando en UCMI...";
    btn.disabled = true;

    try {
        // Intento de entrada al sistema
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Acceso exitoso:", userCredential.user.email);
        alert("¡Bienvenido al sistema UCMI!");
        
        // Aquí redirigiremos al Dashboard de la Supralógica
        // window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Error de Auth:", error.code);
        alert("Error de acceso: Verifique su usuario y contraseña.");
        
        // Resetear botón
        btn.innerText = "Entrar a UCMI";
        btn.disabled = false;
    }
});
