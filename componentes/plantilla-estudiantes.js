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
// CARGAR LOGO DEL ESTUDIANTE / ACADEMIA
// ==========================================

onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.href =
        CONFIG.URL_INDEX;

        return;

    }



    try{


        const usuarioRef =
        doc(
            db,
            "usuarios",
            user.uid
        );



        const usuarioSnap =
        await getDoc(usuarioRef);



        if(!usuarioSnap.exists()){

            return;

        }



       const datos =
usuarioSnap.data();

const logo =
document.getElementById(
    "logoEstudiante"
);

if(logo){

    if(datos.academiaUID){

        const academiaSnap =
        await getDoc(
            doc(
                db,
                "usuarios",
                datos.academiaUID
            )
        );

        if(
            academiaSnap.exists() &&
            academiaSnap.data().logoCustom
        ){

            logo.src =
            academiaSnap.data().logoCustom;

        }else{

            logo.src =
            "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

        }

    }else{

        logo.src =
        "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";

    }

    logo.style.opacity="1";

}


    }
    catch(error){

        console.error(
            "Error cargando estudiante:",
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
