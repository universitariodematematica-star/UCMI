document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================
    // CAPA GLOBAL DE VIDRIO AHUMADO
    // ==========================================================
    if (!document.querySelector(".ucmi-overlay")) {

        const overlay = document.createElement("div");
        overlay.className = "ucmi-overlay";

        document.body.prepend(overlay);

    }

    // ==========================================================
    // ESTILOS GLOBALES (se agregan una sola vez)
    // ==========================================================
    if (!document.getElementById("ucmi-sidebar-style")) {

        const style = document.createElement("style");
        style.id = "ucmi-sidebar-style";

        style.textContent = `
            .ucmi-overlay{
                position:fixed;
                inset:0;
                z-index:0;
                pointer-events:none;

                background:
                    radial-gradient(
                        circle,
                        rgba(6,9,15,.45) 0%,
                        rgba(6,9,15,.82) 100%
                    );
            }

            .wrapper,
            .app-wrapper,
            .main-content{
                position:relative;
                z-index:1;
            }
        `;

        document.head.appendChild(style);

    }

    // ==========================================================
    // CARGAR SIDEBAR
    // ==========================================================
    fetch("componentes/sidebar-ucmi.html")
        .then(respuesta => respuesta.text())
        .then(html => {

            const contenedor = document.getElementById("sidebar-ucmi");

            if (!contenedor) {
                console.warn("No existe el contenedor #sidebar-ucmi");
                return;
            }

            contenedor.innerHTML = html;

            // ==========================================================
// MENÚ CONSTRUCTORES
// ==========================================================

const btnConstructores = document.getElementById("btnConstructores");
const submenuConstructores = document.getElementById("submenuConstructores");

if (btnConstructores && submenuConstructores) {

    btnConstructores.addEventListener("click", (e) => {

        e.preventDefault();

        submenuConstructores.style.display =
            submenuConstructores.style.display === "none"
            ? "block"
            : "none";

    });

}


// ==========================================================
// SUBMENÚ IDIOMAS
// ==========================================================

const btnIdiomas = document.getElementById("btnIdiomas");
const submenuIdiomas = document.getElementById("submenuIdiomas");


if (btnIdiomas && submenuIdiomas) {

    btnIdiomas.addEventListener("click", (e) => {

        e.preventDefault();

        submenuIdiomas.style.display =
            submenuIdiomas.style.display === "none"
            ? "block"
            : "none";

    });

}

            // ==========================================================
// CERRAR SESIÓN GLOBAL
// ==========================================================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", async (e) => {

        e.preventDefault();

        try {

            const { getAuth, signOut } = await import(
                "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
            );

            const auth = getAuth();

            await signOut(auth);

            window.location.href = "index.html";

        } catch (error) {

            console.error("Error al cerrar sesión:", error);

        }

    });

}
            
            // Activar automáticamente la página actual
            const paginaActual = window.location.pathname.split("/").pop();

            document.querySelectorAll(".nav-item-ucmi").forEach(enlace => {

                if (enlace.dataset.pagina === paginaActual) {
                    enlace.classList.add("active");
                }

            });

        })
        .catch(error => {
            console.error("Error cargando sidebar UCMI:", error);
        });

});
