export function iniciarPanelEstudiante(){

    const contenido =
    document.getElementById("contenido");


    async function cargarPagina(archivo){

        const respuesta =
        await fetch(archivo);

const html =
await respuesta.text();

console.log("Página cargada:", archivo);

contenido.innerHTML = html;

    }


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

        e.preventDefault();

        cargarPagina(
            "mis-asignaturas-academia.html"
        );

    });


}
