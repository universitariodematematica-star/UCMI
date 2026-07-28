import { auth } from "../firebase-config.js";


// ==========================================
// INICIAR PANEL ESTUDIANTE
// ==========================================

export function iniciarPanelEstudiante(){


    const contenido =
    document.getElementById("contenido");



    async function cargarPagina(archivo){


        try{

            const respuesta =
            await fetch(archivo);


            const html =
            await respuesta.text();


            contenido.innerHTML = html;


        }
        catch(error){

            console.error(
                "Error cargando página:",
                error
            );

        }

    }



    // ==========================================
    // MIS ASIGNATURAS
    // ==========================================

    const btnAsignaturas =
    document.getElementById("btnAsignaturas");


    if(btnAsignaturas){


        btnAsignaturas.addEventListener(
            "click",
            (e)=>{


                e.preventDefault();


                cargarPagina(
                    "mis-asignaturas-academia.html"
                );


            }
        );


    }



}
