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
