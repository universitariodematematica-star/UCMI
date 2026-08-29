/*
 * ==================================================
 * REPORTE DE ASISTENCIA
 * ==================================================
 */

document
    .getElementById("btnDescargarExcel")
    .addEventListener("click", async function() {

        const libro = new ExcelJS.Workbook();

        const hoja = libro.addWorksheet("REPORTE");

        hoja.getCell("A1").value =
            "PRUEBA DE REPORTE DE ASISTENCIA";

        const buffer =
            await libro.xlsx.writeBuffer();

        const blob = new Blob(
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
            "Prueba_Reporte.xlsx";

        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);
    });
