const UCMI_CAMBIOS_GRUPO = [];

const ESTADOS_ACTIVIDAD_CAMBIO_GRUPO = [
"P",
"L",
"E",
"A"
];

/*

============================================================
UTILIDADES
============================================================
*/

function normalizarTextoCambioGrupo(valor) {
return String(valor || "")
.trim()
.toUpperCase();
}

function obtenerFechaSesionCambioGrupo(sesion) {
if (!sesion || !sesion.fecha) {
return null;
}

const fecha = new Date(sesion.fecha);

if (isNaN(fecha.getTime())) {
    return null;
}

return fecha;

}

function esActividadRealCambioGrupo(asistencia) {
const texto =
normalizarTextoCambioGrupo(asistencia);

return ESTADOS_ACTIVIDAD_CAMBIO_GRUPO.some(
    estado => {
        return (
            texto === estado ||
            texto.startsWith(
                estado + " "
            ) ||
            texto.startsWith(
                estado + "("
            )
        );
    }
);

}

function esSuspensionCambioGrupo(asistencia) {
return normalizarTextoCambioGrupo(
asistencia
).includes(
"ENROLMENT SUSPENDED"
);
}

function esInterrogacionCambioGrupo(asistencia) {
return (
normalizarTextoCambioGrupo(
asistencia
) === "?"
);
}

function esFlechaCambioGrupo(asistencia) {
return (
normalizarTextoCambioGrupo(
asistencia
) === "←"
);
}

/*

============================================================
ORDENAR SESIONES
============================================================
*/

function obtenerSesionesOrdenadasCambioGrupo(
alumno
) {
if (
!alumno ||
!Array.isArray(alumno.sesiones)
) {
return [];
}

return alumno.sesiones
    .map(sesion => {
        return {
            ...sesion,
            fecha:
                obtenerFechaSesionCambioGrupo(
                    sesion
                )
        };
    })
    .filter(sesion => sesion.fecha)
    .sort(
        (a, b) =>
            a.fecha.getTime() -
            b.fecha.getTime()
    );

}

/*

============================================================
ACTIVIDAD REAL
============================================================
*/

function obtenerActividadesRealesCambioGrupo(
alumno
) {
return obtenerSesionesOrdenadasCambioGrupo(
alumno
).filter(
sesion =>
esActividadRealCambioGrupo(
sesion.asistencia
)
);
}

/*

============================================================
ENROLMENT SUSPENDED
============================================================
*/

function obtenerSuspensionesCambioGrupo(
alumno
) {
return obtenerSesionesOrdenadasCambioGrupo(
alumno
).filter(
sesion =>
esSuspensionCambioGrupo(
sesion.asistencia
)
);
}

/*

============================================================
FLECHAS POSTERIORES A LA ACTIVIDAD
============================================================
*/

function obtenerFlechasPosterioresCambioGrupo(
alumno,
fechaReferencia
) {
if (!fechaReferencia) {
return [];
}

return obtenerSesionesOrdenadasCambioGrupo(
    alumno
).filter(sesion => {
    return (
        sesion.fecha.getTime() >
            fechaReferencia.getTime() &&
        esFlechaCambioGrupo(
            sesion.asistencia
        )
    );
});

}

/*

============================================================
INTERROGACIONES ANTES DE UNA ACTIVIDAD
============================================================
*/

function obtenerInterrogacionesAntesCambioGrupo(
alumno,
fechaReferencia
) {
if (!fechaReferencia) {
return [];
}

return obtenerSesionesOrdenadasCambioGrupo(
    alumno
).filter(sesion => {
    return (
        sesion.fecha.getTime() <
            fechaReferencia.getTime() &&
        esInterrogacionCambioGrupo(
            sesion.asistencia
        )
    );
});

}

/*

============================================================
OBTENER REGISTROS DEL MISMO ESTUDIANTE
============================================================
*/

function obtenerRegistrosEstudianteCambioGrupo(
studentId,
registros
) {
const idBuscado =
String(
studentId || ""
).trim();

if (
    !idBuscado ||
    !Array.isArray(registros)
) {
    return [];
}

return registros.filter(
    alumno =>
        String(
            alumno.studentId || ""
        ).trim() === idBuscado
);

}

/*

============================================================
ANALIZAR UNA POSIBLE TRANSFERENCIA
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
    const grupoAnterior =
        registrosEstudiante[i];

    const actividadesAnteriores =
        obtenerActividadesRealesCambioGrupo(
            grupoAnterior
        );

    if (
        actividadesAnteriores.length === 0
    ) {
        continue;
    }

    const ultimaActividadAnterior =
        actividadesAnteriores[
            actividadesAnteriores.length - 1
        ];

    const fechaUltimaActividadAnterior =
        ultimaActividadAnterior.fecha;

    const suspensiones =
        obtenerSuspensionesCambioGrupo(
            grupoAnterior
        );

    const flechasPosteriores =
        obtenerFlechasPosterioresCambioGrupo(
            grupoAnterior,
            fechaUltimaActividadAnterior
        );

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
                grupoAnterior.grupo ||
                ""
            ).trim() ===
            String(
                grupoNuevo.grupo ||
                ""
            ).trim()
        ) {
            continue;
        }

        const actividadesNuevas =
            obtenerActividadesRealesCambioGrupo(
                grupoNuevo
            );

        if (
            actividadesNuevas.length === 0
        ) {
            continue;
        }

        /*
         * ------------------------------------------------
         * Primera actividad del posible nuevo grupo
         * ------------------------------------------------
         */

        const primeraActividadNueva =
            actividadesNuevas[0];

        const fechaPrimeraActividadNueva =
            primeraActividadNueva.fecha;

        /*
         * El nuevo grupo debe comenzar después
         * de que existió actividad en el anterior.
         */

        if (
            fechaPrimeraActividadNueva.getTime() <
            fechaUltimaActividadAnterior.getTime()
        ) {
            continue;
        }

        /*
         * ------------------------------------------------
         * Interrogaciones anteriores al nuevo grupo
         * ------------------------------------------------
         */

        const interrogacionesAntes =
            obtenerInterrogacionesAntesCambioGrupo(
                grupoNuevo,
                fechaPrimeraActividadNueva
            );

        /*
         * ------------------------------------------------
         * Evidencias
         * ------------------------------------------------
         */

        let puntuacion = 0;

        const evidencias = [];

        if (
            suspensiones.length > 0
        ) {
            puntuacion += 2;

            evidencias.push(
                "ENROLMENT SUSPENDED en el grupo anterior"
            );
        }

        if (
            flechasPosteriores.length > 0
        ) {
            puntuacion += 2;

            evidencias.push(
                "marcadores posteriores a la última actividad del grupo anterior"
            );
        }

        if (
            interrogacionesAntes.length >= 2
        ) {
            puntuacion += 2;

            evidencias.push(
                "interrogaciones antes de iniciar actividad en el nuevo grupo"
            );
        }

        /*
         * Actividad posterior en el nuevo grupo.
         */

        if (
            actividadesNuevas.length >= 2
        ) {
            puntuacion += 2;

            evidencias.push(
                "actividad real posterior en el nuevo grupo"
            );
        }

        /*
         * Si existe una suspensión en el grupo
         * anterior y actividad posterior en el nuevo,
         * la evidencia es especialmente fuerte.
         */

        if (
            suspensiones.length > 0 &&
            actividadesNuevas.length > 0
        ) {
            puntuacion += 1;
        }

        /*
         * ------------------------------------------------
         * UMBRAL
         * ------------------------------------------------
         */

        if (puntuacion < 5) {
            continue;
        }

        /*
         * ------------------------------------------------
         * FECHA PROBABLE DEL CAMBIO
         * ------------------------------------------------
         *
         * Preferimos la primera actividad real del
         * nuevo grupo. Es el primer punto objetivo en
         * que podemos afirmar que el estudiante ya
         * aparece activo en el nuevo grupo.
         */

        const fechaCambio =
            fechaPrimeraActividadNueva;

        /*
         * ------------------------------------------------
         * GRUPO ACTUAL DE FIREBASE
         * ------------------------------------------------
         */

        const grupoFirebase =
            typeof window
                .obtenerGrupoActualFirebase ===
            "function"
                ? window.obtenerGrupoActualFirebase(
                      studentId
                  )
                : "";

        const grupoAnteriorTexto =
            String(
                grupoAnterior.grupo ||
                ""
            ).trim();

        const grupoNuevoTexto =
            String(
                grupoNuevo.grupo ||
                ""
            ).trim();

        /*
         * Solo nos interesa el cambio que no coincide
         * con Firebase.
         */

        if (
            grupoFirebase &&
            grupoFirebase ===
                grupoNuevoTexto
        ) {
            continue;
        }

        resultados.push({
            studentId:
                String(
                    studentId
                ).trim(),

            apellidos:
                String(
                    grupoAnterior.apellidos ||
                    grupoNuevo.apellidos ||
                    ""
                ).trim(),

            nombres:
                String(
                    grupoAnterior.nombres ||
                    grupoNuevo.nombres ||
                    ""
                ).trim(),

            grupoAnterior:
                grupoAnteriorTexto,

            grupoNuevo:
                grupoNuevoTexto,

            grupoFirebase:
                grupoFirebase,

            fechaCambio:
                fechaCambio,

            puntuacion:
                puntuacion,

            evidencias:
                evidencias
        });
    }
}

/*
 * --------------------------------------------------------
 * ELIMINAR DUPLICADOS
 * --------------------------------------------------------
 */

const unicos = [];

resultados.forEach(
    resultado => {
        const existe =
            unicos.some(item => {
                return (
                    item.studentId ===
                        resultado.studentId &&
                    item.grupoAnterior ===
                        resultado.grupoAnterior &&
                    item.grupoNuevo ===
                        resultado.grupoNuevo
                );
            });

        if (!existe) {
            unicos.push(
                resultado
            );
        }
    }
);

return unicos;

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
    !Array.isArray(registros) ||
    registros.length === 0
) {
    UCMI_CAMBIOS_GRUPO.length = 0;

    mostrarCambiosGrupo();

    return [];
}

const estudiantes =
    new Set();

registros.forEach(
    alumno => {
        const studentId =
            String(
                alumno.studentId || ""
            ).trim();

        if (studentId) {
            estudiantes.add(
                studentId
            );
        }
    }
);

const resultados = [];

estudiantes.forEach(
    studentId => {
        const cambios =
            analizarCambioGrupoEstudiante(
                studentId,
                registros
            );

        cambios.forEach(
            cambio => {
                resultados.push(
                    cambio
                );
            }
        );
    }
);

/*
 * --------------------------------------------------------
 * COPIAR RESULTADOS AL ARRAY GLOBAL
 * --------------------------------------------------------
 */

UCMI_CAMBIOS_GRUPO.length = 0;

resultados.forEach(
    cambio => {
        UCMI_CAMBIOS_GRUPO.push(
            cambio
        );
    }
);

window.ucmiCambiosGrupo =
    UCMI_CAMBIOS_GRUPO;

mostrarCambiosGrupo();

console.log(
    "Cambios de grupo detectados:",
    UCMI_CAMBIOS_GRUPO
);

return UCMI_CAMBIOS_GRUPO;

}

/*

============================================================
FORMATEAR FECHA
============================================================
*/

function formatearFechaCambioGrupo(
fecha
) {
if (!fecha) {
return "";
}

const dia =
    String(
        fecha.getDate()
    ).padStart(2, "0");

const mes =
    String(
        fecha.getMonth() + 1
    ).padStart(2, "0");

const año =
    fecha.getFullYear();

return (
    dia +
    "/" +
    mes +
    "/" +
    año
);

}

/*

============================================================
MOSTRAR AVISO
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

    const resultado =
        document.getElementById(
            "resultadoAsistencia"
        );

    if (
        resultado &&
        resultado.parentNode
    ) {
        resultado.parentNode.insertBefore(
            contenedor,
            resultado
        );
    } else {
        document.body.appendChild(
            contenedor
        );
    }
}

/*
 * --------------------------------------------------------
 * SI NO HAY DISCREPANCIAS, EL AVISO DESAPARECE
 * --------------------------------------------------------
 */

if (
    !UCMI_CAMBIOS_GRUPO.length
) {
    contenedor.innerHTML = "";

    contenedor.style.display =
        "none";

    return;
}

contenedor.style.display =
    "block";

contenedor.innerHTML = "";

const titulo =
    document.createElement(
        "div"
    );

titulo.textContent =
    "⚠️ CAMBIOS DE GRUPO DETECTADOS — " +
    UCMI_CAMBIOS_GRUPO.length +
    " estudiante" +
    (
        UCMI_CAMBIOS_GRUPO.length ===
        1
            ? ""
            : "s"
    );

titulo.style.fontWeight =
    "700";

titulo.style.fontSize =
    "18px";

titulo.style.marginBottom =
    "14px";

contenedor.appendChild(
    titulo
);

const explicacion =
    document.createElement(
        "div"
    );

explicacion.textContent =
    "Estos estudiantes presentan una discrepancia entre el cambio detectado en el Excel y el grupo registrado actualmente en Firebase. Actualiza Firebase manualmente para eliminar este aviso.";

explicacion.style.marginBottom =
    "16px";

contenedor.appendChild(
    explicacion
);

const tabla =
document.createElement(
"table"
);

tabla.style.width =
"100%";

tabla.style.borderCollapse =
"separate";

tabla.style.borderSpacing =
"0";

tabla.style.backgroundColor =
"white";

tabla.style.borderRadius =
"8px";

tabla.style.overflow =
"hidden";

tabla.style.boxShadow =
"0 2px 6px rgba(0,0,0,0.08)";

const encabezado =
document.createElement(
"tr"
);

[
"Alumno",
"ID",
"Fecha de cambio",
"Grupo anterior",
"Nuevo grupo",
"Grupo en Firebase"
].forEach(
texto => {

    const th =
        document.createElement(
            "th"
        );

    th.textContent =
        texto;

    th.style.padding =
        "12px 14px";

    th.style.backgroundColor =
        "#5c1d53";

    th.style.color =
        "white";

    th.style.border =
        "1px solid #4b1744";

    th.style.textAlign =
        "center";

    th.style.fontWeight =
        "700";

    th.style.whiteSpace =
        "nowrap";

    encabezado.appendChild(
        th
    );
}

);

tabla.appendChild(
encabezado
);

UCMI_CAMBIOS_GRUPO.forEach(
(cambio, indice) => {

    const fila =
        document.createElement(
            "tr"
        );

    const nombre =
        (
            String(
                cambio.apellidos ||
                ""
            ).trim() +
            " " +
            String(
                cambio.nombres ||
                ""
            ).trim()
        ).trim();

    const valores = [
        nombre,
        cambio.studentId,
        formatearFechaCambioGrupo(
            cambio.fechaCambio
        ),
        cambio.grupoAnterior,
        cambio.grupoNuevo,
        cambio.grupoFirebase ||
            "NO REGISTRADO"
    ];

    valores.forEach(
        (texto, indiceColumna) => {

            const td =
                document.createElement(
                    "td"
                );

            td.textContent =
                texto;

            td.style.padding =
                "11px 14px";

            td.style.border =
                "1px solid #ddd";

            td.style.textAlign =
                indiceColumna === 0
                    ? "left"
                    : "center";

            td.style.verticalAlign =
                "middle";

            if (
                indice % 2 === 1
            ) {
                td.style.backgroundColor =
                    "#faf7fb";
            }

            if (
                indiceColumna === 0
            ) {
                td.style.fontWeight =
                    "600";

                td.style.color =
                    "#333";

                td.style.whiteSpace =
                    "nowrap";
            }

            if (
                indiceColumna === 3
            ) {
                td.style.color =
                    "#8b1e1e";

                td.style.fontWeight =
                    "600";
            }

            if (
                indiceColumna === 4
            ) {
                td.style.color =
                    "#178a75";

                td.style.fontWeight =
                    "700";
            }

            if (
                indiceColumna === 5
            ) {
                td.style.color =
                    "#5c1d53";

                td.style.fontWeight =
                    "600";
            }

            fila.appendChild(
                td
            );
        }
    );

    tabla.appendChild(
        fila
    );
}

);

contenedor.appendChild(
tabla
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
ESPERAR LOS DATOS
============================================================
No modificamos reporte.js.
Detectamos automáticamente cuando el Excel ya fue
cargado y volvemos a analizar si cambian los datos.
============================================================
*/

let firmaAnteriorCambiosGrupo =
"";

function obtenerFirmaRegistrosCambioGrupo() {
const registros =
window.registrosAsistencia || [];

if (
    !Array.isArray(registros) ||
    registros.length === 0
) {
    return "";
}

return registros
    .map(alumno => {
        const id =
            String(
                alumno.studentId ||
                ""
            ).trim();

        const grupo =
            String(
                alumno.grupo ||
                ""
            ).trim();

        const sesiones =
            Array.isArray(
                alumno.sesiones
            )
                ? alumno.sesiones.length
                : 0;

        return (
            id +
            "|" +
            grupo +
            "|" +
            sesiones
        );
    })
    .sort()
    .join("||");

}

function vigilarCambiosGrupo() {
const firma =
obtenerFirmaRegistrosCambioGrupo();

if (
    firma &&
    firma !==
        firmaAnteriorCambiosGrupo
) {
    firmaAnteriorCambiosGrupo =
        firma;

    setTimeout(
        function() {
            detectarCambiosGrupo();
        },
        300
    );

    return;
}

if (!firma) {
    firmaAnteriorCambiosGrupo =
        "";
}

}

setInterval(
vigilarCambiosGrupo,
1000
);
