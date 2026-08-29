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

hoja.addImage(imagenLogo, {
    tl: { col: 0, row: 0 },
    br: { col: 3, row: 9 }
});

hoja.getCell("C11").value =
        "CONTROL DE AISTENCIA Y PUNTUALIDAD";    

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
