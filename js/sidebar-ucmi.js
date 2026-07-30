document.addEventListener("DOMContentLoaded", () => {

    fetch("componentes/sidebar-ucmi.html")
        .then(respuesta => respuesta.text())
        .then(html => {

            document.getElementById("sidebar-ucmi").innerHTML = html;

        })
        .catch(error => {
            console.error("Error cargando sidebar UCMI:", error);
        });

});

const paginaActual = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-item-ucmi").forEach(enlace => {

    if(enlace.dataset.pagina === paginaActual){
        enlace.classList.add("active");
    }

});
