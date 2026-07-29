import { auth, db, CONFIG } from "../firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


// ==========================================
// INICIAR PLANTILLA ESTUDIANTE
// ==========================================

export function iniciarPlantillaEstudiante(){

    // ==========================================
    // CARGAR LOGO DE LA ACADEMIA
    // ==========================================

    onAuthStateChanged(auth, async(user)=>{

        if(!user){

            window.location.href =
            CONFIG.URL_INDEX;

            return;

        }

        try{

            // Usuario estudiante
            const usuarioSnap =
            await getDoc(
                doc(
                    db,
                    "usuarios",
                    user.uid
                )
            );

            if(!usuarioSnap.exists()) return;

            const datos =
            usuarioSnap.data();

            const logo =
            document.getElementById(
                "logoEstudiante"
            );

            const nombreAcademiaSidebar =
document.getElementById(
    "nombreAcademiaSidebar"
);

            if(!logo) return;

            // Buscar la academia del estudiante
            if(datos.academiaUID){

                const academiaSnap =
                await getDoc(
                    doc(
                        db,
                        "usuarios",
                        datos.academiaUID
                    )
                );

if(academiaSnap.exists()){


    const datosAcademia =
    academiaSnap.data();



    // LOGO DE LA ACADEMIA

    if(datosAcademia.logoCustom){

        logo.src =
        datosAcademia.logoCustom;

    }else{

        logo.src =
        "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

    }



    // NOMBRE DE LA ACADEMIA

    if(nombreAcademiaSidebar){

        nombreAcademiaSidebar.textContent =
        datosAcademia.nombre
        ||
        datosAcademia.entidad
        ||
        "Academia";

    }


}
else{

    logo.src =
    "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";


    if(nombreAcademiaSidebar){

        nombreAcademiaSidebar.textContent =
        "Academia";

    }

}

            }else{

                logo.src =
                "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

            }

            logo.style.opacity = "1";

        }
        catch(error){

            console.error(
                "Error cargando logo:",
                error
            );

        }

    });


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const btnLogout =
    document.getElementById(
        "btnLogout"
    );

    if(btnLogout){

        btnLogout.addEventListener(
            "click",
            async(e)=>{

                e.preventDefault();

                await signOut(auth);

                window.location.href =
                CONFIG.URL_INDEX;

            }
        );

    }

}
