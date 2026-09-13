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

window.configuracionGrupos = configuracionGrupos;
window.registrosAsistencia = registrosAsistencia;


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


        console.log(
            "Registros de asistencia guardados en localStorage."
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


        mostrarRegistrosAsistencia(
            registrosAsistencia
        );


        console.log(
            "Registros de asistencia recuperados desde localStorage:",
            registrosAsistencia
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

    /*
     * --------------------------------------------------------
     * VALIDAR DATOS DEL ALUMNO
     * --------------------------------------------------------
     */

    if (
        !alumno ||
        !alumno.grupo ||
        !Array.isArray(alumno.sesiones) ||
        alumno.sesiones.length === 0
    ) {

        return {
            totalClasesPeriodo: 0,
            inasistenciasEfectivas: 0,
            inasistenciasSemanaActual: 0,
            porcentajeEfectivo: 0,
            porcentajeProyectado: 0
        };

    }


    /*
     * --------------------------------------------------------
     * OBTENER DÍAS DE CLASE DEL GRUPO
     * --------------------------------------------------------
     */

    const configuracion =
        configuracionGrupos.find(
            configuracion =>
                configuracion.grupo === alumno.grupo
        );


    if (!configuracion) {

        console.warn(
            "No se encontró configuración para el grupo:",
            alumno.grupo
        );

        return {
            totalClasesPeriodo: 0,
            inasistenciasEfectivas: 0,
            inasistenciasSemanaActual: 0,
            porcentajeEfectivo: 0,
            porcentajeProyectado: 0
        };

    }


    /*
     * --------------------------------------------------------
     * CONVERTIR DÍAS DE CLASE A NÚMEROS DE JAVASCRIPT
     *
     * JavaScript:
     *
     * 0 = domingo
     * 1 = lunes
     * 2 = martes
     * 3 = miércoles
     * 4 = jueves
     * 5 = viernes
     * 6 = sábado
     * --------------------------------------------------------
     */

    const diasClase = [];

    DIAS_SEMANA.forEach(
        (dia, indice) => {

            if (
                configuracion.dias[dia] === true
            ) {

                diasClase.push(
                    indice === 6
                        ? 0
                        : indice + 1
                );

            }

        }
    );


    if (diasClase.length === 0) {

        return {
            totalClasesPeriodo: 0,
            inasistenciasEfectivas: 0,
            inasistenciasSemanaActual: 0,
            porcentajeEfectivo: 0,
            porcentajeProyectado: 0
        };

    }


/*
 * --------------------------------------------------------
 * OBTENER PRIMERA FECHA DEL PERÍODO
 *
 * La fecha inicial corresponde a la primera sesión
 * registrada para TODO EL GRUPO en el archivo de asistencia.
 *
 * No se utiliza la primera fecha individual del alumno.
 * --------------------------------------------------------
 */

const registrosGrupo =
    registrosAsistencia.filter(
        registro =>
            registro.grupo === alumno.grupo
    );


const fechasGrupo = [];

registrosGrupo.forEach(
    registro => {

        if (
            !Array.isArray(
                registro.sesiones
            )
        ) {
            return;
        }


        registro.sesiones.forEach(
            sesion => {

                if (
                    !(sesion.fecha instanceof Date)
                ) {
                    return;
                }


                const fecha =
                    new Date(
                        sesion.fecha.getFullYear(),
                        sesion.fecha.getMonth(),
                        sesion.fecha.getDate()
                    );


                if (
                    !isNaN(
                        fecha.getTime()
                    )
                ) {

                    fechasGrupo.push(
                        fecha
                    );

                }

            }
        );

    }
);


if (fechasGrupo.length === 0) {

    return {
        totalClasesPeriodo: 0,
        inasistenciasEfectivas: 0,
        inasistenciasSemanaActual: 0,
        porcentajeEfectivo: 0,
        porcentajeProyectado: 0
    };

}


fechasGrupo.sort(
    (a, b) =>
        a.getTime() -
        b.getTime()
);


const primeraFecha =
    fechasGrupo[0];


    /*
     * --------------------------------------------------------
     * PERÍODO DE 7 MESES
     *
     * Si comienza el 01/01/2026:
     *
     * 01/01/2026 <= fecha < 01/08/2026
     *
     * --------------------------------------------------------
     */

    const fechaFinPeriodo =
        new Date(
            primeraFecha.getFullYear(),
            primeraFecha.getMonth() + 7,
            primeraFecha.getDate()
        );


    /*
     * --------------------------------------------------------
     * CONTAR TODAS LAS CLASES PROGRAMADAS
     * EN LOS 7 MESES
     * --------------------------------------------------------
     */

    let totalClasesPeriodo = 0;

    const fechaPeriodo =
        new Date(primeraFecha);


    while (
        fechaPeriodo < fechaFinPeriodo
    ) {

        if (
            diasClase.includes(
                fechaPeriodo.getDay()
            )
        ) {

            totalClasesPeriodo++;

        }

        fechaPeriodo.setDate(
            fechaPeriodo.getDate() + 1
        );

    }


    /*
     * --------------------------------------------------------
     * FECHA ACTUAL
     * --------------------------------------------------------
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
     * --------------------------------------------------------
     * ENCONTRAR EL LUNES DE LA SEMANA ACTUAL
     *
     * Todo lo anterior al lunes pertenece al porcentaje
     * EFECTIVO.
     *
     * Desde el lunes hasta hoy pertenece al porcentaje
     * PROYECTADO.
     * --------------------------------------------------------
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

    lunesActual.setHours(
        0,
        0,
        0,
        0
    );


    /*
     * --------------------------------------------------------
     * CONTAR INASISTENCIAS EFECTIVAS
     *
     * SOLAMENTE "A".
     *
     * Se cuentan las A anteriores al lunes actual.
     * --------------------------------------------------------
     */

let inasistenciasEfectivas = 0;

alumno.sesiones.forEach(
    sesion => {

        if (
            !(sesion.fecha instanceof Date)
        ) {
            return;
        }

        const fecha =
            new Date(
                sesion.fecha.getFullYear(),
                sesion.fecha.getMonth(),
                sesion.fecha.getDate()
            );

        const asistencia =
            String(
                sesion.asistencia || ""
            )
                .trim()
                .toUpperCase()
                .charAt(0);


        if (
            fecha >= primeraFecha &&
            fecha < fechaFinPeriodo &&
            fecha < lunesActual &&
            asistencia === "A"
        ) {

            inasistenciasEfectivas++;

        }

    }
);


    /*
     * --------------------------------------------------------
     * CONTAR INASISTENCIAS DE LA SEMANA ACTUAL
     *
     * Desde el lunes actual hasta hoy.
     * --------------------------------------------------------
     */

let inasistenciasSemanaActual = 0;

alumno.sesiones.forEach(
    sesion => {

        if (
            !(sesion.fecha instanceof Date)
        ) {
            return;
        }

        const fecha =
            new Date(
                sesion.fecha.getFullYear(),
                sesion.fecha.getMonth(),
                sesion.fecha.getDate()
            );

        const asistencia =
            String(
                sesion.asistencia || ""
            )
                .trim()
                .toUpperCase()
                .charAt(0);


        if (
            fecha >= primeraFecha &&
            fecha < fechaFinPeriodo &&
            fecha >= lunesActual &&
            fecha <= hoy &&
            asistencia === "A"
        ) {

            inasistenciasSemanaActual++;

        }

    }
);


    /*
     * --------------------------------------------------------
     * CALCULAR PORCENTAJE EFECTIVO
     * --------------------------------------------------------
     */

    const porcentajeEfectivo =
        totalClasesPeriodo > 0
            ? (
                inasistenciasEfectivas /
                totalClasesPeriodo
            ) * 100
            : 0;


    /*
     * --------------------------------------------------------
     * CALCULAR PORCENTAJE PROYECTADO
     * --------------------------------------------------------
     */

    const totalInasistenciasProyectadas =
        inasistenciasEfectivas +
        inasistenciasSemanaActual;


    const porcentajeProyectado =
        totalClasesPeriodo > 0
            ? (
                totalInasistenciasProyectadas /
                totalClasesPeriodo
            ) * 100
            : 0;


    /*
     * --------------------------------------------------------
     * RESULTADO
     * --------------------------------------------------------
     */

    return {

        totalClasesPeriodo,

        inasistenciasEfectivas,

        inasistenciasSemanaActual,

        porcentajeEfectivo,

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
     * --------------------------------------------------------
     * ENCABEZADO
     * --------------------------------------------------------
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


    fechas.forEach(
        fecha => {

            const th =
                document.createElement("th");

            th.textContent =
                fecha.toLocaleDateString(
                    "es-EC"
                );

            filaEncabezado.appendChild(
                th
            );

        }
    );


    tabla.appendChild(
        filaEncabezado
    );


   /*
 * --------------------------------------------------------
 * ALUMNOS
 * --------------------------------------------------------
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
