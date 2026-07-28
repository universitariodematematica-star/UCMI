import { auth, db } from "../firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


async function cargarAsignaturas(){

    const contenedor =
    document.getElementById("listaAsignaturas");


    if(!contenedor) return;


    const user =
    auth.currentUser;


    if(!user){

        console.error("No hay usuario autenticado");

        return;

    }


    try{


        // ==========================================
        // BUSCAR AULAS DEL ESTUDIANTE
        // ==========================================


        const qIntegrantes =
        query(
            collection(db,"aula_integrantes"),
            where(
                "usuarioId",
                "==",
                user.uid
            )
        );


        const integrantesSnap =
        await getDocs(qIntegrantes);



        contenedor.innerHTML = "";



        if(integrantesSnap.empty){

            contenedor.innerHTML = `
            <div class="text-white-50">
                No tienes asignaturas asignadas.
            </div>
            `;

            return;

        }



        for(const integrante of integrantesSnap.docs){



            const datosIntegrante =
            integrante.data();


            const aulaId =
            datosIntegrante.aulaId;



            // ==========================================
            // BUSCAR AULA
            // ==========================================


            const aulaSnap =
            await getDoc(
                doc(
                    db,
                    "aulas",
                    aulaId
                )
            );


            if(!aulaSnap.exists()) continue;


            const aula =
            aulaSnap.data();



            // ==========================================
            // BUSCAR DOCENTE Y ASIGNATURA
            // ==========================================


            const qAsignacion =
            query(
                collection(
                    db,
                    "aula_docente_asignacion"
                ),
                where(
                    "aulaId",
                    "==",
                    aulaId
                )
            );


            const asignacionSnap =
            await getDocs(qAsignacion);



            let profesor =
            "Pendiente";


            let asignatura =
            "Sin asignatura";



            if(!asignacionSnap.empty){


                const asignacion =
                asignacionSnap.docs[0].data();


                profesor =
                asignacion.nombreResponsable ||
                "Pendiente";


                asignatura =
                asignacion.asignatura ||
                "Sin asignatura";


            }



            // ==========================================
            // CREAR TARJETA
            // ==========================================


            contenedor.innerHTML += `

            <div class="col-md-6 col-lg-4 mb-4">


                <div class="tarjeta-asignatura">


                    <div class="nombre-asignatura">
                        📚 ${asignatura}
                    </div>


                    <hr>


                    <div class="dato">
                        <b>Academia:</b><br>
                        ${aula.entidad || "Sin academia"}
                    </div>


                    <div class="dato">
                        <b>Profesor:</b><br>
                        ${profesor}
                    </div>


                    <div class="dato">
                        <b>Aula:</b><br>
                        ${aula.nombre_aula || "Sin aula"}
                    </div>


                    <div class="dato">

                        <b>Estado:</b>

                        <span class="badge bg-success">
                            Activa
                        </span>

                    </div>


                    <button 
                    class="btn btn-ucmi w-100 mt-3">

                        CONTENIDO

                    </button>


                </div>


            </div>

            `;


        }


    }
    catch(error){

        console.error(
            "Error cargando asignaturas:",
            error
        );

    }


}



// Esperar Firebase Auth

onAuthStateChanged(
    auth,
    (user)=>{

        if(user){

            cargarAsignaturas();

        }

    }
);
