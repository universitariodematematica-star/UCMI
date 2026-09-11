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

            console.log(
                "Filtro seleccionado:",
                filtroGrupo
                    ? filtroGrupo.value
                    : null
            );

            console.log(
                "Configuración actual:",
                configuracionGrupos
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
