/*
 * ==================================================
 * REPORTE DE ASISTENCIA
 * ==================================================
 */

document
    .getElementById("btnDescargarExcel")
    .addEventListener("click", async function() {

        const libro = new ExcelJS.Workbook();


        /*
         * ----------------------------------------------
         * OBTENER GRUPOS REALES
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
         * CREAR HOJAS DE PRUEBA
         * ----------------------------------------------
         */

        grupos.forEach((grupo, indice) => {

            const hoja =
                libro.addWorksheet(
                    `Grupo ${indice + 1}`
                );

            hoja.getCell("A1").value =
                `GRUPO: ${grupo}`;

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
            "Prueba_Grupos.xlsx";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);

    });
