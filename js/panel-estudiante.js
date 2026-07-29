export function iniciarPanelEstudiante() {

    const contenido = document.getElementById("contenido");

async function cargarPagina(archivo) {

    try {

        const respuesta = await fetch(archivo);

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar ${archivo}`);
        }

        const html = await respuesta.text();

        console.log("Página cargada:", archivo);

        contenido.innerHTML = html;


        // ===============================
        // INICIALIZAR JS DE CADA PÁGINA
        // ===============================

        if(archivo === "mis-asignaturas-academia.html"){

            const modulo =
            await import("./mis-asignaturas-academia.js");

            if(modulo.cargarAsignaturas){

                modulo.cargarAsignaturas();

            }

        }

    } catch (error) {

        console.error("Error cargando página:", error);

        contenido.innerHTML = `
            <div style="color:white;padding:30px;">
                <h3>Error al cargar la página</h3>
                <p>${error.message}</p>
            </div>
        `;

    }

}

    // ===============================
    // BOTÓN MIS ASIGNATURAS
    // ===============================

    const btnAsignaturas = document.getElementById("btnAsignaturas");

    if (btnAsignaturas) {

        btnAsignaturas.addEventListener("click", (e) => {

            e.preventDefault();

            cargarPagina("mis-asignaturas-academia.html");

        });

    }

}
