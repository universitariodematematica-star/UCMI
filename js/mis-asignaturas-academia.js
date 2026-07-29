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

    console.log(
    "Usuario autenticado:",
    user.uid
);


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

        console.log("UID autenticado:", user.uid);
console.log("Cantidad de registros en aula_integrantes:", integrantesSnap.size);

integrantesSnap.forEach(doc=>{
    console.log("Documento aula_integrantes:", doc.id, doc.data());
});


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

console.log("✔ Aula leída:", aula);
            
// ==========================================
// BUSCAR ASIGNATURAS DEL CURSO DEL AULA
// ==========================================

let asignaturas = [];


if(aula.cursoId){

        console.log("Intentando leer curso_asignaturas con:");
    console.log("cursoId:", aula.cursoId);
    console.log("entidad:", aula.entidad);



    const asignaturasSnap =
    await getDocs(
        query(
            collection(db,"curso_asignaturas"),
            where(
                "cursoId",
                "==",
                aula.cursoId
            ),
            where(
                "entidad",
                "==",
                aula.entidad
            )
        )
    );

    console.log(
    "✔ Asignaturas encontradas:",
    asignaturasSnap.size
);

    asignaturasSnap.forEach(doc => {

        asignaturas.push(
            doc.data().asignatura
        );

    });


}

if(asignaturas.length === 0){

    console.log(
        "El aula no tiene asignaturas:",
        aulaId
    );

    continue;

}            



// ==========================================
// CREAR UNA TARJETA POR CADA ASIGNATURA
// ==========================================


for(const asignatura of asignaturas){

    let profesor = "Pendiente";


// ==========================================
// BUSCAR PROFESOR DE ESTA ASIGNATURA
// ==========================================

const qProfesor =
query(
    collection(db,"aula_docente_asignacion"),
    where(
        "aulaId",
        "==",
        aulaId
    ),
    where(
        "asignatura",
        "==",
        asignatura
    )
);


const profesorSnap =
await getDocs(qProfesor);


console.log(
    "Asignaciones docentes encontradas para:",
    asignatura,
    profesorSnap.size
);


if(!profesorSnap.empty){


    const asignacion =
    profesorSnap.docs[0].data();


    console.log(
        "Asignación docente:",
        asignacion
    );


    profesor =
    asignacion.nombreResponsable
    ||
    "Pendiente";


}


    contenedor.innerHTML += `

    <div class="col-md-6 col-lg-3 mb-4">


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

        } // cierre del for(const integrante of integrantesSnap.docs)


    }
    catch(error){

        console.error(
            "Error cargando asignaturas:",
            error
        );

    }


} // cierre de cargarAsignaturas            



// Esperar Firebase Auth

onAuthStateChanged(
    auth,
    (user)=>{

        if(user){

            cargarAsignaturas();

        }

    }
);
