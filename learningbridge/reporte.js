/*
 * ============================================================
 * LEARNING BRIDGE
 * NUEVO SISTEMA DE ASISTENCIA
 * ============================================================
 *
 * Archivo:
 * learningbridge/reporte.js
 *
 * ETAPA 1:
 * - Leer archivo Excel
 * - Leer hoja Configuracion-Grupos
 * - Validar los días operativos
 * - Cargar grupos en el selector
 *
 * IMPORTANTE:
 * Este archivo pertenece al NUEVO sistema.
 * No modifica el sistema antiguo.
 * ============================================================
 */


/* ============================================================
   ELEMENTOS DE LA PÁGINA
============================================================ */

const archivoAsistencia =
    document.getElementById("archivoAsistencia");

const filtroGrupo =
    document.getElementById("filtroGrupo");

const estadoAsistencia =
    document.getElementById("estadoAsistencia");


/* ============================================================
   VARIABLES PRINCIPALES
============================================================ */

let configuracionGrupos = [];

let registrosAsistencia = [];

const DIAS_SEMANA_CALCULO = [
"Domingo",
"Lunes",
"Martes",
"Miércoles",
"Jueves",
"Viernes",
"Sábado"
];

/*

============================================================
CALCULAR TOTAL DE CLASES DEL GRUPO DURANTE 7 MESES
============================================================
*/

/* ============================================================
CALCULAR TOTAL DE CLASES DEL GRUPO DURANTE 7 MESES
============================================================ */

function calcularTotalClasesGrupo(
grupo,
fechaInicio
) {

if (!grupo || !fechaInicio) {
    return 0;
}

const configuracion =
    configuracionGrupos.find(
        item =>
            String(item.grupo).trim() ===
            String(grupo).trim()
    );

if (!configuracion) {
    return 0;
}

const fechaInicioCurso =
    new Date(fechaInicio);

fechaInicioCurso.setHours(
    0,
    0,
    0,
    0
);

const fechaFinCurso =
    new Date(fechaInicioCurso);

fechaFinCurso.setMonth(
    fechaFinCurso.getMonth() + 7
);

fechaFinCurso.setHours(
    0,
    0,
    0,
    0
);

let totalClases = 0;

const fechaActual =
    new Date(fechaInicioCurso);

while (fechaActual < fechaFinCurso) {

    const nombreDia =
        DIAS_SEMANA_CALCULO[
            fechaActual.getDay()
        ];

    if (
        configuracion.dias &&
        configuracion.dias[nombreDia] === true
    ) {
        totalClases++;
    }

    fechaActual.setDate(
        fechaActual.getDate() + 1
    );
}

return totalClases;

}
let totalClases = 0;

const fechaActual =
    new Date(fechaInicioCurso);

while (fechaActual < fechaFinCurso) {

    const nombreDia =
        DIAS_SEMANA_CALCULO[
            fechaActual.getDay()
        ];

    if (
        configuracion.dias &&
        configuracion.dias[nombreDia] === true
    ) {

        totalClases++;

    }

    fechaActual.setDate(
        fechaActual.getDate() + 1
    );
}

return totalClases;

}

/* ============================================================
OBTENER PRIMERA FECHA DEL GRUPO
============================================================ */

function obtenerPrimeraFechaGrupo(grupo) {

const fechas = [];

registrosAsistencia.forEach(alumno => {

    if (alumno.grupo !== grupo) {
        return;
    }

    if (!Array.isArray(alumno.sesiones)) {
        return;
    }

    alumno.sesiones.forEach(sesion => {

        if (!sesion.fecha) {
            return;
        }

        const fecha =
            new Date(sesion.fecha);

        if (isNaN(fecha.getTime())) {
            return;
        }

        fecha.setHours(
            0,
            0,
            0,
            0
        );

        fechas.push(fecha);

    });

});

if (fechas.length === 0) {
    return null;
}

fechas.sort(
    (a, b) => a - b
);

return fechas[0];

}

/* ============================================================
REFERENCIAS GLOBALES
============================================================ */

window.configuracionGrupos =
configuracionGrupos;

window.registrosAsistencia =
registrosAsistencia;

/* ============================================================
DÍAS DE LA SEMANA
============================================================ */

const DIAS_SEMANA = [
"Lunes",
"Martes",
"Miércoles",
"Jueves",
"Viernes",
"Sábado",
"Domingo"
];


/* ============================================================
   MOSTRAR ESTADO
============================================================ */

function mostrarEstado(mensaje, tipo = "normal") {

    if (!estadoAsistencia) {
        return;
    }

    estadoAsistencia.style.display = "block";

    estadoAsistencia.textContent = mensaje;

    if (tipo === "error") {

        estadoAsistencia.style.backgroundColor = "#f8d7da";
        estadoAsistencia.style.color = "#842029";

    } else if (tipo === "exito") {

        estadoAsistencia.style.backgroundColor = "#d1e7dd";
        estadoAsistencia.style.color = "#0f5132";

    } else {

        estadoAsistencia.style.backgroundColor = "#e9ecef";
        estadoAsistencia.style.color = "#222";

    }
}


/* ============================================================
   NORMALIZAR TEXTO
============================================================ */

function normalizarTexto(valor) {

    return String(valor ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* ============================================================
   CONVERTIR SÍ / NO
============================================================ */

function esDiaOperativo(valor) {

    const texto = normalizarTexto(valor);

    return (
        texto === "si" ||
        texto === "sí" ||
        texto === "s" ||
        texto === "yes" ||
        texto === "1" ||
        texto === "true"
    );

}


/* ============================================================
   BUSCAR COLUMNA POR NOMBRE
============================================================ */

function encontrarColumna(encabezados, nombreBuscado) {

    const objetivo =
        normalizarTexto(nombreBuscado);

    return encabezados.findIndex(encabezado =>
        normalizarTexto(encabezado) === objetivo
    );

}


/* ============================================================
   LEER CONFIGURACION-GRUPOS
============================================================ */

function leerConfiguracionGrupos(workbook) {

    const hoja = workbook.getWorksheet("Configuracion-Grupos");

    if (!hoja) {
        throw new Error(
            'No se encontró la hoja "Configuracion-Grupos".'
        );
    }

    let filaEncabezados = null;
    let indices = {};

    /*
     * ------------------------------------------
     * BUSCAR ENCABEZADOS
     * ------------------------------------------
     */

    for (
        let numeroFila = 1;
        numeroFila <= Math.min(20, hoja.rowCount);
        numeroFila++
    ) {

        const fila = hoja.getRow(numeroFila);

        const encabezados = fila.values
            .map(valor => normalizarTexto(valor))
            .filter(valor => valor !== "");

        if (
            encabezados.includes("grupo") &&
            encabezados.includes("lunes") &&
            encabezados.includes("martes") &&
            encabezados.includes("miercoles") &&
            encabezados.includes("jueves") &&
            encabezados.includes("viernes") &&
            encabezados.includes("sabado") &&
            encabezados.includes("domingo")
        ) {

            filaEncabezados = numeroFila;

            fila.eachCell((celda, numeroColumna) => {

                const encabezado =
                    normalizarTexto(celda.value);

                if (encabezado) {
                    indices[encabezado] = numeroColumna;
                }

            });

            break;
        }
    }

    if (!filaEncabezados) {

        throw new Error(
            'La hoja "Configuracion-Grupos" no contiene los encabezados requeridos.'
        );
    }

    /*
     * ------------------------------------------
     * LEER GRUPOS
     * ------------------------------------------
     */

    const configuraciones = [];

    for (
        let numeroFila = filaEncabezados + 1;
        numeroFila <= hoja.rowCount;
        numeroFila++
    ) {

        const fila = hoja.getRow(numeroFila);

        const grupo = String(
            fila.getCell(indices["grupo"]).value || ""
        ).trim();

        if (!grupo) {
            continue;
        }

        const dias = {};

        DIAS_SEMANA.forEach(dia => {

            const clave = normalizarTexto(dia);

            const valor =
                fila.getCell(indices[clave]).value;

            dias[dia] = esDiaOperativo(valor);

        });

        configuraciones.push({
            grupo,
            dias
        });
    }

    return configuraciones;
}


/* ============================================================
   CARGAR GRUPOS EN EL SELECTOR
============================================================ */

function cargarGruposEnSelector(configuraciones) {

    if (!filtroGrupo) {
        return;
    }


    /*
     * Conservar "Todos".
     */

    filtroGrupo.innerHTML = "";

    const opcionTodos =
        document.createElement("option");

    opcionTodos.value = "todos";

    opcionTodos.textContent = "Todos";

    filtroGrupo.appendChild(opcionTodos);


    /*
     * --------------------------------------------------------
     * ORDENAR ALFABÉTICAMENTE
     * --------------------------------------------------------
     */

    const configuracionesOrdenadas =
        [...configuraciones].sort((a, b) =>
            a.grupo.localeCompare(
                b.grupo,
                "es",
                {
                    numeric: true,
                    sensitivity: "base"
                }
            )
        );


    /*
     * --------------------------------------------------------
     * CREAR OPCIONES
     * --------------------------------------------------------
     */

    configuracionesOrdenadas.forEach(configuracion => {

        const opcion =
            document.createElement("option");

        opcion.value =
            configuracion.grupo;

        opcion.textContent =
            configuracion.grupo;

        filtroGrupo.appendChild(opcion);

    });

}


/* ============================================================
   MOSTRAR CONFIGURACIÓN EN CONSOLA
============================================================ */

function mostrarConfiguracionEnConsola(configuraciones) {

    console.log(
        "============================================"
    );

    console.log(
        "CONFIGURACION-GRUPOS"
    );

    console.log(
        "============================================"
    );


    configuraciones.forEach(configuracion => {

        console.log(
            configuracion.grupo,
            configuracion.dias
        );

    });


    console.log(
        "============================================"
    );

}

/* ============================================================
   RECONOCER ENCABEZADO DE FECHA
============================================================ */

function convertirFechaExcel(valor) {

    /*
     * --------------------------------------------------------
     * SI EXCEL ENTREGA UNA FECHA COMO OBJETO Date
     * --------------------------------------------------------
     */

    if (valor instanceof Date) {

        return new Date(
            valor.getFullYear(),
            valor.getMonth(),
            valor.getDate()
        );

    }


    /*
     * --------------------------------------------------------
     * SI EXCEL ENTREGA UN NÚMERO SERIAL
     * --------------------------------------------------------
     */

    if (typeof valor === "number") {

        const fecha =
            new Date(
                Math.round(
                    (valor - 25569) *
                    86400 *
                    1000
                )
            );

        if (!isNaN(fecha.getTime())) {

            return new Date(
                fecha.getFullYear(),
                fecha.getMonth(),
                fecha.getDate()
            );

        }

        return null;

    }


    /*
     * --------------------------------------------------------
     * ENCABEZADO DE TEXTO
     *
     * FORMATO REAL DEL EXCEL:
     *
     * 8 Aug 2026 3.00PM All students
     *
     * 15 Aug 2026 3.00PM All students
     *
     * 5 Sept 2026 3.00PM All students
     *
     * Aquí solamente extraemos:
     *
     * día + mes + año
     * --------------------------------------------------------
     */

    const texto =
        String(valor ?? "").trim();

    if (!texto) {
        return null;
    }


    const coincidencia =
        texto.match(
            /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/
        );

    if (!coincidencia) {
        return null;
    }


    const dia =
        parseInt(
            coincidencia[1],
            10
        );

    const mesTexto =
        coincidencia[2]
            .toLowerCase();

    const anio =
        parseInt(
            coincidencia[3],
            10
        );


    /*
     * --------------------------------------------------------
     * MESES EN INGLÉS
     * --------------------------------------------------------
     */

    const meses = {

        jan: 0,
        january: 0,

        feb: 1,
        february: 1,

        mar: 2,
        march: 2,

        apr: 3,
        april: 3,

        may: 4,

        jun: 5,
        june: 5,

        jul: 6,
        july: 6,

        aug: 7,
        august: 7,

        sep: 8,
        sept: 8,
        september: 8,

        oct: 9,
        october: 9,

        nov: 10,
        november: 10,

        dec: 11,
        december: 11

    };


    if (!(mesTexto in meses)) {
        return null;
    }


    return new Date(
        anio,
        meses[mesTexto],
        dia
    );

}


/* ============================================================
   COMPROBAR SI UNA COLUMNA ES UNA SESIÓN
============================================================ */

function esColumnaSesion(valor) {

    return convertirFechaExcel(valor) !== null;

}


/* ============================================================
   LEER HOJA DE ASISTENCIA DE UN GRUPO
============================================================ */

function leerHojaGrupo(hoja) {

    /*
     * La fila 4 contiene los encabezados.
     */

    const filaEncabezados =
        hoja.getRow(4);

    const encabezados = [];

    for (
        let numeroColumna = 1;
        numeroColumna <= hoja.columnCount;
        numeroColumna++
    ) {

        encabezados[numeroColumna] =
            filaEncabezados
                .getCell(numeroColumna)
                .value;

    }


    /*
     * --------------------------------------------------------
     * IDENTIFICAR LAS COLUMNAS DE SESIONES
     * --------------------------------------------------------
     */

    const columnasSesiones = [];

    for (
        let numeroColumna = 5;
        numeroColumna <= hoja.columnCount;
        numeroColumna++
    ) {

        const encabezado =
            encabezados[numeroColumna];

        if (
            esColumnaSesion(encabezado)
        ) {

            columnasSesiones.push({
                columna: numeroColumna,
                encabezado: encabezado,
                fecha: convertirFechaExcel(
                    encabezado
                )
            });

        }

    }


    /*
     * --------------------------------------------------------
     * LEER ALUMNOS
     * --------------------------------------------------------
     */

    const alumnos = [];

    for (
        let numeroFila = 5;
        numeroFila <= hoja.rowCount;
        numeroFila++
    ) {

        const fila =
            hoja.getRow(numeroFila);

        const apellidos =
            String(
                fila.getCell(1).value ?? ""
            ).trim();

        const nombres =
            String(
                fila.getCell(2).value ?? ""
            ).trim();

        const studentId =
            String(
                fila.getCell(3).value ?? ""
            ).trim();

        const email =
            String(
                fila.getCell(4).value ?? ""
            ).trim();


        /*
         * Ignorar filas completamente vacías.
         */

        if (
            !apellidos &&
            !nombres &&
            !studentId
        ) {
            continue;
        }


        /*
         * ----------------------------------------------------
         * SESIONES DEL ALUMNO
         * ----------------------------------------------------
         */

        const sesiones = [];

        columnasSesiones.forEach(
            sesion => {

                const valor =
                    fila
                        .getCell(
                            sesion.columna
                        )
                        .value;

                let asistencia =
                    String(
                        valor ?? ""
                    ).trim();

                asistencia =
                    asistencia.toUpperCase();


                sesiones.push({

                    fecha:
                        sesion.fecha,

                    encabezado:
                        sesion.encabezado,

                    asistencia:
                        asistencia

                });

            }
        );


        alumnos.push({

            apellidos:
                apellidos,

            nombres:
                nombres,

            studentId:
                studentId,

            email:
                email,

            grupo:
                hoja.name,

            sesiones:
                sesiones

        });

    }


    return alumnos;

}


/* ============================================================
   LEER TODAS LAS HOJAS DE ASISTENCIA
============================================================ */

function leerRegistrosAsistencia(workbook) {

    const registros = [];


    workbook.worksheets.forEach(
        hoja => {

            /*
             * La hoja de configuración no es
             * una hoja de asistencia.
             */

            if (
                hoja.name ===
                "Configuracion-Grupos"
            ) {
                return;
            }


            const alumnos =
                leerHojaGrupo(
                    hoja
                );


            registros.push(
                ...alumnos
            );

        }
    );


    return registros;

}

/* ============================================================
   PERSISTENCIA DE REGISTROS DE ASISTENCIA
============================================================ */

const CLAVE_PERSISTENCIA_ASISTENCIA =
"learningBridgeRegistrosAsistenciaNuevo";

const CLAVE_PERSISTENCIA_CONFIGURACION =
"learningBridgeConfiguracionGruposNuevo";

function guardarRegistrosAsistencia() {

try {

    const datos =
        registrosAsistencia.map(
            alumno => ({

                apellidos:
                    alumno.apellidos,

                nombres:
                    alumno.nombres,

                studentId:
                    alumno.studentId,

                email:
                    alumno.email,

                grupo:
                    alumno.grupo,

                sesiones:
                    alumno.sesiones.map(
                        sesion => ({

                            fecha:
                                sesion.fecha
                                    ? sesion.fecha.toISOString()
                                    : null,

                            asistencia:
                                sesion.asistencia

                        })
                    )

            })
        );


    localStorage.setItem(
        CLAVE_PERSISTENCIA_ASISTENCIA,
        JSON.stringify(datos)
    );


    localStorage.setItem(
        CLAVE_PERSISTENCIA_CONFIGURACION,
        JSON.stringify(
            configuracionGrupos
        )
    );


    console.log(
        "Registros de asistencia guardados en localStorage."
    );

    console.log(
        "Configuración de grupos guardada en localStorage."
    );


} catch (error) {

    console.error(
        "Error al guardar registros de asistencia:",
        error
    );

}

}

function cargarRegistrosAsistenciaPersistidos() {

try {

    const datosGuardados =
        localStorage.getItem(
            CLAVE_PERSISTENCIA_ASISTENCIA
        );


    if (!datosGuardados) {

        return false;

    }


    const datos =
        JSON.parse(
            datosGuardados
        );


    registrosAsistencia =
        datos.map(
            alumno => ({

                apellidos:
                    alumno.apellidos,

                nombres:
                    alumno.nombres,

                studentId:
                    alumno.studentId,

                email:
                    alumno.email,

                grupo:
                    alumno.grupo,

                sesiones:
                    (alumno.sesiones || [])
                        .map(
                            sesion => ({

                                fecha:
                                    sesion.fecha
                                        ? new Date(
                                            sesion.fecha
                                        )
                                        : null,

                                asistencia:
                                    sesion.asistencia

                            })
                        )

            })
        );


    window.registrosAsistencia =
        registrosAsistencia;


    /*
     * ----------------------------------------------------
     * RECUPERAR CONFIGURACIÓN DE GRUPOS
     * ----------------------------------------------------
     */

    const configuracionGuardada =
        localStorage.getItem(
            CLAVE_PERSISTENCIA_CONFIGURACION
        );


    if (configuracionGuardada) {

        const configuracion =
            JSON.parse(
                configuracionGuardada
            );


        configuracionGrupos.length = 0;

        configuracionGrupos.push(
            ...configuracion
        );


        window.configuracionGrupos =
            configuracionGrupos;

    }


    /*
     * ----------------------------------------------------
     * RECUPERAR SELECTOR DE GRUPOS
     * ----------------------------------------------------
     */

    if (
        configuracionGrupos &&
        configuracionGrupos.length > 0
    ) {

        cargarGruposEnSelector(
            configuracionGrupos
        );

    }


    /*
     * ----------------------------------------------------
     * MOSTRAR REGISTROS RECUPERADOS
     * ----------------------------------------------------
     */

    if (
        registrosAsistencia &&
        registrosAsistencia.length > 0
    ) {

        mostrarRegistrosAsistencia(
            registrosAsistencia
        );

    }


    console.log(
        "Registros de asistencia recuperados desde localStorage:",
        registrosAsistencia
    );


    console.log(
        "Configuración de grupos recuperada desde localStorage:",
        configuracionGrupos
    );


    return true;


} catch (error) {

    console.error(
        "Error al recuperar registros de asistencia:",
        error
    );


    return false;

}

}

/* ============================================================
   CALCULAR PORCENTAJES DE ASISTENCIA
============================================================ */

function calcularPorcentajesAsistencia(alumno) {

if (!alumno || !alumno.grupo) {
    return {
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };
}

/*
 * ------------------------------------------------
 * FECHA DE INICIO DEL CURSO DEL GRUPO
 * ------------------------------------------------
 */

const fechaInicioGrupo =
    obtenerPrimeraFechaGrupo(
        alumno.grupo
    );

if (!fechaInicioGrupo) {
    return {
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };
}

/*
 * ------------------------------------------------
 * TOTAL DE CLASES DEL GRUPO EN LOS 7 MESES
 * ------------------------------------------------
 */

const totalClases =
    calcularTotalClasesGrupo(
        alumno.grupo,
        fechaInicioGrupo
    );

if (totalClases <= 0) {
    return {
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };
}

/*
 * ------------------------------------------------
 * INICIO Y FIN DEL PERÍODO DEL CURSO
 * ------------------------------------------------
 */

const inicioCurso =
    new Date(fechaInicioGrupo);

inicioCurso.setHours(
    0,
    0,
    0,
    0
);

const finCurso =
    new Date(inicioCurso);

finCurso.setMonth(
    finCurso.getMonth() + 7
);

finCurso.setHours(
    0,
    0,
    0,
    0
);

/*
 * ------------------------------------------------
 * LUNES DE LA SEMANA ACTUAL
 * ------------------------------------------------
 */

const hoy =
    new Date();

hoy.setHours(
    0,
    0,
    0,
    0
);

const lunesActual =
    new Date(hoy);

const diaSemana =
    lunesActual.getDay();

const diferenciaLunes =
    diaSemana === 0
        ? 6
        : diaSemana - 1;

lunesActual.setDate(
    lunesActual.getDate() -
    diferenciaLunes
);

/*
 * ------------------------------------------------
 * CONTADORES DE INASISTENCIAS
 * ------------------------------------------------
 */

let inasistenciasEfectivas = 0;

let inasistenciasSemanaActual = 0;

/*
 * ------------------------------------------------
 * RECORRER SESIONES DEL ESTUDIANTE
 * ------------------------------------------------
 */

if (Array.isArray(alumno.sesiones)) {

    alumno.sesiones.forEach(
        sesion => {

            if (!sesion.fecha) {
                return;
            }

            if (
                String(sesion.asistencia)
                    .trim()
                    .toUpperCase() !== "A"
            ) {
                return;
            }

            const fecha =
                new Date(sesion.fecha);

            if (
                isNaN(
                    fecha.getTime()
                )
            ) {
                return;
            }

            fecha.setHours(
                0,
                0,
                0,
                0
            );

            /*
             * Fuera del período del curso
             */

            if (
                fecha < inicioCurso ||
                fecha >= finCurso
            ) {
                return;
            }

            /*
             * Inasistencia efectiva:
             * hasta el domingo de la semana anterior
             */

            if (
                fecha < lunesActual
            ) {

                inasistenciasEfectivas++;

                return;
            }

            /*
             * Inasistencia de la semana actual:
             * desde lunes hasta hoy
             */

            if (
                fecha >= lunesActual &&
                fecha <= hoy
            ) {

                inasistenciasSemanaActual++;
            }

        }
    );
}

/*
 * ------------------------------------------------
 * PORCENTAJES
 * ------------------------------------------------
 */

const inasistenciasProyectadas =
    inasistenciasEfectivas +
    inasistenciasSemanaActual;

const porcentajeEfectivo =
    (
        inasistenciasEfectivas /
        totalClases
    ) * 100;

const porcentajeProyectado =
    (
        inasistenciasProyectadas /
        totalClases
    ) * 100;

return {
    porcentajeEfectivo,
    porcentajeProyectado
};

}

/*
 * ------------------------------------------------
 * FECHA DE INICIO DEL CURSO DEL GRUPO
 * ------------------------------------------------
 */

const fechaInicioGrupo =
    obtenerPrimeraFechaGrupo(
        alumno.grupo
    );

if (!fechaInicioGrupo) {
    return {
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };
}

/*
 * ------------------------------------------------
 * TOTAL DE CLASES DEL GRUPO EN LOS 7 MESES
 * ------------------------------------------------
 */

const totalClases =
    calcularTotalClasesGrupo(
        alumno.grupo,
        fechaInicioGrupo
    );

if (totalClases <= 0) {
    return {
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };
}

/*
 * ------------------------------------------------
 * INICIO Y FIN DEL PERÍODO DEL CURSO
 * ------------------------------------------------
 */

const inicioCurso =
    new Date(fechaInicioGrupo);

inicioCurso.setHours(
    0,
    0,
    0,
    0
);

const finCurso =
    new Date(inicioCurso);

finCurso.setMonth(
    finCurso.getMonth() + 7
);

/*
 * ------------------------------------------------
 * FECHA DE HOY
 * ------------------------------------------------
 */

const hoy =
    new Date();

hoy.setHours(
    0,
    0,
    0,
    0
);

/*
 * ------------------------------------------------
 * LUNES DE LA SEMANA ACTUAL
 * ------------------------------------------------
 */

const lunesActual =
    new Date(hoy);

const diaSemana =
    lunesActual.getDay();

const diferenciaLunes =
    diaSemana === 0
        ? 6
        : diaSemana - 1;

lunesActual.setDate(
    lunesActual.getDate() -
    diferenciaLunes
);

lunesActual.setHours(
    0,
    0,
    0,
    0
);

/*
 * ------------------------------------------------
 * CONTADORES
 * ------------------------------------------------
 */

let inasistenciasEfectivas = 0;

let inasistenciasSemanaActual = 0;

/*
 * ------------------------------------------------
 * RECORRER LAS SESIONES DEL ESTUDIANTE
 * ------------------------------------------------
 */

if (Array.isArray(alumno.sesiones)) {

    alumno.sesiones.forEach(
        sesion => {

            if (!sesion.fecha) {
                return;
            }

            const fecha =
                new Date(
                    sesion.fecha
                );

            if (
                isNaN(
                    fecha.getTime()
                )
            ) {
                return;
            }

            fecha.setHours(
                0,
                0,
                0,
                0
            );

            /*
             * Solo cuentan las A
             */

            const asistencia =
                String(
                    sesion.asistencia || ""
                )
                    .trim()
                    .toUpperCase();

            if (asistencia !== "A") {
                return;
            }

            /*
             * No contar fechas fuera
             * del período del curso.
             */

            if (
                fecha < inicioCurso ||
                fecha >= finCurso
            ) {
                return;
            }

            /*
             * ------------------------------------------------
             * INASISTENCIA EFECTIVA
             *
             * Todo lo ocurrido antes del lunes
             * de la semana actual.
             * ------------------------------------------------
             */

            if (
                fecha < lunesActual
            ) {

                inasistenciasEfectivas++;

                return;
            }

            /*
             * ------------------------------------------------
             * INASISTENCIA PROYECTADA
             *
             * Desde el lunes actual
             * hasta HOY.
             * ------------------------------------------------
             */

            if (
                fecha >= lunesActual &&
                fecha <= hoy
            ) {

                inasistenciasSemanaActual++;

            }

        }
    );

}

/*
 * ------------------------------------------------
 * TOTAL PROYECTADO DE INASISTENCIAS
 * ------------------------------------------------
 */

const inasistenciasProyectadas =
    inasistenciasEfectivas +
    inasistenciasSemanaActual;

/*
 * ------------------------------------------------
 * PORCENTAJES
 * ------------------------------------------------
 */

const porcentajeEfectivo =
    (
        inasistenciasEfectivas /
        totalClases
    ) * 100;

const porcentajeProyectado =
    (
        inasistenciasProyectadas /
        totalClases
    ) * 100;

return {

    porcentajeEfectivo:
        porcentajeEfectivo,

    porcentajeProyectado:
        porcentajeProyectado

};

}


/* ============================================================
   MOSTRAR ASISTENCIAS EN PANTALLA
============================================================ */

function mostrarRegistrosAsistencia(
    registros
) {

    const contenedor =
        document.getElementById(
            "resultadoAsistencia"
        );

    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    if (!registros.length) {

        contenedor.textContent =
            "No se encontraron registros de asistencia.";

        return;

    }


    const tabla =
        document.createElement("table");

    tabla.style.width = "100%";
    tabla.style.borderCollapse =
        "collapse";


    /*
     * --------------------------------------------------------
     * OBTENER TODAS LAS FECHAS
     * --------------------------------------------------------
     */

    const fechas = [];

    registros.forEach(
        alumno => {

            alumno.sesiones.forEach(
                sesion => {

                    if (
                        sesion.fecha &&
                        !fechas.some(
                            fecha =>
                                fecha.getTime() ===
                                sesion.fecha.getTime()
                        )
                    ) {

                        fechas.push(
                            sesion.fecha
                        );

                    }

                }
            );

        }
    );


fechas.sort(
(a, b) =>
a.getTime() -
b.getTime()
);

/*

ENCABEZADO

*/

const filaEncabezado =
document.createElement("tr");

const encabezadoAlumno =
document.createElement("th");

encabezadoAlumno.textContent =
"Alumno";

encabezadoAlumno.style.color =
"white";

encabezadoAlumno.style.backgroundColor =
"#5c1d53";

encabezadoAlumno.style.position =
"sticky";

encabezadoAlumno.style.left =
"0";

encabezadoAlumno.style.top =
"0";

encabezadoAlumno.style.zIndex =
"5";

filaEncabezado.appendChild(
encabezadoAlumno
);

const encabezadoGrupo =
document.createElement("th");

encabezadoGrupo.textContent =
"Grupo";

filaEncabezado.appendChild(
encabezadoGrupo
);

/*

PORCENTAJE EFECTIVO

*/

const encabezadoEfectivo =
document.createElement("th");

encabezadoEfectivo.textContent =
"% efectivo";

filaEncabezado.appendChild(
encabezadoEfectivo
);

/*

PORCENTAJE PROYECTADO

*/

const encabezadoProyectado =
document.createElement("th");

encabezadoProyectado.textContent =
"% proyectado";

filaEncabezado.appendChild(
encabezadoProyectado
);

/*

FECHAS

*/

fechas.forEach(
fecha => {

    const th =
        document.createElement("th");

    th.textContent =
        fecha.toLocaleDateString();

    filaEncabezado.appendChild(
        th
    );

}

);

/*

JUSTIFICACIÓN

*/

const encabezadoJustificacion =
document.createElement("th");

encabezadoJustificacion.textContent =
"Justificación";

filaEncabezado.appendChild(
encabezadoJustificacion
);

/*

ENVIAR MENSAJE

*/

const encabezadoMensaje =
document.createElement("th");

encabezadoMensaje.textContent =
"Enviar mensaje";

filaEncabezado.appendChild(
encabezadoMensaje
);

/*

LLAMAR

*/

const encabezadoLlamar =
document.createElement("th");

encabezadoLlamar.textContent =
"Llamar";

filaEncabezado.appendChild(
encabezadoLlamar
);

tabla.appendChild(
filaEncabezado
);

/*

ALUMNOS

*/

registros.forEach(
alumno => {

    const fila =
        document.createElement("tr");


    /*
     * ------------------------------------------------
     * NOMBRE DEL ALUMNO
     * ------------------------------------------------
     */

    const celdaNombre =
        document.createElement("td");

    celdaNombre.textContent =
        `${alumno.apellidos} ${alumno.nombres}`;

    fila.appendChild(
        celdaNombre
    );


    /*
     * ------------------------------------------------
     * GRUPO
     * ------------------------------------------------
     */
const celdaGrupo =
    document.createElement("td");

celdaGrupo.textContent =
    alumno.grupo;

fila.appendChild(
    celdaGrupo
);


/*
 * ------------------------------------------------
 * CALCULAR PORCENTAJES
 * ------------------------------------------------
 */

const porcentajes =
    calcularPorcentajesAsistencia(
        alumno
    );


/*
 * ------------------------------------------------
 * PORCENTAJE EFECTIVO
 * ------------------------------------------------
 */

const celdaEfectivo =
    document.createElement("td");

celdaEfectivo.textContent =
    porcentajes.porcentajeEfectivo.toFixed(2) + "%";

fila.appendChild(
    celdaEfectivo
);


/*
 * ------------------------------------------------
 * PORCENTAJE PROYECTADO
 * ------------------------------------------------
 */

const celdaProyectado =
    document.createElement("td");

celdaProyectado.textContent =
    porcentajes.porcentajeProyectado.toFixed(2) + "%";

fila.appendChild(
    celdaProyectado
);


        /*
         * ------------------------------------------------
         * ASISTENCIAS
         * ------------------------------------------------
         */

        fechas.forEach(
            fecha => {

                const celda =
                    document.createElement("td");

                const sesion =
                    alumno.sesiones.find(
                        registro =>
                            registro.fecha &&
                            registro.fecha.getTime() ===
                            fecha.getTime()
                    );

                celda.textContent =
                    sesion
                        ? (
                            (sesion.asistencia || "?")
                                .charAt(0)
                        )
                        : "";

                fila.appendChild(
                    celda
                );

            }
        );

        /*
         * ------------------------------------------------
         * JUSTIFICACIÓN
         * ------------------------------------------------
         */

        const celdaJustificacion =
            document.createElement("td");

        const campoJustificacion =
            document.createElement("textarea");

        campoJustificacion.placeholder =
            "Escribir justificación...";

        campoJustificacion.rows =
            3;

        campoJustificacion.style.width =
            "220px";

        campoJustificacion.style.minHeight =
            "60px";

        campoJustificacion.style.resize =
            "vertical";

        campoJustificacion.style.boxSizing =
            "border-box";

        campoJustificacion.value =
            alumno.justificacion || "";

        campoJustificacion.addEventListener(
            "click",
            function(evento) {

                evento.stopPropagation();

            }
        );

        campoJustificacion.addEventListener(
            "input",
            function(evento) {

                evento.stopPropagation();

                alumno.justificacion =
                    campoJustificacion.value;

            }
        );

        celdaJustificacion.appendChild(
            campoJustificacion
        );

        fila.appendChild(
            celdaJustificacion
        );

const celdaMensaje = document.createElement("td");

const botonMensaje = document.createElement("button");

botonMensaje.type = "button";

botonMensaje.textContent = "Enviar mensaje";

botonMensaje.style.backgroundColor = "#178a75";
botonMensaje.style.color = "white";
botonMensaje.style.border = "none";
botonMensaje.style.padding = "8px 12px";
botonMensaje.style.borderRadius = "5px";
botonMensaje.style.cursor = "pointer";

botonMensaje.addEventListener("click", function(event) {

event.stopPropagation();

const telefono = alumno.telefono || alumno.celular || alumno.whatsapp;

if (!telefono) {
    alert("El estudiante no tiene un número de teléfono registrado.");
    return;
}

let numero = String(telefono).replace(/\D/g, "");

if (numero.startsWith("0")) {
    numero = "593" + numero.substring(1);
}

const urlWhatsApp =
    "whatsapp://send?phone=" + numero;

window.location.href = urlWhatsApp;

});

celdaMensaje.appendChild(botonMensaje);

fila.appendChild(celdaMensaje);

const celdaLlamar = document.createElement("td");

const botonLlamar = document.createElement("button");

botonLlamar.type = "button";

botonLlamar.textContent = "Llamar";

botonLlamar.style.backgroundColor = "#178a75";
botonLlamar.style.color = "white";
botonLlamar.style.border = "none";
botonLlamar.style.padding = "8px 12px";
botonLlamar.style.borderRadius = "5px";
botonLlamar.style.cursor = "pointer";

botonLlamar.addEventListener("click", function(event) {

event.stopPropagation();

const telefono = alumno.telefono || alumno.celular || alumno.whatsapp;

if (!telefono) {
    alert("El estudiante no tiene un número de teléfono registrado.");
    return;
}

let numero = String(telefono).replace(/\D/g, "");

if (numero.startsWith("0")) {
    numero = "593" + numero.substring(1);
}

const urlWhatsApp =
    "whatsapp://send?phone=" + numero;

window.location.href = urlWhatsApp;

});

celdaLlamar.appendChild(botonLlamar);

fila.appendChild(celdaLlamar);




        /*
         * ------------------------------------------------
         * SELECCIONAR ALUMNO
         * ------------------------------------------------
         */

        fila.style.cursor =
            "pointer";

        fila.addEventListener(
            "click",
            function() {

                /*
                 * Quitar selección anterior.
                 */

                tabla
                    .querySelectorAll(
                        "tr.fila-alumno-seleccionada"
                    )
                    .forEach(
                        filaSeleccionada => {

                            filaSeleccionada.classList.remove(
                                "fila-alumno-seleccionada"
                            );

                            filaSeleccionada.style.backgroundColor =
                                "";

                        }
                    );


                /*
                 * Seleccionar esta fila.
                 */

                fila.classList.add(
                    "fila-alumno-seleccionada"
                );

                fila.style.backgroundColor =
                    "#7fffd4";

            }
        );


        /*
         * ------------------------------------------------
         * AGREGAR FILA A LA TABLA
         * ------------------------------------------------
         */

        tabla.appendChild(
            fila
        );

    }
);

    /*
     * --------------------------------------------------------
     * ESTILO BÁSICO
     * --------------------------------------------------------
     */

tabla
    .querySelectorAll("th, td")
    .forEach(celda => {

        celda.style.border =
            "1px solid #ccc";

        celda.style.padding =
            "8px";

        celda.style.textAlign =
            "center";

        celda.style.whiteSpace =
            "nowrap";

    });


/*
 * --------------------------------------------------------
 * ALUMNO Y GRUPO ALINEADOS A LA IZQUIERDA
 * --------------------------------------------------------
 */

tabla
    .querySelectorAll("th:nth-child(1), td:nth-child(1), th:nth-child(2), td:nth-child(2)")
    .forEach(celda => {

        celda.style.textAlign =
            "left";

    });


    contenedor.appendChild(
        tabla
    );

}


/* ============================================================
   PROCESAR ARCHIVO EXCEL
============================================================ */

async function procesarArchivoExcel(file) {

    if (!file) {
        return;
    }


    mostrarEstado(
        "Leyendo archivo Excel..."
    );


    try {

        /*
         * ----------------------------------------------------
         * LEER ARCHIVO
         * ----------------------------------------------------
         */

        const arrayBuffer =
            await file.arrayBuffer();


        /*
         * ----------------------------------------------------
         * CREAR WORKBOOK
         * ----------------------------------------------------
         */

        const workbook =
            new ExcelJS.Workbook();


        await workbook.xlsx.load(
            arrayBuffer
        );


        /*
         * ----------------------------------------------------
         * MOSTRAR HOJAS EN CONSOLA
         * ----------------------------------------------------
         */

        console.log(
            "Hojas encontradas en el archivo:"
        );

        workbook.worksheets.forEach(hoja => {

            console.log(
                "-",
                hoja.name
            );

        });


        /*
         * ----------------------------------------------------
         * LEER CONFIGURACIÓN
         * ----------------------------------------------------
         */

        const configuraciones =
            leerConfiguracionGrupos(
                workbook
            );


        /*
         * ----------------------------------------------------
         * GUARDAR CONFIGURACIÓN
         * ----------------------------------------------------
         */

        configuracionGrupos.length = 0;

        configuracionGrupos.push(
            ...configuraciones
        );


        window.configuracionGrupos =
            configuracionGrupos;


        /*
         * ----------------------------------------------------
         * CARGAR SELECTOR
         * ----------------------------------------------------
         */

        cargarGruposEnSelector(
            configuracionGrupos
        );


        /*
         * ----------------------------------------------------
         * MOSTRAR EN CONSOLA
         * ----------------------------------------------------
         */

        mostrarConfiguracionEnConsola(
            configuracionGrupos
        );

       /*
 * ----------------------------------------------------
 * LEER REGISTROS DE ASISTENCIA
 * ----------------------------------------------------
 */

registrosAsistencia =
    leerRegistrosAsistencia(
        workbook
    );

window.registrosAsistencia =
    registrosAsistencia;


/*
 * ----------------------------------------------------
 * GUARDAR REGISTROS PERSISTENTES
 * ----------------------------------------------------
 */

guardarRegistrosAsistencia();


/*
 * ----------------------------------------------------
 * MOSTRAR ASISTENCIAS
 * ----------------------------------------------------
 */

mostrarRegistrosAsistencia(
    registrosAsistencia
);

console.log(
    "Registros de asistencia:",
    registrosAsistencia
);

        /*
         * ----------------------------------------------------
         * RESULTADO
         * ----------------------------------------------------
         */

        mostrarEstado(
            `Configuración cargada correctamente. ${configuracionGrupos.length} grupo(s) encontrado(s).`,
            "exito"
        );


    } catch (error) {

        console.error(
            "Error al procesar el archivo:",
            error
        );


        mostrarEstado(
            error.message ||
            "No fue posible procesar el archivo Excel.",
            "error"
        );

    }

}


/* ============================================================
   EVENTO: SELECCIONAR ARCHIVO
============================================================ */

if (archivoAsistencia) {

    archivoAsistencia.addEventListener(
        "change",
        async function() {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            await procesarArchivoExcel(
                file
            );

        }
    );

}

/*
 * ==================================================
 * BOTÓN PREPARAR INFORME
 * ==================================================
 */

document
    .getElementById("btnPrepararInforme")
    .addEventListener("click", function() {

        /*
         * ----------------------------------------------
         * OBTENER FECHA ACTUAL
         * ----------------------------------------------
         */

        const hoy = new Date();

        hoy.setHours(
            0,
            0,
            0,
            0
        );

        /*
         * ----------------------------------------------
         * CALCULAR EL LUNES DE LA SEMANA ACTUAL
         * ----------------------------------------------
         */

        const lunesActual =
            new Date(hoy);

        const diaSemana =
            hoy.getDay();

        const diasDesdeLunes =
            diaSemana === 0
                ? 6
                : diaSemana - 1;

        lunesActual.setDate(
            hoy.getDate() -
            diasDesdeLunes
        );

        /*
         * ----------------------------------------------
         * FORMATEAR FECHA INICIAL
         * ----------------------------------------------
         */

        const anioInicio =
            lunesActual.getFullYear();

        const mesInicio =
            String(
                lunesActual.getMonth() + 1
            ).padStart(2, "0");

        const diaInicio =
            String(
                lunesActual.getDate()
            ).padStart(2, "0");

        const fechaInicio =
            anioInicio +
            "-" +
            mesInicio +
            "-" +
            diaInicio;

        /*
         * ----------------------------------------------
         * FORMATEAR FECHA FINAL
         * ----------------------------------------------
         */

        const anioFin =
            hoy.getFullYear();

        const mesFin =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const diaFin =
            String(
                hoy.getDate()
            ).padStart(2, "0");

        const fechaFin =
            anioFin +
            "-" +
            mesFin +
            "-" +
            diaFin;

        /*
         * ----------------------------------------------
         * CONFIGURAR FILTROS
         * ----------------------------------------------
         */

        document
            .getElementById(
                "filtroAsistencia"
            )
            .value = "inasistentes";

        document
            .getElementById(
                "fechaInicio"
            )
            .value = fechaInicio;

        document
            .getElementById(
                "fechaFin"
            )
            .value = fechaFin;

        document
            .getElementById(
                "filtroGrupo"
            )
            .value = "todos";

        /*
         * ----------------------------------------------
         * ACTIVAR FILTRO
         * ----------------------------------------------
         */

        const btnFiltrar =
            document.getElementById(
                "btnFiltrar"
            );

        if (btnFiltrar) {

            btnFiltrar.click();

        }

    });



/* ============================================================
   BOTÓN FILTRAR
============================================================ */

const btnFiltrar =
    document.getElementById("btnFiltrar");


if (btnFiltrar) {

    btnFiltrar.addEventListener(
        "click",
        function() {

            /*
             * ------------------------------------------------
             * OBTENER FECHAS
             * ------------------------------------------------
             */

            const fechaInicioInput =
                document.getElementById(
                    "fechaInicio"
                ).value;

            const fechaFinInput =
                document.getElementById(
                    "fechaFin"
                ).value;


            /*
             * ------------------------------------------------
             * OBTENER ESTADO DE ASISTENCIA
             * ------------------------------------------------
             */

            const filtroEstado =
                document.getElementById(
                    "filtroAsistencia"
                ).value;

           const filtroGrupoSeleccionado =
             document.getElementById(
                 "filtroGrupo"
             ).value;


            /*
             * ------------------------------------------------
             * CONVERTIR FECHAS
             * ------------------------------------------------
             */

            const fechaInicio =
                fechaInicioInput
                    ? new Date(
                        fechaInicioInput +
                        "T00:00:00"
                    )
                    : null;

            const fechaFin =
                fechaFinInput
                    ? new Date(
                        fechaFinInput +
                        "T23:59:59"
                    )
                    : null;


            /*
             * ------------------------------------------------
             * FILTRAR SESIONES POR FECHA
             * ------------------------------------------------
             */

            const registrosFiltradosPorFecha =
                registrosAsistencia
                    .map(
                        alumno => {

                            const sesionesFiltradas =
                                alumno.sesiones.filter(
                                    sesion => {

                                        if (
                                            !sesion.fecha
                                        ) {
                                            return false;
                                        }

                                        if (
                                            fechaInicio &&
                                            sesion.fecha <
                                            fechaInicio
                                        ) {
                                            return false;
                                        }

                                        if (
                                            fechaFin &&
                                            sesion.fecha >
                                            fechaFin
                                        ) {
                                            return false;
                                        }

                                        return true;

                                    }
                                );


                            return {
                                ...alumno,
                                sesiones:
                                    sesionesFiltradas
                            };

                        }
                    )
                    .filter(
                        alumno =>
                            alumno.sesiones.length > 0
                    );


            /*
             * ------------------------------------------------
             * FILTRAR POR ESTADO DE ASISTENCIA
             *
             * ASISTENTE:
             * No tiene ninguna A dentro del período.
             *
             * INASISTENTE:
             * Tiene al menos una A dentro del período.
             * ------------------------------------------------
             */

const registrosFiltrados =
    registrosFiltradosPorFecha
        .filter(
            alumno => {

                /*
                 * ------------------------------------------------
                 * FILTRO POR ESTADO DE ASISTENCIA
                 * ------------------------------------------------
                 */

                const tieneInasistencia =
                    alumno.sesiones.some(
                        sesion => {

                            const asistencia =
                                String(
                                    sesion.asistencia || ""
                                )
                                    .trim()
                                    .toUpperCase();

                            return (
                                asistencia.charAt(0) ===
                                "A"
                            );

                        }
                    );


                /*
                 * TODOS
                 */

                if (
                    filtroEstado ===
                    "todos"
                ) {
                    return true;
                }


                /*
                 * ASISTENTES
                 *
                 * No tiene ninguna A.
                 */

                if (
                    filtroEstado ===
                    "asistentes"
                ) {
                    return !tieneInasistencia;
                }


                /*
                 * INASISTENTES
                 *
                 * Tiene al menos una A.
                 */

                if (
                    filtroEstado ===
                    "inasistentes"
                ) {
                    return tieneInasistencia;
                }


                return true;

            }
        )
        .filter(
            alumno => {

                /*
                 * ------------------------------------------------
                 * FILTRO POR GRUPO
                 * ------------------------------------------------
                 *
                 * "todos" = no filtrar por grupo.
                 * Cualquier otro valor = solamente ese grupo.
                 */

                if (
                    filtroGrupoSeleccionado ===
                    "todos"
                ) {
                    return true;
                }

                return (
                    alumno.grupo ===
                    filtroGrupoSeleccionado
                );

            }
        );


            /*
             * ------------------------------------------------
             * MOSTRAR RESULTADO
             * ------------------------------------------------
             */

            mostrarRegistrosAsistencia(
                registrosFiltrados
            );


            /*
             * ------------------------------------------------
             * MOSTRAR INFORMACIÓN EN CONSOLA
             * ------------------------------------------------
             */

            console.log(
                "Filtros aplicados:",
                {
                    fechaInicio:
                        fechaInicioInput ||
                        "sin límite",

                    fechaFin:
                        fechaFinInput ||
                        "sin límite",

                    estado:
                        filtroEstado,

                    registros:
                        registrosFiltrados
                }
            );

        }
    );

}

/* ============================================================
   BOTÓN LIMPIAR DATOS
============================================================ */

const btnLimpiarDatos =
    document.getElementById("btnLimpiarDatos");

if (btnLimpiarDatos) {

    btnLimpiarDatos.addEventListener(
        "click",
        function() {

            /*
             * ------------------------------------------------
             * CONFIRMAR ELIMINACIÓN
             * ------------------------------------------------
             */

            const confirmar =
                confirm(
                    "¿Está seguro de que desea borrar todos los datos de asistencia guardados?\n\n" +
                    "Esta acción eliminará los datos de la persistencia local " +
                    "y limpiará la información mostrada en pantalla."
                );

            if (!confirmar) {
                return;
            }

            /*
             * ------------------------------------------------
             * BORRAR PERSISTENCIA
             * ------------------------------------------------
             */

            localStorage.removeItem(
                CLAVE_PERSISTENCIA_ASISTENCIA
            );

            /*
             * ------------------------------------------------
             * BORRAR REGISTROS EN MEMORIA
             * ------------------------------------------------
             */

            registrosAsistencia = [];

            window.registrosAsistencia =
                registrosAsistencia;

            /*
             * ------------------------------------------------
             * LIMPIAR PANTALLA
             * ------------------------------------------------ */

            mostrarRegistrosAsistencia(
                registrosAsistencia
            );

            console.log(
                "Registros de asistencia eliminados de la persistencia."
            );

        }
    );

}


/* ============================================================
   INICIALIZACIÓN
============================================================ */

console.log(
    "Learning Bridge - nuevo sistema de asistencia cargado."
);

console.log(
    "Etapa 1: lectura de Configuracion-Grupos."
);


/*
 * ==================================================
 * RECUPERAR REGISTROS PERSISTENTES
 * ==================================================
 */

cargarRegistrosAsistenciaPersistidos();
