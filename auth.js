// auth.js - Núcleo de Autenticación e Inteligencia de Roles UCMI
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2eMtX0I2u1iKdtHjNisMrqVSlpJbzHNI",
  authDomain: "ucmi-13796634.firebaseapp.com",
  projectId: "ucmi-13796634",
  storageBucket: "ucmi-13796634.firebasestorage.app",
  messagingSenderId: "1090719609536",
  appId: "1:1090719609536:web:8d7f269d991d8dc3c6b325",
  measurementId: "G-3M3DH25722"
};

// Inicializar Firebase y Servicios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Lógica de acceso con Redirección por Roles
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-submit');

    // Estado de carga
    btn.innerText = "Determinando perfil...";
    btn.disabled = true;

    try {
        // 1. Validar correo y contraseña
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Consultar el rol en la colección "usuarios" usando el UID único
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const rol = userData.rol; // Ejemplo: "Academia", "Profesor Socio", etc.

            console.log(`Acceso concedido como: ${rol}`);

            // 3. Sistema de Redirección Automática
            switch(rol) {
                case 'Admin':
                    // Para ti, Juan Carlos, el control maestro
                    window.location.href = "admin.html";
                    break;
                case 'Academia':
                    window.location.href = "panel-academia.html";
                    break;
                case 'Profesor Embajador':
                case 'Profesor Socio':
                    window.location.href = "panel-profesores.html";
                    break;
                case 'Alumno Autodidacta':
                    window.location.href = "aula-virtual.html";
                    break;
                default:
                    // Si no tiene rol, se queda en el index
                    window.location.href = "index.html";
            }
        } else {
            // Caso donde el usuario existe en Auth pero no tiene documento en la DB
            console.error("No se encontró el documento de perfil en Firestore.");
            alert("Acceso correcto, pero no tiene un perfil asignado. Contacte a la Dirección UCMI.");
            btn.innerText = "Entrar a UCMI";
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error de Auth:", error.code);
        let mensaje = "Error de acceso: Verifique sus credenciales.";
        
        if (error.code === 'auth/user-not-found') mensaje = "El usuario no está registrado.";
        if (error.code === 'auth/wrong-password') mensaje = "Contraseña incorrecta.";
        
        alert(mensaje);
        
        // Resetear botón
        btn.innerText = "Entrar a UCMI";
        btn.disabled = false;
    }
});
