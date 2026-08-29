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
         * CARGAR LOGO
         * ----------------------------------------------
         */

        const respuestaLogo =
            await fetch("lb-logo.png");

        const datosLogo =
            await respuestaLogo.arrayBuffer();

        const imagenLogo =
            libro.addImage({
                buffer: datosLogo,
                extension: "png"
            });


        /*
         * ----------------------------------------------
         * CREAR UNA HOJA POR GRUPO
         * ----------------------------------------------
         */

grupos.forEach(grupo => {

    const hoja =
        libro.addWorksheet(grupo);


    /*
     * ----------------------------------------------
     * LOGO
     * ----------------------------------------------
     */

    hoja.addImage(imagenLogo, {
        tl: { col: 0, row: 0 },
        ext: {
            width: 180,
            height: 180
        }
    });


    /*
     * ----------------------------------------------
     * TÍTULO
     * ----------------------------------------------
     */

    hoja.mergeCells("B11:D11");

    hoja.getCell("B11").value =
        "CONTROL DE ASISTENCIA Y PUNTUALIDAD";

    hoja.getCell("B11").font = {
        bold: true
    };

    hoja.getCell("B11").alignment = {
        horizontal: "center",
        vertical: "middle"
    };


    /*
     * ----------------------------------------------
     * GRUPO
     * ----------------------------------------------
     */

    hoja.getCell("A13").value =
        `GRUPO: ${grupo}`;

    hoja.getCell("A13").font = {
        bold: true
    };

    hoja.getCell("A13").alignment = {
        horizontal: "left"
    };


    /*
     * ----------------------------------------------
     * NOMBRES Y APELLIDOS
     * ----------------------------------------------
     */

    hoja.getCell("A15").value =
        "NOMBRES Y APELLIDOS";

    hoja.getCell("A15").font = {
        bold: true
    };

    hoja.getCell("A15").alignment = {
        horizontal: "left"
    };


    /*
     * ----------------------------------------------
     * DÍAS DE CLASE DEL GRUPO
     * ----------------------------------------------
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
     * ----------------------------------------------
     * OBTENER SESIONES DEL GRUPO
     * ----------------------------------------------
     */

    const registrosGrupo =
        registros.filter(
            alumno =>
                alumno.grupo === grupo
        );


    /*
     * ----------------------------------------------
     * OBTENER FECHAS DE LAS SESIONES
     * ----------------------------------------------
     */

    const sesionesGrupo = [];

    registrosGrupo.forEach(alumno => {

        if (!alumno.sesiones) {
            return;
        }

        alumno.sesiones.forEach(sesion => {

            if (!sesion.fecha) {
                return;
            }

            if (
                !sesionesGrupo.some(
                    existente =>
                        existente.fecha === sesion.fecha
                )
            ) {

                sesionesGrupo.push({
                    fecha: sesion.fecha
                });

            }

        });

    });


    /*
     * ----------------------------------------------
     * CONVERTIR FECHAS
     * ----------------------------------------------
     */

    sesionesGrupo.forEach(sesion => {

        const textoFecha =
            sesion.fecha
                .replace(
                    "All students",
                    ""
                )
                .trim();

        sesion.fechaObjeto =
            new Date(textoFecha);

    });


    /*
     * ----------------------------------------------
     * ORDENAR SESIONES POR FECHA
     * ----------------------------------------------
     */

    sesionesGrupo.sort(
        (a, b) =>
            a.fechaObjeto - b.fechaObjeto
    );


    /*
     * ----------------------------------------------
     * ÚLTIMA SEMANA OPERATIVA
     * ----------------------------------------------
     */

    let fechasUltimaSemana = [];

    if (sesionesGrupo.length > 0) {

        const ultimaFecha =
            sesionesGrupo[
                sesionesGrupo.length - 1
            ].fechaObjeto;

        const diaSemana =
            ultimaFecha.getDay();

        const inicioSemana =
            new Date(ultimaFecha);

        inicioSemana.setDate(
            ultimaFecha.getDate() -
            diaSemana
        );

        inicioSemana.setHours(
            0, 0, 0, 0
        );

        const finSemana =
            new Date(inicioSemana);

        finSemana.setDate(
            inicioSemana.getDate() + 6
        );

        finSemana.setHours(
            23, 59, 59, 999
        );


        fechasUltimaSemana =
            sesionesGrupo.filter(
                sesion =>
                    sesion.fechaObjeto >=
                        inicioSemana &&
                    sesion.fechaObjeto <=
                        finSemana
            );

    }


    /*
     * ----------------------------------------------
     * COLOCAR DÍAS Y FECHAS
     * ----------------------------------------------
     */

    dias.forEach((dia, indice) => {

        const numeroColumna =
            indice + 2;


        /*
         * DÍA
         */

        const celdaDia =
            hoja.getCell(
                14,
                numeroColumna
            );

        celdaDia.value =
            dia;

        celdaDia.font = {
            bold: true
        };

        celdaDia.alignment = {
            horizontal: "center",
            vertical: "middle"
        };


        /*
         * FECHA
         */

        const diaBuscado =
            {
                "DOMINGO": 0,
                "LUNES": 1,
                "MARTES": 2,
                "MIÉRCOLES": 3,
                "JUEVES": 4,
                "VIERNES": 5,
                "SÁBADO": 6
            }[dia];


        const sesionDia =
            fechasUltimaSemana.find(
                sesion =>
                    sesion.fechaObjeto.getDay() ===
                    diaBuscado
            );


        const celdaFecha =
            hoja.getCell(
                15,
                numeroColumna
            );


        if (sesionDia) {

            celdaFecha.value =
                sesionDia.fechaObjeto;

            celdaFecha.numFmt =
                "dd/mm/yyyy";

        }


        celdaFecha.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

    });


    /*
     * ----------------------------------------------
     * JUSTIFICACIÓN
     * ----------------------------------------------
     */

    const celdaJustificacion =
        hoja.getCell(
            14,
            dias.length + 2
        );

    celdaJustificacion.value =
        "JUSTIFICACIÓN";

    celdaJustificacion.font = {
        bold: true
    };

    celdaJustificacion.alignment = {
        horizontal: "center",
        vertical: "middle"
    };


    /*
     * ----------------------------------------------
     * ANCHO DE COLUMNAS
     * ----------------------------------------------
     */

    hoja.getColumn(1).width =
        30;

    for (let i = 0; i < dias.length; i++) {

        hoja.getColumn(i + 2).width =
            15;

    }

    hoja.getColumn(
        dias.length + 2
    ).width =
        53;

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
