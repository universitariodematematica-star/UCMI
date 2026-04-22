// auth.js - El "cerebro" de la autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración de tu proyecto UCMI (obtenida de tu consola)
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUÍ", // Debes copiarla de la sección "General" en Firebase
    authDomain: "portal-autenticacion-a1ngles.firebaseapp.com",
    projectId: "portal-autenticacion-a1ngles",
    storageBucket: "portal-autenticacion-a1ngles.appspot.com",
    messagingSenderId: "931215286596",
    appId: "1:931215286596:web:681878d6b67e265275815a"
};

// Inicializar la conexión con el backend
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar cuando el usuario pulsa el botón "Entrar"
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Obtener los valores del frontend
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-submit');

    // 2. Feedback visual: deshabilitar botón mientras verifica
    btn.innerText = "Verificando en UCMI...";
    btn.disabled = true;

    try {
        // 3. Enviar datos al backend de Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 4. Si los datos son correctos:
        alert("Acceso concedido. ¡Bienvenido!");
        console.log("Éxito:", userCredential.user.email);
        
        // Aquí redirigiremos al panel de Supralógica más adelante
        // window.location.href = "dashboard.html";

    } catch (error) {
        // 5. Si hay error (contraseña mal, usuario inexistente, etc.)
        console.error("Error capturado:", error.code);
        alert("Error de acceso: Verifique su usuario y contraseña.");
        
        // Restaurar el botón para reintentar
        btn.innerText = "Entrar a UCMI";
        btn.disabled = false;
    }
});
