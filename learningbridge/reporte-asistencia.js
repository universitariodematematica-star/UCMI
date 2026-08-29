/*
 * ==================================================
 * REPORTE DE ASISTENCIA
 * ==================================================
 */

document
    .getElementById("btnDescargarExcel")
    .addEventListener("click", async function() {

        /*
         * ----------------------------------------------
         * OBTENER REGISTROS Y GRUPOS
         * ----------------------------------------------
         */

        const registros =
            window.registrosAsistencia || [];

        const grupos = [
            ...new Set(
                registros
                    .map(alumno => alumno.grupo)
                    .filter(grupo => grupo)
            )
        ];

        console.log(
            "REGISTROS DISPONIBLES:",
            registros
        );

        console.log(
            "GRUPOS ENCONTRADOS:",
            grupos
        );


        /*
         * ----------------------------------------------
         * CREAR LIBRO
         * ----------------------------------------------
         */

        const libro =
            new ExcelJS.Workbook();


        /*
         * ----------------------------------------------
         * CREAR UNA HOJA POR GRUPO
         * ----------------------------------------------
         */

const respuestaLogo = await fetch("lb-logo.png");
const datosLogo = await respuestaLogo.arrayBuffer();

const imagenLogo = libro.addImage({
    buffer: datosLogo,
    extension: "png"
});
        
grupos.forEach(grupo => {

    const hoja =
        libro.addWorksheet(grupo);

    /*
     * LOGO
     */

    hoja.addImage(imagenLogo, {
        tl: { col: 0, row: 0 },
        br: { col: 3, row: 9 }
    });


    /*
     * TÍTULO
     */

    hoja.getCell("C11").value =
        "CONTROL DE ASISTENCIA Y PUNTUALIDAD";

    hoja.getCell("C11").font = {
        bold: true
    };


    /*
     * GRUPO
     */

    hoja.getCell("A13").value =
        `GRUPO: ${grupo}`;

    hoja.getCell("A13").font = {
        bold: true
    };


    /*
     * NOMBRES Y APELLIDOS
     */

    hoja.getCell("A15").value =
        "NOMBRES Y APELLIDOS";

    hoja.getCell("A15").font = {
        bold: true
    };


    /*
     * DÍAS DE CLASE DEL GRUPO
     */

    let dias = [];

    if (grupo.includes(" L")) {

        dias = [
            "LUNES",
            "MIÉRCOLES",
            "VIERNES"
        ];

    } else if (grupo.includes(" MJ")) {

        dias = [
            "MARTES",
            "JUEVES"
        ];

    } else if (grupo.includes(" S")) {

        dias = [
            "SÁBADO"
        ];

    }


    /*
     * COLOCAR DÍAS DESDE B14
     */

    dias.forEach((dia, indice) => {

        const celda =
            hoja.getCell(14, indice + 2);

        celda.value = dia;

        celda.font = {
            bold: true
        };

    });

    /*
 * JUSTIFICACIÓN
 */

const celdaJustificacion =
    hoja.getCell(14, dias.length + 2);

celdaJustificacion.value =
    "JUSTIFICACIÓN";

celdaJustificacion.font = {
    bold: true
};

});


        /*
         * ----------------------------------------------
         * GENERAR ARCHIVO
         * ----------------------------------------------
         */

        const buffer =
            await libro.xlsx.writeBuffer();


        /*
         * ----------------------------------------------
         * DESCARGAR
         * ----------------------------------------------
 */

        const blob =
            new Blob(
                [buffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

        const enlace =
            document.createElement("a");

        enlace.href =
            URL.createObjectURL(blob);

        enlace.download =
            "Reporte_Asistencia.xlsx";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);

        URL.revokeObjectURL(
            enlace.href
        );

    });
