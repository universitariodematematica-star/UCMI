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

/* ============================================================
   MESES EN ESPAÑOL (PARA FORMATEAR FECHAS EN LOS MENSAJES)
============================================================ */

const MESES_ESPANOL = [
"enero",
"febrero",
"marzo",
"abril",
"mayo",
"junio",
"julio",
"agosto",
"septiembre",
"octubre",
"noviembre",
"diciembre"
];

/* ============================================================
   PLANTILLAS DE MENSAJES DE INASISTENCIA
============================================================ */

const mensajesInasistencia = [

    function(datos) {

        return `Hola, ${datos.primerNombre}. Esta semana tuvimos registro de inasistencias tuyas los días ${datos.textoDiasInasistencias}. Queremos avisarte con tiempo para que puedas revisar la situación y, si corresponde, **justificar estas inasistencias**. Actualmente acumulas un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias**. Las ausencias que sean justificadas dejarán de contabilizarse. En caso de no justificarlas, tu porcentaje podría llegar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Es importante que tengas presente que al alcanzar el **10 % de inasistencias se pierde el curso**. Puedes realizar la justificación hasta el domingo a las 11 AM. Luego de ese momento se enviará el reporte de inasistencia y las nuevas faltas quedarán registradas. Esperamos que puedas acompañarnos con mayor regularidad en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos compartir contigo una observación sobre tu asistencia. Durante esta semana registraste inasistencias los días ${datos.textoDiasInasistencias}. Actualmente cuentas con un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si alguna de estas ausencias fue por una razón justificable, todavía puedes **presentar la justificación hasta el domingo a las 11 AM**. Las inasistencias justificadas dejan de formar parte del porcentaje de inasistencia. Si no son justificadas, tu porcentaje podría subir al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que el límite es del **10 % de inasistencias; al alcanzarlo se pierde el curso**. Después del domingo a las 11 AM se enviará el reporte y las nuevas faltas permanecerán contabilizadas. Queremos verte avanzar, así que esperamos contar contigo en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Notamos que esta semana no pudiste asistir a las clases de los días ${datos.textoDiasInasistencias}. Queremos aprovechar este mensaje para recordarte que aún puedes revisar y justificar las ausencias que correspondan. En este momento tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Las faltas que sean justificadas dejarán de contabilizarse. Si no se justifican, tu porcentaje aumentaría al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Ten mucho presente que el **10 % de inasistencias representa la pérdida del curso**. El plazo para justificar es hasta el domingo a las 11 AM. Después de esa hora se enviará el reporte de inasistencia y las nuevas faltas quedarán registradas. Esperamos que esta semana puedas retomar tus clases con normalidad.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos saber que estás bien y, al mismo tiempo, llamarte la atención sobre tu asistencia. Esta semana registramos inasistencias los días ${datos.textoDiasInasistencias}. Tu porcentaje actual de inasistencias es de **${datos.porcentajeActual.toFixed(2).replace(".", ",")} %**. Si las ausencias tienen una razón que pueda ser justificada, te recomendamos realizar la **justificación antes del domingo a las 11 AM**. Las inasistencias justificadas ya no se contabilizarán. Si no justificas estas faltas, tu porcentaje podría alcanzar el **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que al llegar al **10 % de inasistencias se pierde el curso**. Después del domingo a las 11 AM se enviará el reporte correspondiente. Esperamos que puedas continuar asistiendo regularmente y seguir avanzando con nosotros.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Revisamos los registros de asistencia y esta semana aparecen inasistencias correspondientes a ${datos.textoDiasInasistencias}. Queremos avisarte antes de cerrar el reporte para que tengas la oportunidad de revisar estas faltas. Actualmente tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si alguna de ellas debe ser justificada, puedes hacerlo hasta el domingo a las 11 AM. Una vez justificadas, dejarán de contabilizarse. Si no realizas la justificación, tu porcentaje acumulado subiría al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que alcanzar el **10 % de inasistencias significa perder el curso**. Después del plazo indicado se enviará el reporte de inasistencia. Esperamos que puedas acompañarnos en las próximas clases y mantener una asistencia constante.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Te escribimos porque durante esta semana registramos inasistencias tuyas los días ${datos.textoDiasInasistencias}. Sabemos que pueden existir circunstancias que impidan asistir, por eso queremos darte la oportunidad de **justificar las faltas que correspondan**. Actualmente acumulas un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias**. Las inasistencias justificadas dejan de contabilizarse. Si no justificas las de esta semana, tu porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que el máximo permitido es el **10 % de inasistencias; al alcanzar este porcentaje se pierde el curso**. Puedes justificar hasta el domingo a las 11 AM. Después de esa hora se enviará el reporte y las nuevas inasistencias quedarán contabilizadas. ¡Esperamos verte nuevamente en clase!`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Esta semana tu registro muestra inasistencias los días ${datos.textoDiasInasistencias}. Queremos informarte para que puedas tomar las medidas necesarias y evitar que estas faltas afecten tu porcentaje de asistencia. Actualmente tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si corresponde, recuerda **justificar las inasistencias antes del domingo a las 11 AM**. Las faltas justificadas dejarán de contabilizarse. De no justificarlas, tu porcentaje podría subir al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Ten presente que al llegar al **10 % de inasistencias se pierde el curso**. Una vez cumplido el plazo, se enviará el reporte de inasistencia y las nuevas faltas quedarán registradas. Esperamos que puedas continuar asistiendo con regularidad y avanzar satisfactoriamente en tu curso.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos recordarte que esta semana aparecen inasistencias en tu registro correspondientes a los días ${datos.textoDiasInasistencias}. Actualmente tu porcentaje de inasistencias acumuladas es de **${datos.porcentajeActual.toFixed(2).replace(".", ",")} %**. Si alguna de estas faltas tiene una justificación, te pedimos que la presentes antes del domingo a las 11 AM. Una vez justificadas, las inasistencias dejan de contabilizarse. Si no se justifican, el porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que el **10 % de inasistencias es el límite para conservar el curso**. Después del domingo a las 11 AM se enviará el reporte y las nuevas inasistencias quedarán registradas. Estamos seguros de que puedes retomar el ritmo. ¡Te esperamos en las próximas clases!`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Durante esta semana registramos que no asististe los días ${datos.textoDiasInasistencias}. Queremos hacerte llegar esta información antes de que se cierre el reporte para que puedas revisar tu situación. En este momento acumulas un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias**. Si las faltas corresponden a situaciones justificables, puedes **presentar la justificación hasta el domingo a las 11 AM**. Las inasistencias justificadas dejarán de contabilizarse. Si no se justifican, el porcentaje podría subir al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que al alcanzar el **10 % de inasistencias se pierde el curso**. Después del domingo a las 11 AM se enviará el reporte definitivo de inasistencia. Esperamos contar contigo nuevamente en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Hemos revisado tu asistencia y queremos avisarte que esta semana se registraron inasistencias los días ${datos.textoDiasInasistencias}. Tu porcentaje actual es de **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si alguna de estas faltas debe ser justificada, recuerda hacerlo antes del domingo a las 11 AM. Las faltas justificadas dejarán de contabilizarse como inasistencias. Si no realizas la justificación, tu porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Es importante recordar que al llegar al **10 % de inasistencias se pierde el curso**. Una vez terminado el plazo se enviará el reporte y las nuevas inasistencias permanecerán registradas. Queremos que sigas avanzando con nosotros, así que esperamos verte en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos ponerte al tanto de tu asistencia esta semana. Se registraron inasistencias los días ${datos.textoDiasInasistencias}. Actualmente tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si existe alguna razón que permita justificar estas faltas, todavía estás a tiempo de hacerlo. El plazo termina el domingo a las 11 AM. Las inasistencias justificadas dejarán de contabilizarse; si no son justificadas, tu porcentaje podría subir al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que alcanzar el **10 % de inasistencias implica la pérdida del curso**. Después de las 11 AM del domingo se enviará el reporte correspondiente y las nuevas faltas quedarán registradas. Esperamos que puedas asistir regularmente a las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Esta semana tuvimos algunas inasistencias registradas a tu nombre, específicamente los días ${datos.textoDiasInasistencias}. Queremos informarte para que puedas revisar si alguna de ellas necesita ser justificada. Tu porcentaje actual de inasistencias es de **${datos.porcentajeActual.toFixed(2).replace(".", ",")} %**. Puedes presentar las justificaciones correspondientes hasta el domingo a las 11 AM; después de ese momento se enviará el reporte. Las inasistencias justificadas dejarán de contabilizarse. Si no justificas estas faltas, tu porcentaje podría quedar en **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que con un **10 % de inasistencias se pierde el curso**. Esperamos que esta información te ayude a tomar las medidas necesarias y que podamos contar contigo en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos hacerte llegar un aviso relacionado con tu asistencia. Durante esta semana aparecen inasistencias los días ${datos.textoDiasInasistencias}. Actualmente acumulas un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias**. Si alguna de estas ausencias tiene una justificación, recuerda que puedes presentarla hasta el domingo a las 11 AM. Una vez justificadas, esas faltas dejarán de contabilizarse. Si permanecen sin justificar, tu porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Ten presente que al alcanzar el **10 % de inasistencias se pierde el curso**. Después del domingo a las 11 AM se enviará el reporte y las nuevas inasistencias quedarán registradas. Ojalá puedas acompañarnos regularmente en las próximas clases y continuar avanzando en tu proceso.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Notamos algunas ausencias en tu registro de esta semana: ${datos.textoDiasInasistencias}. Antes de cerrar el reporte queremos recordarte que puedes **justificar las inasistencias que correspondan hasta el domingo a las 11 AM**. Actualmente tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Las faltas justificadas dejarán de contabilizarse. Si no son justificadas, tu porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que el **10 % de inasistencias es el límite establecido y al alcanzarlo se pierde el curso**. Después del domingo a las 11 AM se enviará el reporte y las nuevas inasistencias quedarán registradas. Esperamos que puedas regularizar tu asistencia y continuar participando en las próximas clases.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Esta semana registramos inasistencias correspondientes a los días ${datos.textoDiasInasistencias} y queremos avisarte antes de que se cierre el periodo de justificación. Actualmente tu porcentaje acumulado es de **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias**. Si alguna de estas faltas puede justificarse, tienes hasta el domingo a las 11 AM para hacerlo. Una vez justificadas, dejarán de contabilizarse como inasistencias. Si no realizas la justificación, tu porcentaje podría subir al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que al alcanzar el **10 % de inasistencias se pierde el curso**. Después de las 11 AM del domingo se enviará el reporte de inasistencia y las nuevas faltas quedarán registradas. Esperamos que puedas estar presente en las próximas clases y seguir adelante con tu curso.`;

    },

    function(datos) {

        return `Hola, ${datos.primerNombre}. Queremos llamar tu atención sobre un aspecto importante de esta semana: registramos inasistencias los días ${datos.textoDiasInasistencias}. En este momento tienes un **${datos.porcentajeActual.toFixed(2).replace(".", ",")} % de inasistencias acumuladas**. Si estas ausencias tienen una causa que pueda justificarse, te recomendamos presentar la justificación antes del domingo a las 11 AM. Las inasistencias justificadas dejarán de contabilizarse. Si no son justificadas, tu porcentaje podría aumentar al **${datos.porcentajeProyectado.toFixed(2).replace(".", ",")} %**. Recuerda que el **10 % de inasistencias representa la pérdida del curso**. Una vez terminado el plazo, se enviará el reporte y las nuevas inasistencias quedarán registradas. Esperamos que puedas recuperar la regularidad en tu asistencia y que sigamos contando contigo.`;

    }

];

/* ============================================================
   OBTENER EL LUNES DE LA SEMANA ACTUAL (00:00)
============================================================ */

function obtenerLunesActualParaMensajes() {

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    const diaSemana = hoy.getDay();

    const diferenciaLunes =
        diaSemana === 0
            ? 6
            : diaSemana - 1;

    const lunes = new Date(hoy);

    lunes.setDate(hoy.getDate() - diferenciaLunes);

    lunes.setHours(0, 0, 0, 0);

    return lunes;

}

/* ============================================================
   OBTENER LOS DÍAS DE INASISTENCIA DE LA SEMANA ACTUAL
   (del lunes más reciente hasta hoy)
============================================================ */

function obtenerDiasInasistenciaSemanaActual(alumno) {

    if (!alumno || !Array.isArray(alumno.sesiones)) {
        return [];
    }

    const lunesActual = obtenerLunesActualParaMensajes();

    const hoy = new Date();

    hoy.setHours(23, 59, 59, 999);

    const fechas = [];

    alumno.sesiones.forEach(sesion => {

        if (!sesion.fecha) {
            return;
        }

        const fecha = new Date(sesion.fecha);

        if (isNaN(fecha.getTime())) {
            return;
        }

        fecha.setHours(0, 0, 0, 0);

        if (fecha < lunesActual || fecha > hoy) {
            return;
        }

        const asistencia =
            String(sesion.asistencia || "")
                .trim()
                .toUpperCase();

        if (!asistencia.startsWith("A")) {
            return;
        }

        fechas.push(fecha);

    });

    fechas.sort((a, b) => a - b);

    return fechas;

}

/* ============================================================
   FORMATEAR UNA FECHA COMO "lunes 8 de septiembre"
============================================================ */

function formatearFechaEnEspanol(fecha) {

    const nombreDia =
        DIAS_SEMANA_CALCULO[fecha.getDay()].toLowerCase();

    const dia = fecha.getDate();

    const mes = MESES_ESPANOL[fecha.getMonth()];

    return `${nombreDia} ${dia} de ${mes}`;

}

/* ============================================================
   FORMATEAR LA LISTA COMPLETA DE DÍAS DE INASISTENCIA
============================================================ */

function formatearListaDiasInasistencia(fechas) {

    const textos = fechas.map(formatearFechaEnEspanol);

    if (textos.length === 0) {
        return "";
    }

    if (textos.length === 1) {
        return textos[0];
    }

    const ultimo = textos[textos.length - 1];

    const anteriores = textos.slice(0, -1);

    return anteriores.join(", ") + " y " + ultimo;

}

/* ============================================================
   OBTENER EL PRIMER NOMBRE, CON FORMATO "Carlos"
============================================================ */

function obtenerPrimerNombreFormateado(nombreCompleto) {

    const primeraPalabra =
        String(nombreCompleto || "")
            .trim()
            .split(/\s+/)[0] || "";

    if (!primeraPalabra) {
        return "";
    }

    return (
        primeraPalabra.charAt(0).toUpperCase() +
        primeraPalabra.slice(1).toLowerCase()
    );

}

/* ============================================================
   CONVERTIR **negrita** (markdown) A *negrita* (formato WhatsApp)
============================================================ */

function convertirNegritasWhatsApp(texto) {

    return String(texto || "").replace(/\*\*(.+?)\*\*/g, "*$1*");

}

/* ============================================================
   GENERAR EL MENSAJE DE INASISTENCIA PARA UN ALUMNO
   Devuelve "" si el alumno no tiene inasistencias esta semana.
============================================================ */

function generarMensajeInasistencia(alumno) {

    const diasInasistencia =
        obtenerDiasInasistenciaSemanaActual(alumno);

    if (diasInasistencia.length === 0) {
        return "";
    }

    const porcentajes =
        calcularPorcentajesAsistencia(alumno);

    const datos = {

        primerNombre:
            obtenerPrimerNombreFormateado(alumno.nombres),

        textoDiasInasistencias:
            formatearListaDiasInasistencia(diasInasistencia),

        porcentajeActual:
            porcentajes.porcentajeEfectivo,

        porcentajeProyectado:
            porcentajes.porcentajeProyectado

    };

    const indiceAleatorio =
        Math.floor(Math.random() * mensajesInasistencia.length);

    const plantillaElegida =
        mensajesInasistencia[indiceAleatorio];

    return convertirNegritasWhatsApp(plantillaElegida(datos));

}

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

while (

    fechaActual <

    fechaFinCurso

) {

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


    configuraciones.forEach(configuracion => {

    });


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

            telefono:
                alumno.telefono,

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

            telefono:
                alumno.telefono || "",

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
 * CONTADORES DE INASISTENCIAS
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
            
            if (!asistencia.startsWith("A")) {
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

TOTAL PROYECTADO DE INASISTENCIAS

*/

const inasistenciasProyectadas =
inasistenciasEfectivas +
inasistenciasSemanaActual;

/*

PORCENTAJES

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

/*
 * ------------------------------------------------
 * PORCENTAJE EFECTIVO
 * ------------------------------------------------
 */

const encabezadoEfectivo =
    document.createElement("th");

encabezadoEfectivo.textContent =
    "% efectivo";

filaEncabezado.appendChild(
    encabezadoEfectivo
);

/*
 * ------------------------------------------------
 * PORCENTAJE PROYECTADO
 * ------------------------------------------------
 */

const encabezadoProyectado =
    document.createElement("th");

encabezadoProyectado.textContent =
    "% proyectado";

filaEncabezado.appendChild(
    encabezadoProyectado
);

/*
 * ------------------------------------------------
 * FECHAS
 * ------------------------------------------------
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
 * ------------------------------------------------
 * JUSTIFICACIÓN
 * ------------------------------------------------
 */

const encabezadoJustificacion =
    document.createElement("th");

encabezadoJustificacion.textContent =
    "Justificación";

filaEncabezado.appendChild(
    encabezadoJustificacion
);

/*
 * ------------------------------------------------
 * ENVIAR MENSAJE
 * ------------------------------------------------
 */

const encabezadoMensaje =
    document.createElement("th");

encabezadoMensaje.textContent =
    "Enviar mensaje";

filaEncabezado.appendChild(
    encabezadoMensaje
);

/*
 * ------------------------------------------------
 * LLAMAR
 * ------------------------------------------------
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
 * ------------------------------------------------
 * ALUMNOS
 * ------------------------------------------------
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

botonMensaje.dataset.tipoBoton = "mensaje";

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

const mensaje =
    generarMensajeInasistencia(alumno);

function marcarMensajeComoEnviado() {

    botonMensaje.style.backgroundColor = "#dc2626";

    botonMensaje.textContent = "Mensaje enviado";

    botonMensaje.disabled = true;

}

if (!mensaje) {

    window.location.href = urlWhatsApp;

    marcarMensajeComoEnviado();

    return;

}

if (
    navigator.clipboard &&
    navigator.clipboard.writeText
) {

    navigator.clipboard.writeText(mensaje)
        .then(function() {

            mostrarEstado(
                "Mensaje copiado. Pégalo en el chat de WhatsApp y presiona enviar.",
                "exito"
            );

        })
        .catch(function(error) {

            console.error(
                "No se pudo copiar el mensaje al portapapeles:",
                error
            );

        });

}

window.location.href = urlWhatsApp;

marcarMensajeComoEnviado();

});

celdaMensaje.appendChild(botonMensaje);

fila.appendChild(celdaMensaje);

const celdaLlamar = document.createElement("td");

const botonLlamar = document.createElement("button");

botonLlamar.type = "button";

botonLlamar.textContent = "Llamar";

botonLlamar.dataset.tipoBoton = "llamada";

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

const urlLlamada =
    "whatsapp://send?phone=" + numero;

window.location.href = urlLlamada;

botonLlamar.style.backgroundColor = "#dc2626";

botonLlamar.textContent = "Llamada hecha";

botonLlamar.disabled = true;

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

        workbook.worksheets.forEach(hoja => {

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

for (
const alumno of registrosAsistencia
) {

if (!alumno.studentId) {

    alumno.telefono =
        "";

    continue;

}

alumno.telefono =
    await window.obtenerTelefonoAlumnoFirebase(
        alumno.studentId
    );

}

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

        }
    );

}


/* ============================================================
   INICIALIZACIÓN
============================================================ */


/*
 * ==================================================
 * RECUPERAR REGISTROS PERSISTENTES
 * ==================================================
 */

cargarRegistrosAsistenciaPersistidos();
