const UCMI_CAMBIOS_GRUPO = [];

/*

============================================================
CONFIGURACIÓN
============================================================
*/

const ESTADOS_ACTIVIDAD_CAMBIO_GRUPO = [
"P",
"L",
"E",
"A"
];

/*

============================================================
NORMALIZAR ESTADO
============================================================
*/

function normalizarEstadoCambioGrupo(valor) {

return String(
    valor || ""
)
    .trim()
    .toUpperCase();

}

/*

============================================================
OBTENER ACTIVIDAD REAL
============================================================
*/

function tieneActividadRealCambioGrupo(alumno) {

if (!alumno) {
    return false;
}

const sesiones =
    alumno.sesiones || {};

return Object.values(
    sesiones
).some(
    valor => {

        const estado =
            normalizarEstadoCambioGrupo(
                valor
            );

        return ESTADOS_ACTIVIDAD_CAMBIO_GRUPO
            .includes(estado);

    }
);

}

/*

============================================================
OBTENER FECHA DE ÚLTIMA ACTIVIDAD REAL
============================================================
*/

function obtenerUltimaActividadCambioGrupo(alumno) {

if (!alumno) {
    return null;
}

const sesiones =
    alumno.sesiones || {};

const fechas =
    Object.keys(sesiones)
        .filter(
            fecha => {

                const estado =
                    normalizarEstadoCambioGrupo(
                        sesiones[fecha]
                    );

                return ESTADOS_ACTIVIDAD_CAMBIO_GRUPO
                    .includes(estado);

            }
        )
        .map(
            fecha => new Date(fecha)
        )
        .filter(
            fecha => !isNaN(
                fecha.getTime()
            )
        )
        .sort(
            (a, b) =>
                a - b
        );

if (!fechas.length) {
    return null;
}

return fechas[
    fechas.length - 1
];

}

/*

============================================================
DETECTAR ENROLMENT SUSPENDED
============================================================
*/

function contieneEnrolmentSuspendedCambioGrupo(alumno) {

if (!alumno) {
    return false;
}

const sesiones =
    alumno.sesiones || {};

return Object.values(
    sesiones
).some(
    valor =>
        String(
            valor || ""
        )
            .toLowerCase()
            .includes(
                "enrolment suspended"
            )
);

}

/*

============================================================
CONTAR SIGNOS ?
============================================================
*/

function contarInterrogacionesCambioGrupo(alumno) {

if (!alumno) {
    return 0;
}

const sesiones =
    alumno.sesiones || {};

return Object.values(
    sesiones
).filter(
    valor =>
        String(
            valor || ""
        ).trim() === "?"
).length;

}

/*

============================================================
OBTENER TODOS LOS REGISTROS DEL ESTUDIANTE
============================================================
*/

function obtenerRegistrosEstudianteCambioGrupo(
studentId,
registros
) {

const id =
    String(
        studentId || ""
    ).trim();

if (
    !id ||
    !Array.isArray(registros)
) {
    return [];
}

return registros.filter(
    alumno =>
        String(
            alumno.studentId || ""
        ).trim() === id
);

}

/*

============================================================
DETECTAR POSIBLE CAMBIO
============================================================
*/

function analizarCambioGrupoEstudiante(
studentId,
registros
) {

const registrosEstudiante =
    obtenerRegistrosEstudianteCambioGrupo(
        studentId,
        registros
    );

if (
    registrosEstudiante.length < 2
) {
    return [];
}

const resultados = [];

for (
    let i = 0;
    i < registrosEstudiante.length;
    i++
) {

    const grupoAntiguo =
        registrosEstudiante[i];

    for (
        let j = 0;
        j < registrosEstudiante.length;
        j++
    ) {

        if (i === j) {
            continue;
        }

        const grupoNuevo =
            registrosEstudiante[j];

        if (
            String(
                grupoAntiguo.grupo || ""
            ).trim() ===
            String(
                grupoNuevo.grupo || ""
            ).trim()
        ) {
            continue;
        }

        const tieneSuspension =
            contieneEnrolmentSuspendedCambioGrupo(
                grupoAntiguo
            );

        const interrogaciones =
            contarInterrogacionesCambioGrupo(
                grupoAntiguo
            );

        const ultimaActividadAntigua =
            obtenerUltimaActividadCambioGrupo(
                grupoAntiguo
            );

        const tieneActividadNueva =
            tieneActividadRealCambioGrupo(
                grupoNuevo
            );

        if (
            !tieneActividadNueva
        ) {
            continue;
        }

        let nivelAlerta = 0;

        if (tieneSuspension) {
            nivelAlerta += 2;
        }

        if (interrogaciones > 0) {
            nivelAlerta += 1;
        }

        if (ultimaActividadAntigua) {
            nivelAlerta += 1;
        }

        if (tieneActividadNueva) {
            nivelAlerta += 2;
        }

        if (nivelAlerta < 4) {
            continue;
        }

        resultados.push({

            studentId:
                String(
                    studentId
                ).trim(),

            alumno:
                `${grupoAntiguo.apellidos || ""} ${grupoAntiguo.nombres || ""}`
                    .trim(),

            grupoFirebase:
                obtenerGrupoActualFirebase(
                    studentId
                ),

            grupoAntiguo:
                String(
                    grupoAntiguo.grupo || ""
                ).trim(),

            grupoNuevo:
                String(
                    grupoNuevo.grupo || ""
                ).trim(),

            tieneSuspension:
                tieneSuspension,

            interrogaciones:
                interrogaciones,

            ultimaActividadAntigua:
                ultimaActividadAntigua,

            tieneActividadNueva:
                tieneActividadNueva,

            nivelAlerta:
                nivelAlerta

        });

    }

}

return resultados;

}

/*

============================================================
DETECTAR TODOS LOS CAMBIOS
============================================================
*/

function detectarCambiosGrupo() {

const registros =
    window.registrosAsistencia || [];

if (
    !Array.isArray(
        registros
    ) ||
    !registros.length
) {

    console.log(
        "Detector de cambios: no hay registros de asistencia."
    );

    return [];

}

const estudiantes =
    [
        ...new Set(
            registros
                .map(
                    alumno =>
                        String(
                            alumno.studentId || ""
                        ).trim()
                )
                .filter(Boolean)
        )
    ];

UCMI_CAMBIOS_GRUPO.length = 0;

estudiantes.forEach(
    studentId => {

        const cambios =
            analizarCambioGrupoEstudiante(
                studentId,
                registros
            );

        cambios.forEach(
            cambio => {

                UCMI_CAMBIOS_GRUPO.push(
                    cambio
                );

            }
        );

    }
);

console.log(
    "Posibles cambios de grupo detectados:",
    UCMI_CAMBIOS_GRUPO
);

mostrarCambiosGrupo();

return UCMI_CAMBIOS_GRUPO;

}

/*

============================================================
MOSTRAR ALERTAS
============================================================
*/

function mostrarCambiosGrupo() {

let contenedor =
    document.getElementById(
        "alertasCambiosGrupo"
    );

if (!contenedor) {

    contenedor =
        document.createElement(
            "div"
        );

    contenedor.id =
        "alertasCambiosGrupo";

    contenedor.style.margin =
        "20px 0";

    const resultado =
        document.getElementById(
            "resultadoAsistencia"
        );

    if (resultado) {

        resultado.parentNode.insertBefore(
            contenedor,
            resultado
        );

    } else {

        document.body.prepend(
            contenedor
        );

    }

}

contenedor.innerHTML = "";

if (
    !UCMI_CAMBIOS_GRUPO.length
) {

    return;

}

const titulo =
    document.createElement(
        "div"
    );

titulo.textContent =
    "⚠️ POSIBLES CAMBIOS DE GRUPO";

titulo.style.fontWeight =
    "bold";

titulo.style.fontSize =
    "18px";

titulo.style.marginBottom =
    "10px";

contenedor.appendChild(
    titulo
);

UCMI_CAMBIOS_GRUPO.forEach(
    cambio => {

        const tarjeta =
            document.createElement(
                "div"
            );

        tarjeta.style.border =
            "1px solid #d99";

        tarjeta.style.padding =
            "12px";

        tarjeta.style.marginBottom =
            "10px";

        tarjeta.style.borderRadius =
            "6px";

        tarjeta.style.background =
            "#fff5f5";

        tarjeta.innerHTML = `
            <strong>${cambio.studentId}</strong>
            — ${cambio.alumno}<br>
            <strong>Firebase:</strong>
            ${cambio.grupoFirebase || "No registrado"}<br>
            <strong>Grupo anterior:</strong>
            ${cambio.grupoAntiguo}<br>
            <strong>Grupo detectado:</strong>
            ${cambio.grupoNuevo}<br>
            <strong>Enrolment suspended:</strong>
            ${cambio.tieneSuspension ? "Sí" : "No"}<br>
            <strong>Signos ?:</strong>
            ${cambio.interrogaciones}
        `;

        contenedor.appendChild(
            tarjeta
        );

    }
);

}

/*

============================================================
EXPONER FUNCIONES
============================================================
*/

window.detectarCambiosGrupo =
detectarCambiosGrupo;

window.ucmiCambiosGrupo =
UCMI_CAMBIOS_GRUPO;

/*

============================================================
ESPERAR LOS REGISTROS DE ASISTENCIA
============================================================
*/

(function esperarRegistrosAsistencia() {

if (
    Array.isArray(
        window.registrosAsistencia
    ) &&
    window.registrosAsistencia.length
) {

    detectarCambiosGrupo();

    return;

}

setTimeout(
    esperarRegistrosAsistencia,
    500
);

})();
