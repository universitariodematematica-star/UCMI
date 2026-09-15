const MENU_RETIRO_ID = "menuContextualRetiroAlumno";

let alumnoSeleccionadoRetiro = null;

/*

============================================================
CREAR MENÚ CONTEXTUAL
============================================================
*/

function crearMenuContextualRetiro() {

let menu =
    document.getElementById(
        MENU_RETIRO_ID
    );

if (menu) {
    return menu;
}

menu =
    document.createElement(
        "div"
    );

menu.id =
    MENU_RETIRO_ID;

menu.style.position =
    "fixed";

menu.style.display =
    "none";

menu.style.zIndex =
    "99999";

menu.style.backgroundColor =
    "white";

menu.style.border =
    "1px solid #d8d8d8";

menu.style.borderRadius =
    "8px";

menu.style.boxShadow =
    "0 4px 14px rgba(0,0,0,0.18)";

menu.style.minWidth =
    "220px";

menu.style.overflow =
    "hidden";


const opcion =
    document.createElement(
        "div"
    );

opcion.id =
    "opcionRetiroAlumno";

opcion.style.padding =
    "12px 16px";

opcion.style.cursor =
    "pointer";

opcion.style.fontSize =
    "14px";

opcion.style.fontWeight =
    "600";

opcion.style.color =
    "#333";

opcion.addEventListener(
    "mouseenter",
    function() {

        opcion.style.backgroundColor =
            "#f3eef3";

    }
);

opcion.addEventListener(
    "mouseleave",
    function() {

        opcion.style.backgroundColor =
            "white";

    }
);


opcion.addEventListener(
"click",
async function() {

    if (
        !alumnoSeleccionadoRetiro
    ) {
        return;
    }

    const alumno =
        alumnoSeleccionadoRetiro;

    const fila =
        alumno.__filaRetiro;

    const faseActual =
        alumno.faseRetiro === true;

    const nuevoEstado =
        !faseActual;

    ocultarMenuContextualRetiro();

    const mensaje =
        nuevoEstado
            ? "¿Deseas iniciar la fase de retiro de este estudiante?"
            : "¿Deseas cancelar la fase de retiro de este estudiante?";

    const confirmar =
        window.confirm(
            mensaje
        );

    if (!confirmar) {
        return;
    }

    await cambiarFaseRetiroAlumno(
        alumno.studentId,
        nuevoEstado,
        fila
    );

}

);


menu.appendChild(
    opcion
);

document.body.appendChild(
    menu
);

return menu;

}

/*

============================================================
ACTUALIZAR TEXTO DEL MENÚ
============================================================
*/

function actualizarMenuContextualRetiro(
faseRetiro
) {

const menu =
    crearMenuContextualRetiro();

const opcion =
    document.getElementById(
        "opcionRetiroAlumno"
    );

if (!opcion) {
    return;
}

opcion.textContent =
    faseRetiro === true
        ? "Cancelar fase de retiro"
        : "Iniciar fase de retiro";

}

/*

============================================================
MOSTRAR MENÚ
============================================================
*/

function mostrarMenuContextualRetiro(
x,
y,
alumno
) {

alumnoSeleccionadoRetiro =
    alumno;

actualizarMenuContextualRetiro(
    alumno.faseRetiro === true
);

const menu =
    crearMenuContextualRetiro();

menu.style.display =
    "block";

const ancho =
    menu.offsetWidth;

const alto =
    menu.offsetHeight;

let posicionX =
    x;

let posicionY =
    y;

if (
    posicionX + ancho >
    window.innerWidth
) {
    posicionX =
        window.innerWidth -
        ancho -
        10;
}

if (
    posicionY + alto >
    window.innerHeight
) {
    posicionY =
        window.innerHeight -
        alto -
        10;
}

menu.style.left =
    Math.max(
        10,
        posicionX
    ) + "px";

menu.style.top =
    Math.max(
        10,
        posicionY
    ) + "px";

}

/*

============================================================
OCULTAR MENÚ
============================================================
*/

function ocultarMenuContextualRetiro() {

const menu =
    document.getElementById(
        MENU_RETIRO_ID
    );

if (menu) {
    menu.style.display =
        "none";
}

alumnoSeleccionadoRetiro =
    null;

}

/*

============================================================
OBTENER ALUMNO DESDE LA FILA
============================================================
*/

function obtenerAlumnoDesdeFilaRetiro(
fila
) {

if (!fila) {
    return null;
}

const celdas =
    fila.querySelectorAll(
        "td"
    );

if (
    celdas.length < 2
) {
    return null;
}

const nombre =
    String(
        celdas[0].textContent ||
        ""
    ).trim();

const grupo =
    String(
        celdas[1].textContent ||
        ""
    ).trim();

if (
    !nombre ||
    !grupo
) {
    return null;
}

const registros =
    window.registrosAsistencia ||
    [];

const coincidencias =
    registros.filter(
        alumno => {

            const nombreAlumno =
                (
                    String(
                        alumno.apellidos ||
                        ""
                    ).trim() +
                    " " +
                    String(
                        alumno.nombres ||
                        ""
                    ).trim()
                ).trim();

            const grupoAlumno =
                String(
                    alumno.grupo ||
                    ""
                ).trim();

            return (
                nombreAlumno ===
                    nombre &&
                grupoAlumno ===
                    grupo
            );

        }
    );

if (
    coincidencias.length !== 1
) {

    if (
        coincidencias.length > 1
    ) {
        console.warn(
            "No se pudo determinar de forma segura el estudiante para iniciar/cancelar la fase de retiro:",
            nombre,
            grupo
        );
    }

    return null;
}

return coincidencias[0];

}

/*

============================================================
CAMBIAR FASE DE RETIRO EN FIREBASE
============================================================
*/

function actualizarAspectoFilaRetiro(
fila,
faseRetiro
) {

if (!fila) {
    return;
}


/*
 * ==================================================
 * CELDAS DE LA FILA
 * ==================================================
 */

const celdas =
    fila.querySelectorAll(
        "td"
    );

celdas.forEach(
    celda => {

        if (
            faseRetiro === true
        ) {

            celda.style.setProperty(
                "background-color",
                "#d2d2d2",
                "important"
            );

            celda.style.setProperty(
                "color",
                "#666666",
                "important"
            );

        } else {

            celda.style.removeProperty(
                "background-color"
            );

            celda.style.removeProperty(
                "color"
            );

        }

    }
);


/*
 * ==================================================
 * BOTONES DE MENSAJE Y WHATSAPP
 * ==================================================
 */

const botones =
    fila.querySelectorAll(
        "button"
    );


botones.forEach(
    boton => {

        const texto =
            String(
                boton.textContent ||
                ""
            )
            .trim()
            .toLowerCase();


        const esMensaje =
            texto.includes(
                "mensaje"
            );


        const esLlamada =
            texto.includes(
                "llamar"
            ) ||
            texto.includes(
                "whatsapp"
            );


        if (
            !esMensaje &&
            !esLlamada
        ) {
            return;
        }


        if (
            faseRetiro === true
        ) {

            /*
             * ==========================================
             * GUARDAR ESTADO ORIGINAL
             * ==========================================
             */

            if (
                !boton.dataset.estilosRetiroGuardados
            ) {

                boton.dataset.backgroundOriginal =
                    boton.style.backgroundColor || "";

                boton.dataset.colorOriginal =
                    boton.style.color || "";

                boton.dataset.borderOriginal =
                    boton.style.borderColor || "";

                boton.dataset.cursorOriginal =
                    boton.style.cursor || "";

                boton.dataset.opacityOriginal =
                    boton.style.opacity || "";

                boton.dataset.pointerOriginal =
                    boton.style.pointerEvents || "";

                boton.dataset.shadowOriginal =
                    boton.style.boxShadow || "";

                boton.dataset.estilosRetiroGuardados =
                    "true";

            }


            /*
             * ==========================================
             * INHABILITAR COMPLETAMENTE
             * ==========================================
             */

            boton.disabled =
                true;

            boton.setAttribute(
                "disabled",
                "disabled"
            );

            boton.setAttribute(
                "aria-disabled",
                "true"
            );

            boton.style.setProperty(
                "background-color",
                "#607d8b",
                "important"
            );

            boton.style.setProperty(
                "color",
                "#eeeeee",
                "important"
            );

            boton.style.setProperty(
                "border-color",
                "#607d8b",
                "important"
            );

            boton.style.setProperty(
                "cursor",
                "not-allowed",
                "important"
            );

            boton.style.setProperty(
                "opacity",
                "0.85",
                "important"
            );

            boton.style.setProperty(
                "pointer-events",
                "none",
                "important"
            );

            boton.style.setProperty(
                "box-shadow",
                "none",
                "important"
            );

        } else {

            /*
             * ==========================================
             * RESTAURAR BOTÓN ORIGINAL
             * ==========================================
             */

            boton.disabled =
                false;

            boton.removeAttribute(
                "disabled"
            );

            boton.setAttribute(
                "aria-disabled",
                "false"
            );


            /*
             * Quitar solamente los estilos
             * que colocó esta función.
             */

            boton.style.removeProperty(
                "background-color"
            );

            boton.style.removeProperty(
                "color"
            );

            boton.style.removeProperty(
                "border-color"
            );

            boton.style.removeProperty(
                "cursor"
            );

            boton.style.removeProperty(
                "opacity"
            );

            boton.style.removeProperty(
                "pointer-events"
            );

            boton.style.removeProperty(
                "box-shadow"
            );


            delete boton.dataset.estilosRetiroGuardados;
            delete boton.dataset.backgroundOriginal;
            delete boton.dataset.colorOriginal;
            delete boton.dataset.borderOriginal;
            delete boton.dataset.cursorOriginal;
            delete boton.dataset.opacityOriginal;
            delete boton.dataset.pointerOriginal;
            delete boton.dataset.shadowOriginal;

        }

    }
);

}

/*
ESTADOS DE RETIRO CARGADOS DESDE FIREBASE

*/

const ESTADOS_RETIRO_FIREBASE = {};

async function cargarEstadosRetiroFirebase() {

try {

    const db =
        window.learningBridgeFirebaseDB;

    if (!db) {
        return;
    }

    const {
        collection,
        getDocs
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        );

    const snapshot =
        await getDocs(
            collection(
                db,
                "alumnos"
            )
        );

    Object.keys(
        ESTADOS_RETIRO_FIREBASE
    ).forEach(
        studentId => {

            delete ESTADOS_RETIRO_FIREBASE[
                studentId
            ];

        }
    );

    snapshot.forEach(
        documento => {

            const datos =
                documento.data();

            const studentId =
                String(
                    datos.studentId ||
                    documento.id ||
                    ""
                ).trim();

            if (!studentId) {
                return;
            }

            ESTADOS_RETIRO_FIREBASE[
                studentId
            ] =
                datos.faseRetiro === true;

        }
    );

    aplicarEstadosRetiroATabla();

} catch (error) {

    console.error(
        "Error al cargar estados de retiro desde Firebase:",
        error
    );

}

}

function aplicarEstadosRetiroATabla() {

const tabla =
    document.querySelector(
        "#resultadoAsistencia table"
    );

if (!tabla) {
    return;
}

const filas =
    tabla.querySelectorAll(
        "tr"
    );

filas.forEach(
    (fila, indice) => {

        if (
            indice === 0
        ) {
            return;
        }

        const alumno =
            obtenerAlumnoDesdeFilaRetiro(
                fila
            );

        if (!alumno) {
            return;
        }

        const studentId =
            String(
                alumno.studentId ||
                ""
            ).trim();

        if (!studentId) {
            return;
        }

        const faseRetiro =
            ESTADOS_RETIRO_FIREBASE[
                studentId
            ] === true;

        alumno.faseRetiro =
            faseRetiro;

        actualizarAspectoFilaRetiro(
            fila,
            faseRetiro
        );

    }
);

}

/*
VIGILAR RECARGA DE LA TABLA

*/

function iniciarVigilanciaRetiroTabla() {

const contenedor =
    document.getElementById(
        "resultadoAsistencia"
    );

if (!contenedor) {

    setTimeout(
        iniciarVigilanciaRetiroTabla,
        200
    );

    return;
}

let temporizador =
    null;

const observer =
    new MutationObserver(
        function() {

            clearTimeout(
                temporizador
            );

            temporizador =
                setTimeout(
                    function() {

                        cargarEstadosRetiroFirebase();

                    },
                    300
                );

        }
    );

observer.observe(
    contenedor,
    {
        childList: true,
        subtree: true
    }
);

cargarEstadosRetiroFirebase();

}

(function esperarFirebaseRetiro() {

if (
    window.learningBridgeFirebaseDB
) {

    iniciarVigilanciaRetiroTabla();

    return;
}

setTimeout(
    esperarFirebaseRetiro,
    100
);

})();

async function cambiarFaseRetiroAlumno(
studentId,
nuevoEstado,
fila
) {

try {

    const db =
        window.learningBridgeFirebaseDB;

    if (!db) {

        alert(
            "Firebase todavía no está disponible."
        );

        return;
    }

    const {
        doc,
        updateDoc
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        );

    const id =
        String(
            studentId || ""
        ).trim();

    if (!id) {

        alert(
            "No se pudo identificar al estudiante."
        );

        return;
    }

    await updateDoc(
        doc(
            db,
            "alumnos",
            id
        ),
        {
            faseRetiro:
                nuevoEstado
        }
    );

    /*
     * Actualizar el registro local.
     */

    if (
        window.registrosAsistencia &&
        Array.isArray(
            window.registrosAsistencia
        )
    ) {

        window.registrosAsistencia
            .forEach(
                alumno => {

                    if (
                        String(
                            alumno.studentId ||
                            ""
                        ).trim() ===
                        id
                    ) {

                        alumno.faseRetiro =
                            nuevoEstado;

                    }

                }
            );

    }

    /*
     * Actualizar inmediatamente
     * el aspecto visual de la fila.
     */

    actualizarAspectoFilaRetiro(
        fila,
        nuevoEstado
    );

    alert(
        nuevoEstado
            ? "Se inició la fase de retiro del estudiante."
            : "Se canceló la fase de retiro del estudiante."
    );

    console.log(
        nuevoEstado
            ? "Fase de retiro iniciada:"
            : "Fase de retiro cancelada:",
        id
    );

} catch (error) {

    console.error(
        "Error al cambiar la fase de retiro:",
        error
    );

    alert(
        "No se pudo actualizar la fase de retiro en Firebase."
    );

}

}
/*

============================================================
DETECTAR CLIC DERECHO SOBRE EL NOMBRE
============================================================
*/
console.log("RETIRO-ALUMNO.JS ESTÁ CARGADO Y EL MENÚ FUE INICIADO");

function iniciarMenuRetiroAlumno() {

document.addEventListener(
    "contextmenu",
    function(evento) {

        const celda =
            evento.target.closest(
                "#resultadoAsistencia table tr td:first-child"
            );

        if (!celda) {
            return;
        }

        console.log(
            "CLIC DERECHO DETECTADO SOBRE NOMBRE:",
            celda.textContent
        );

        const fila =
            celda.closest(
                "tr"
            );

const alumno =
    obtenerAlumnoDesdeFilaRetiro(
        fila
    );

if (!alumno) {
    return;
}

alumno.__filaRetiro =
    fila;

evento.preventDefault();

        mostrarMenuContextualRetiro(
            evento.clientX,
            evento.clientY,
            alumno
        );
    }
);


document.addEventListener(
    "contextmenu",
    async function(evento) {

        const celda =
            evento.target.closest(
                "#resultadoAsistencia table tr td:first-child"
            );

        if (!celda) {
            return;
        }

        console.log(
            "CLIC DERECHO DETECTADO SOBRE NOMBRE:",
            celda.textContent
        );

        const fila =
            celda.closest(
                "tr"
            );

        const alumno =
            obtenerAlumnoDesdeFilaRetiro(
                fila
            );

        if (!alumno) {
            return;
        }

        evento.preventDefault();

        try {

            const db =
                window.learningBridgeFirebaseDB;

            if (!db) {
                throw new Error(
                    "Firebase todavía no está disponible."
                );
            }

            const {
                doc,
                getDoc
            } =
                await import(
                    "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
                );

            const studentId =
                String(
                    alumno.studentId || ""
                ).trim();

            if (!studentId) {
                throw new Error(
                    "No se encontró el studentId del estudiante."
                );
            }

            const referenciaAlumno =
                doc(
                    db,
                    "alumnos",
                    studentId
                );

            const documentoAlumno =
                await getDoc(
                    referenciaAlumno
                );

            if (
                documentoAlumno.exists()
            ) {

                const datosFirebase =
                    documentoAlumno.data();

                alumno.faseRetiro =
                    datosFirebase.faseRetiro === true;

                console.log(
                    "FASE DE RETIRO ACTUAL EN FIREBASE:",
                    alumno.faseRetiro
                );

            } else {

                alumno.faseRetiro =
                    false;

            }

            mostrarMenuContextualRetiro(
                evento.clientX,
                evento.clientY,
                alumno
            );

        } catch (error) {

            console.error(
                "Error al consultar fase de retiro en Firebase:",
                error
            );

            alert(
                "No se pudo consultar el estado de retiro del estudiante."
            );

        }

    }
);

window.addEventListener(
    "scroll",
    ocultarMenuContextualRetiro
);

}

/*

============================================================
INICIAR
============================================================
*/

if (
document.readyState ===
"loading"
) {

document.addEventListener(
    "DOMContentLoaded",
    iniciarMenuRetiroAlumno
);

} else {

iniciarMenuRetiroAlumno();

}
