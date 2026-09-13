/*
 * ============================================================
 * LEARNING BRIDGE
 * MODELOS DE MENSAJES DE INASISTENCIA
 * ============================================================
 *
 * Archivo:
 * learningbridge/mensajes-inasistencia.js
 *
 * Este archivo contiene exclusivamente los modelos de
 * mensajes de inasistencia.
 *
 * Los datos variables son recibidos mediante "datos":
 *
 * datos.primerNombre
 * datos.textoDiasInasistencias
 * datos.porcentajeActual
 * datos.porcentajeProyectado
 * ============================================================
 */


const modelosMensajeInasistencia = [

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


/*
 * ============================================================
 * GENERAR MENSAJE
 * ============================================================
 */

function generarMensajeInasistencia(datos) {

    if (
        !Array.isArray(
            modelosMensajeInasistencia
        ) ||
        modelosMensajeInasistencia.length === 0
    ) {
        return "";
    }

    const indiceModelo =
        Math.floor(
            Math.random() *
            modelosMensajeInasistencia.length
        );

    return modelosMensajeInasistencia[
        indiceModelo
    ](
        datos
    );

}


/*
 * ============================================================
 * DISPONER LA FUNCIÓN PARA reporte.js
 * ============================================================
 */

window.generarMensajeInasistencia =
    generarMensajeInasistencia;
