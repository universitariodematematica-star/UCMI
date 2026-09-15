const CLAVE_ESTADOS_CONTACTO =
"learningBridgeEstadosContactoNuevo";

let estadosContactoAlumno = {};

/*

==================================================
CARGAR ESTADOS GUARDADOS
==================================================
*/

function cargarEstadosContacto() {

try {

    const datos =
        localStorage.getItem(
            CLAVE_ESTADOS_CONTACTO
        );

    estadosContactoAlumno =
        datos
            ? JSON.parse(datos)
            : {};

} catch (error) {

    console.error(
        "Error cargando estados de contacto:",
        error
    );

    estadosContactoAlumno = {};
}

}

/*

==================================================
GUARDAR ESTADOS
==================================================
*/

function guardarEstadosContacto() {

try {

    localStorage.setItem(
        CLAVE_ESTADOS_CONTACTO,
        JSON.stringify(
            estadosContactoAlumno
        )
    );

} catch (error) {

    console.error(
        "Error guardando estados de contacto:",
        error
    );
}

}

/*

==================================================
OBTENER ALUMNO DE UNA FILA
==================================================
*/

function obtenerAlumnoContactoDesdeFila(fila) {

if (!fila) {
    return null;
}

const celdas =
    fila.querySelectorAll("td");

if (celdas.length < 2) {
    return null;
}

const nombre =
    celdas[0].textContent.trim();

const grupo =
    celdas[1].textContent.trim();

const registros =
    window.registrosAsistencia || [];

const coincidencias =
    registros.filter(alumno => {

        const nombreAlumno =
            (
                String(alumno.apellidos || "") +
                " " +
                String(alumno.nombres || "")
            ).trim();

        return (
            nombreAlumno === nombre &&
            String(alumno.grupo || "").trim() === grupo
        );
    });

if (coincidencias.length === 1) {
    return coincidencias[0];
}

if (coincidencias.length > 1) {

    console.warn(
        "ESTADO-CONTACTO: se encontraron varios alumnos para:",
        nombre,
        grupo
    );
}

return null;

}

/*

==================================================
APLICAR ESTILO A BOTÓN DE MENSAJE
==================================================
*/

function aplicarEstadoBotonMensaje(
boton,
estado
) {

if (!boton) {
    return;
}

if (estado === true) {

    boton.textContent =
        "Mensaje enviado";

    boton.disabled = true;

    boton.style.setProperty(
        "background-color",
        "#c62828",
        "important"
    );

    boton.style.setProperty(
        "color",
        "#ffffff",
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

    boton.setAttribute(
        "aria-disabled",
        "true"
    );

} else {

    boton.textContent =
        "Enviar mensaje";

    boton.disabled = false;

    boton.style.setProperty(
        "background-color",
        "#178a75",
        "important"
    );

    boton.style.setProperty(
        "color",
        "#ffffff",
        "important"
    );

    boton.style.setProperty(
        "cursor",
        "pointer",
        "important"
    );

    boton.style.setProperty(
        "opacity",
        "1",
        "important"
    );

    boton.setAttribute(
        "aria-disabled",
        "false"
    );
}

}

/*

==================================================
APLICAR ESTILO A BOTÓN DE LLAMADA
==================================================
*/

function aplicarEstadoBotonLlamada(
boton,
estado
) {

if (!boton) {
    return;
}

if (estado === true) {

    boton.textContent =
        "Llamada hecha";

    boton.disabled = true;

    boton.style.setProperty(
        "background-color",
        "#c62828",
        "important"
    );

    boton.style.setProperty(
        "color",
        "#ffffff",
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

    boton.setAttribute(
        "aria-disabled",
        "true"
    );

} else {

    boton.textContent =
        "Llamar";

    boton.disabled = false;

    boton.style.setProperty(
        "background-color",
        "#178a75",
        "important"
    );

    boton.style.setProperty(
        "color",
        "#ffffff",
        "important"
    );

    boton.style.setProperty(
        "cursor",
        "pointer",
        "important"
    );

    boton.style.setProperty(
        "opacity",
        "1",
        "important"
    );

    boton.setAttribute(
        "aria-disabled",
        "false"
    );
}

}

/*

==================================================
RESTAURAR ESTADOS EN LA TABLA
==================================================
*/

const tabla =
    document.querySelector(
        "#resultadoAsistencia table"
    );

if (!tabla) {
    return;
}

const filas =
    tabla.querySelectorAll("tr");

filas.forEach((fila, indice) => {

    if (indice === 0) {
        return;
    }

    const alumno =
        obtenerAlumnoContactoDesdeFila(
            fila
        );

    if (!alumno) {
        return;
    }

    const studentId =
        String(
            alumno.studentId || ""
        ).trim();

    if (!studentId) {
        return;
    }

    /*
     * ==================================================
     * FASE DE RETIRO TIENE PRIORIDAD
     * ==================================================
     *
     * Si retiro-alumno.js ya marcó esta fila
     * como retirada, NO tocamos sus botones.
     *
     * De esta manera retiro-alumno.js mantiene:
     * - gris
     * - deshabilitado
     * - sin interacción
     */

    const faseRetiro =
        alumno.faseRetiro === true;

    if (faseRetiro) {
        return;
    }


    /*
     * ==================================================
     * ESTADO NORMAL DE CONTACTO
     * ==================================================
     */

    const estado =
        estadosContactoAlumno[studentId] ||
        {};

    const botones =
        fila.querySelectorAll(
            "button"
        );

    botones.forEach(boton => {

        const texto =
            boton.textContent
                .trim()
                .toLowerCase();


        /*
         * ----------------------------------------------
         * MENSAJE
         * ----------------------------------------------
         */

        if (
            texto === "enviar mensaje" ||
            texto === "mensaje enviado"
        ) {

            aplicarEstadoBotonMensaje(
                boton,
                estado.mensajeEnviado === true
            );

            return;
        }


        /*
         * ----------------------------------------------
         * LLAMADA
         * ----------------------------------------------
         */

        if (
            texto === "llamar" ||
            texto === "llamada hecha"
        ) {

            aplicarEstadoBotonLlamada(
                boton,
                estado.llamadaHecha === true
            );
        }

    });

});

/*

==================================================
REGISTRAR MENSAJE ENVIADO
==================================================
*/

function registrarMensajeEnviado(
boton
) {

const fila =
    boton.closest("tr");

const alumno =
    obtenerAlumnoContactoDesdeFila(
        fila
    );

if (!alumno) {
    return;
}

const studentId =
    String(
        alumno.studentId || ""
    ).trim();

if (!studentId) {
    return;
}

if (
    !estadosContactoAlumno[studentId]
) {

    estadosContactoAlumno[studentId] = {};
}

estadosContactoAlumno[studentId]
    .mensajeEnviado = true;

guardarEstadosContacto();

aplicarEstadoBotonMensaje(
    boton,
    true
);

}

/*

==================================================
REGISTRAR LLAMADA REALIZADA
==================================================
*/

function registrarLlamadaHecha(
boton
) {

const fila =
    boton.closest("tr");

const alumno =
    obtenerAlumnoContactoDesdeFila(
        fila
    );

if (!alumno) {
    return;
}

const studentId =
    String(
        alumno.studentId || ""
    ).trim();

if (!studentId) {
    return;
}

if (
    !estadosContactoAlumno[studentId]
) {

    estadosContactoAlumno[studentId] = {};
}

estadosContactoAlumno[studentId]
    .llamadaHecha = true;

guardarEstadosContacto();

aplicarEstadoBotonLlamada(
    boton,
    true
);

}

/*

==================================================
DETECTAR CLICS
==================================================
*/

document.addEventListener(
"click",
function(event) {

    const boton =
        event.target.closest(
            "button"
        );

    if (!boton) {
        return;
    }

    const texto =
        boton.textContent
            .trim()
            .toLowerCase();

    if (
        texto === "enviar mensaje"
    ) {

        registrarMensajeEnviado(
            boton
        );

        return;
    }

    if (
        texto === "llamar"
    ) {

        registrarLlamadaHecha(
            boton
        );

        return;
    }
},
true

);

/*

==================================================
VIGILAR TABLA
==================================================
*/

function iniciarVigilanciaEstadosContacto() {

const contenedor =
    document.getElementById(
        "resultadoAsistencia"
    );

if (!contenedor) {

    setTimeout(
        iniciarVigilanciaEstadosContacto,
        300
    );

    return;
}

let temporizador = null;

const observer =
    new MutationObserver(
        function() {

            clearTimeout(
                temporizador
            );

            temporizador =
                setTimeout(
                    function() {

                        restaurarEstadosContactoTabla();

                    },
                    100
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

restaurarEstadosContactoTabla();

}

/*

==================================================
LIMPIAR ESTADOS
==================================================
*/

function iniciarLimpiezaEstadosContacto() {

const botonLimpiar =
    document.getElementById(
        "btnLimpiarDatos"
    );

if (!botonLimpiar) {

    setTimeout(
        iniciarLimpiezaEstadosContacto,
        300
    );

    return;
}

botonLimpiar.addEventListener(
    "click",
    function() {

        /*
         * Esperamos a que el botón
         * termine su proceso normal
         * de limpieza.
         */

        setTimeout(
            function() {

                estadosContactoAlumno = {};

                localStorage.removeItem(
                    CLAVE_ESTADOS_CONTACTO
                );

                restaurarEstadosContactoTabla();

            },
            150
        );
    }
);

}

/*

==================================================
INICIO
==================================================
*/

cargarEstadosContacto();

iniciarVigilanciaEstadosContacto();

iniciarLimpiezaEstadosContacto();

console.log(
"ESTADO-CONTACTO-ALUMNO.JS ESTÁ CARGADO"
);
