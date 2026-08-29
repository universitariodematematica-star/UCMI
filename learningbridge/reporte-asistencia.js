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
         * CREAR LIBRO
         * ----------------------------------------------
         */

        const libro = new ExcelJS.Workbook();


        /*
         * ----------------------------------------------
         * OBTENER GRUPOS
         * ----------------------------------------------
         */

        const grupos = [
            ...new Set(
                registrosAsistencia
                    .map(alumno => alumno.grupo)
                    .filter(grupo => grupo)
            )
        ];


        console.log(
            "GRUPOS ENCONTRADOS:",
            grupos
        );


        /*
         * ----------------------------------------------
         * CREAR UNA HOJA POR GRUPO
         * ----------------------------------------------
         */

        grupos.forEach(grupo => {

            const hoja = libro.addWorksheet(
                grupo
            );

            hoja.getCell("A1").value =
                `GRUPO: ${grupo}`;

        });


        /*
         * ----------------------------------------------
         * DESCARGAR
         * ----------------------------------------------
         */

        const archivo =
            await libro.xlsx.writeBuffer();

        const blob =
            new Blob(
                [archivo],
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

        enlace.click();

        URL.revokeObjectURL(
            enlace.href
        );

    });
