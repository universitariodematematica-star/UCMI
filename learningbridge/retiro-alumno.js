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

        ocultarMenuContextualRetiro();

        const faseActual =
            alumno.faseRetiro === true;

        const nuevoEstado =
            !faseActual;

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
            nuevoEstado
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

async function cambiarFaseRetiroAlumno(
studentId,
nuevoEstado
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
     * Actualizar también el registro local
     * para que el siguiente clic derecho
     * muestre inmediatamente la opción correcta.
     */

    if (
        alumnoSeleccionadoRetiro
    ) {

        alumnoSeleccionadoRetiro.faseRetiro =
            nuevoEstado;

    }

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

        mostrarMenuContextualRetiro(
            evento.clientX,
            evento.clientY,
            alumno
        );

    }
);


document.addEventListener(
    "click",
    function(evento) {

        const menu =
            document.getElementById(
                MENU_RETIRO_ID
            );

        if (
            menu &&
            !menu.contains(
                evento.target
            )
        ) {
            ocultarMenuContextualRetiro();
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
