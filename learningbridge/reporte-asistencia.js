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
         * CREAR TRES HOJAS DE PRUEBA
         * ----------------------------------------------
         */

        const hoja1 =
            libro.addWorksheet("Grupo 1");

        hoja1.getCell("A1").value =
            "PRUEBA GRUPO 1";


        const hoja2 =
            libro.addWorksheet("Grupo 2");

        hoja2.getCell("A1").value =
            "PRUEBA GRUPO 2";


        const hoja3 =
            libro.addWorksheet("Grupo 3");

        hoja3.getCell("A1").value =
            "PRUEBA GRUPO 3";


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
            "Prueba_Tres_Hojas.xlsx";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);

    });
