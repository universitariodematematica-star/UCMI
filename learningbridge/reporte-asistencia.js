/*
 * ==================================================
 * REPORTE DE ASISTENCIA
 * ==================================================
 */

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
         * CREAR HOJAS
         * ----------------------------------------------
         */

        grupos.forEach(grupo => {

            const hoja = libro.addWorksheet(
                String(grupo)
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
         * CREAR DESCARGA
         * ----------------------------------------------
         */

        const blob = new Blob(
            [buffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        const enlace =
            document.createElement("a");

        enlace.style.display = "none";

        enlace.href =
            URL.createObjectURL(blob);

        enlace.download =
            "Reporte_Asistencia.xlsx";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);

    });
