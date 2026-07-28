export function iniciarPanelEstudiante(){

    const contenido =
    document.getElementById("contenido");


    async function cargarPagina(archivo){

        const respuesta =
        await fetch(archivo);

        const html =
        await respuesta.text();

        contenido.innerHTML = html;

    }


    document
    .getElementById("btnAsignaturas")
    .addEventListener("click",(e)=>{

        e.preventDefault();

        cargarPagina(
            "mis-asignaturas-academia.html"
        );

    });


}
