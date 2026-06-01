```javascript
// ======================================================
// UCMI LAYOUT
// ======================================================

import {
    cargarBranding,
    cerrarSesion
} from "./firebase-config.js";

// ======================================================
// CREACIÓN DEL LAYOUT PRINCIPAL
// ======================================================

export async function crearLayout({
    paginaActiva = "",
    titulo = "UCMI",
    icono = "bi-grid-3x3-gap",
    mostrarPanelSuper = true
} = {}) {

    document.body.innerHTML = `
    
    <div class="super-overlay">

        <div class="container-fluid">

            <div class="row">

                <!-- SIDEBAR -->

                <aside class="col-md-3 col-lg-2 sidebar d-none d-md-flex">

                    <div class="logo-container">

                        <img
                            id="logoAcademia"
                            src=""
                            class="logo-sidebar"
                            alt="Logo">

                        <div
                            id="nombreEntidad"
                            class="sistema-label">

                            Cargando...

                        </div>

                    </div>

                    <nav class="nav-custom">

                        <a
                            href="academia-solicitudes.html"
                            class="nav-link-custom"
                            data-page="solicitudes">

                            <i class="bi bi-person-video2"></i>
                            Solicitudes

                        </a>

                        <a
                            href="academia-vigencia.html"
                            class="nav-link-custom"
                            data-page="vigencia">

                            <i class="bi bi-shield-check"></i>
                            Vigencia

                        </a>

                        <a
                            href="academia-usuarios.html"
                            class="nav-link-custom"
                            data-page="usuarios">

                            <i class="bi bi-people"></i>
                            Usuarios

                        </a>

                        <a
                            href="academia-modulos.html"
                            class="nav-link-custom"
                            data-page="modulos">

                            <i class="bi bi-grid-3x3-gap"></i>
                            Módulos

                        </a>

                        <a
                            href="academia-papelera.html"
                            class="nav-link-custom"
                            data-page="papelera">

                            <i class="bi bi-trash3"></i>
                            Papelera

                        </a>

                    </nav>

                    <div class="divider"></div>

                    <div class="action-group">

                        ${
                            mostrarPanelSuper
                            ? `
                            <a
                                href="superadmin.html"
                                class="btn-master">

                                <i class="bi bi-shield-lock me-2"></i>
                                Panel Super

                            </a>
                            `
                            : ""
                        }

                        <button
                            id="btnLogout"
                            class="btn-master btn-exit">

                            <i class="bi bi-box-arrow-right me-2"></i>
                            Salir

                        </button>

                    </div>

                </aside>

                <!-- CONTENIDO -->

                <main
                    class="col-md-9 col-lg-10 main-content">

                    <header
                        class="header-main">

                        <h1
                            class="title-repo">

                            <i
                                class="bi ${icono} title-icon">
                            </i>

                            <span id="section-title">

                                ${titulo}

                            </span>

                        </h1>

                    </header>

                    <div
                        id="contenido-pagina">

                    </div>

                    <footer
                        class="footer-system">

                        <p class="mb-1">

                            UCMI — Desarrollo Humano &
                            Excelencia Académica

                        </p>

                        <p
                            class="small text-uppercase">

                            Plataforma Maestra © 2026

                        </p>

                    </footer>

                </main>

            </div>

        </div>

    </div>
    `;

    activarPaginaActual(paginaActiva);

    document
        .getElementById("btnLogout")
        ?.addEventListener(
            "click",
            cerrarSesion
        );

    await cargarBranding();
}

// ======================================================
// ACTIVAR MENÚ ACTUAL
// ======================================================

export function activarPaginaActual(nombrePagina) {

    document
        .querySelectorAll(".nav-link-custom")
        .forEach(link => {

            link.classList.remove("active");

            if (
                link.dataset.page === nombrePagina
            ) {
                link.classList.add("active");
            }
        });
}

// ======================================================
// OBTENER CONTENEDOR PRINCIPAL
// ======================================================

export function obtenerContenedor() {

    return document.getElementById(
        "contenido-pagina"
    );
}

// ======================================================
// CAMBIAR TÍTULO DINÁMICAMENTE
// ======================================================

export function actualizarTitulo(
    nuevoTitulo
) {

    const titulo =
        document.getElementById(
            "section-title"
        );

    if (titulo) {
        titulo.textContent =
            nuevoTitulo;
    }
}

// ======================================================
// MOSTRAR MENSAJE SIMPLE
// ======================================================

export function mostrarMensaje(
    html
) {

    const contenedor =
        obtenerContenedor();

    if (!contenedor) return;

    contenedor.innerHTML = html;
}
```
