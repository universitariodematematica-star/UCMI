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
// SIDEBAR ESTUDIANTE UCMI
// ==========================================


export function iniciarSidebarEstudiante(){



// ==========================================
// VERIFICAR USUARIO Y CARGAR LOGO
// ==========================================


onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.href = CONFIG.URL_INDEX;

        return;

    }



    try{


        const snap = await getDoc(
            doc(
                db,
                "usuarios",
                user.uid
            )
        );



        if(!snap.exists()){

            return;

        }



        const datos = snap.data();



        const logo =
        document.getElementById(
            "logoEstudiante"
        );



        if(logo){


            logo.src =
            datos.logoCustom ||
            "https://universitariodematematica-star.github.io/UCMI/logo-ucmi.png";


            logo.style.opacity="1";


        }



    }catch(error){


        console.error(
            "Error cargando datos estudiante:",
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
