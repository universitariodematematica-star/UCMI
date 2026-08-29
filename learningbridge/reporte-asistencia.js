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

        /*
         * FORMATO RECIBIDO:
         * 5 Aug 2026 5.00PM
         */

        const partes =
            textoFecha.match(
                /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2})\.(\d{2})(AM|PM)$/
            );

        if (!partes) {

            console.error(
                "FECHA NO RECONOCIDA:",
                textoFecha
            );

            return;

        }

        const dia =
            parseInt(partes[1], 10);

        const meses = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        const mes =
            meses[partes[2]];

        const año =
            parseInt(partes[3], 10);

        let hora =
            parseInt(partes[4], 10);

        const minutos =
            parseInt(partes[5], 10);

        const periodo =
            partes[6];

        if (
            periodo === "PM" &&
            hora !== 12
        ) {
            hora += 12;
        }

        if (
            periodo === "AM" &&
            hora === 12
        ) {
            hora = 0;
        }

        sesion.fechaObjeto =
            new Date(
                año,
                mes,
                dia,
                hora,
                minutos
            );

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
     *
     * La semana operativa siempre va desde
     * el último lunes transcurrido hasta
     * el domingo siguiente.
     */

    let fechasUltimaSemana = [];

    const hoy =
        new Date();


    /*
     * ----------------------------------------------
     * ENCONTRAR EL ÚLTIMO LUNES
     * ----------------------------------------------
     */

    const diaHoy =
        hoy.getDay();

    const diasDesdeLunes =
        diaHoy === 0
            ? 6
            : diaHoy - 1;

    const inicioSemana =
        new Date(hoy);

    inicioSemana.setDate(
        hoy.getDate() -
        diasDesdeLunes
    );

    inicioSemana.setHours(
        0,
        0,
        0,
        0
    );


    /*
     * ----------------------------------------------
     * DOMINGO DE LA SEMANA OPERATIVA
     * ----------------------------------------------
     */

    const finSemana =
        new Date(inicioSemana);

    finSemana.setDate(
        inicioSemana.getDate() + 6
    );

    finSemana.setHours(
        23,
        59,
        59,
        999
    );


    /*
     * ----------------------------------------------
     * SESIONES REALES DE ESA SEMANA
     * ----------------------------------------------
     */

    fechasUltimaSemana =
        sesionesGrupo.filter(
            sesion =>
                sesion.fechaObjeto >=
                    inicioSemana &&
                sesion.fechaObjeto <=
                    finSemana
        );


/*
 * ----------------------------------------------
 * PAI
 * ----------------------------------------------
 */

const celdaPAI =
    hoja.getCell(
        15,
        2
    );

celdaPAI.value =
    "PAI";

celdaPAI.font = {
    bold: true
};

celdaPAI.alignment = {
    horizontal: "center",
    vertical: "middle"
};

celdaPAI.note =
    "Porcentage Acumulado de Inasistencias";


    /*
     * ----------------------------------------------
     * COLOCAR DÍAS Y FECHAS
     * ----------------------------------------------
     */

    dias.forEach((dia, indice) => {

        const numeroColumna =
            indice + 3;


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


        const celdaFecha =
            hoja.getCell(
                15,
                numeroColumna
            );


        /*
         * ----------------------------------------------
         * FECHA REAL DE LA SESIÓN
         * ----------------------------------------------
         */

        const sesionDia =
            fechasUltimaSemana.find(
                sesion =>
                    sesion.fechaObjeto.getDay() ===
                    diaBuscado
            );


        if (sesionDia) {

            celdaFecha.value =
                sesionDia.fechaObjeto;

            celdaFecha.numFmt =
                "dd/mm/yyyy";

        } else {

            /*
             * Para sábado:
             * fecha del viernes + 1 día.
             */

            if (
                dia === "SÁBADO" &&
                fechasUltimaSemana.length > 0
            ) {

                const sesionesViernes =
                    fechasUltimaSemana.filter(
                        sesion =>
                            sesion.fechaObjeto.getDay() === 5
                    );

                if (
                    sesionesViernes.length > 0
                ) {

                    const viernes =
                        sesionesViernes[
                            sesionesViernes.length - 1
                        ].fechaObjeto;

                    const sabado =
                        new Date(viernes);

                    sabado.setDate(
                        viernes.getDate() + 1
                    );

                    celdaFecha.value =
                        sabado;

                    celdaFecha.numFmt =
                        "dd/mm/yyyy";

                } else {

                    celdaFecha.value =
                        "";

                }

            } else {

                celdaFecha.value =
                    "";

            }

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
            dias.length + 3
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
 * NOMBRES DE LOS ALUMNOS
 * ----------------------------------------------
 */

const alumnosGrupo =
    registros.filter(
        alumno =>
            alumno.grupo === grupo
    );


alumnosGrupo.forEach(
    (alumno, indice) => {

        const fila =
            indice + 16;


        /*
         * ----------------------------------------------
         * NOMBRE DEL ALUMNO
         * ----------------------------------------------
         */

        const celdaNombre =
            hoja.getCell(
                fila,
                1
            );

        celdaNombre.value =
            `${alumno.nombres} ${alumno.apellidos}`;

        celdaNombre.alignment = {
            horizontal: "left",
            vertical: "middle"
        };


        /*
         * ----------------------------------------------
         * PAI
         * PORCENTAJE ACUMULADO DE INASISTENCIAS
         * ----------------------------------------------
         */

        const datosInasistencia =
            calcularDatosInasistencia(alumno);

        const celdaPAIAlumno =
            hoja.getCell(
                fila,
                2
            );

        celdaPAIAlumno.value =
            datosInasistencia.porcentajeActual / 100;

        celdaPAIAlumno.numFmt =
            "0.00%";

        celdaPAIAlumno.alignment = {
            horizontal: "center",
            vertical: "middle"
        };


        /*
         * ----------------------------------------------
         * ASISTENCIA / INASISTENCIA
         * ----------------------------------------------
         */

        dias.forEach((dia, indiceDia) => {

            const numeroColumna =
                indiceDia + 3;


            /*
             * Buscar la fecha que corresponde
             * a la columna del día.
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
                        sesion.fechaObjeto &&
                        sesion.fechaObjeto.getDay() ===
                            diaBuscado
                );


            const celdaAsistencia =
                hoja.getCell(
                    fila,
                    numeroColumna
                );


            /*
             * Si existe una sesión para ese día,
             * buscar la asistencia correspondiente
             * del alumno.
             */

            if (sesionDia && alumno.sesiones) {

                const sesionAlumno =
                    alumno.sesiones.find(
                        sesion => {

                            if (!sesion.fecha) {
                                return false;
                            }

                            const textoFecha =
                                sesion.fecha
                                    .replace(
                                        "All students",
                                        ""
                                    )
                                    .trim();

                            const partes =
                                textoFecha.match(
                                    /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2})\.(\d{2})(AM|PM)$/
                                );

                            if (!partes) {
                                return false;
                            }

                            const diaSesion =
                                parseInt(
                                    partes[1],
                                    10
                                );

                            const meses = {
                                Jan: 0,
                                Feb: 1,
                                Mar: 2,
                                Apr: 3,
                                May: 4,
                                Jun: 5,
                                Jul: 6,
                                Aug: 7,
                                Sep: 8,
                                Oct: 9,
                                Nov: 10,
                                Dec: 11
                            };

                            const mesSesion =
                                meses[partes[2]];

                            const añoSesion =
                                parseInt(
                                    partes[3],
                                    10
                                );

                            return (
                                diaSesion ===
                                    sesionDia.fechaObjeto.getDate() &&
                                mesSesion ===
                                    sesionDia.fechaObjeto.getMonth() &&
                                añoSesion ===
                                    sesionDia.fechaObjeto.getFullYear()
                            );

                        }
                    );


                if (sesionAlumno) {

                    celdaAsistencia.value =
                        String(
                            sesionAlumno.asistencia || ""
                        )
                        .trim()
                        .charAt(0);

                }

            }


            celdaAsistencia.alignment = {
                horizontal: "center",
                vertical: "middle"
            };

        });


/*
 * ----------------------------------------------
 * JUSTIFICACIÓN
 * ----------------------------------------------
 */

const columnaJustificacion =
    dias.length + 3;

const celdaJustificacionAlumno =
    hoja.getCell(
        fila,
        columnaJustificacion
    );


/*
 * ----------------------------------------------
 * DETERMINAR SI EXISTE ALGUNA INASISTENCIA
 * EN LA ÚLTIMA SEMANA
 * ----------------------------------------------
 */

let tieneInasistencia =
    false;

dias.forEach((dia, indiceDia) => {

    const numeroColumna =
        indiceDia + 3;

    const celdaAsistencia =
        hoja.getCell(
            fila,
            numeroColumna
        );

    const valorAsistencia =
        String(
            celdaAsistencia.value || ""
        )
        .trim()
        .toUpperCase();

    if (
        valorAsistencia === "A"
    ) {

        tieneInasistencia =
            true;

    }

});


/*
 * ----------------------------------------------
 * TEXTO DE JUSTIFICACIÓN
 * ----------------------------------------------
 */

let textoJustificacion =
    String(
        alumno.justificacion || ""
    )
    .trim();


/*
 * ----------------------------------------------
 * NO RESPONDIÓ
 * ----------------------------------------------
 *
 * Si tiene al menos una A durante la última
 * semana y no existe justificación.
 */

if (
    textoJustificacion === "" &&
    tieneInasistencia
) {

    textoJustificacion =
        "No respondió";

}


/*
 * ----------------------------------------------
 * ESCRIBIR JUSTIFICACIÓN
 * ----------------------------------------------
 */

celdaJustificacionAlumno.value =
    textoJustificacion;

celdaJustificacionAlumno.alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true
};


/*
 * ----------------------------------------------
 * COLOR DE TODA LA FILA
 * ----------------------------------------------
 */


/*
 * NO RESPONDIÓ
 * → ROSADO CLARO
 */

if (
    textoJustificacion === "No respondió"
) {

    for (
        let columna = 1;
        columna <= columnaJustificacion;
        columna++
    ) {

        hoja.getCell(
            fila,
            columna
        ).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFF4B6C2"
            }
        };

    }

}


/*
 * SE RETIRA
 * → GRIS CLARO
 */

else if (
    /s\s*e\s+r\s*e\s*t\s*i\s*r\s*a/i.test(
        textoJustificacion
    )
) {

    for (
        let columna = 1;
        columna <= columnaJustificacion;
        columna++
    ) {

        hoja.getCell(
            fila,
            columna
        ).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFBFBFBF"
            }
        };

    }

}


/*
 * OTRA JUSTIFICACIÓN ESCRITA
 * → AZUL CLARO
 */

else if (
    textoJustificacion !== ""
) {

    for (
        let columna = 1;
        columna <= columnaJustificacion;
        columna++
    ) {

        hoja.getCell(
            fila,
            columna
        ).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FFBDD7EE"
            }
        };

    }

}


/*
 * SIN JUSTIFICACIÓN Y SIN INASISTENCIA
 * → SIN RELLENO
 */

else {

    for (
        let columna = 1;
        columna <= columnaJustificacion;
        columna++
    ) {

        hoja.getCell(
            fila,
            columna
        ).fill = undefined;

    }

}
    }
);


/*
 * ----------------------------------------------
 * ANCHO DE COLUMNAS
 * ----------------------------------------------
 */

hoja.getColumn(1).width =
    45;


/*
 * PAI
 */

hoja.getColumn(2).width =
    15;


/*
 * DÍAS
 */

for (let i = 0; i < dias.length; i++) {

    hoja.getColumn(i + 3).width =
        15;

}


/*
 * JUSTIFICACIÓN
 */

hoja.getColumn(
    dias.length + 3
).width =
    53;

/*
 * ----------------------------------------------
 * BORDES DE LA TABLA
 * ----------------------------------------------
 *
 * Desde GRUPO hasta el último alumno.
 *
 * Columnas:
 * A = Nombres y apellidos
 * B = PAI
 * C... = Días
 * última = Justificación
 *
 * Filas:
 * 13 = GRUPO
 * 14 = Días
 * 15 = Fechas
 * 16... = Alumnos
 */

const ultimaFilaTabla =
    alumnosGrupo.length + 15;

const ultimaColumnaTabla =
    dias.length + 3;


for (
    let filaTabla = 13;
    filaTabla <= ultimaFilaTabla;
    filaTabla++
) {

    for (
        let columnaTabla = 1;
        columnaTabla <= ultimaColumnaTabla;
        columnaTabla++
    ) {

        hoja.getCell(
            filaTabla,
            columnaTabla
        ).border = {

            top: {
                style: "thin"
            },

            left: {
                style: "thin"
            },

            bottom: {
                style: "thin"
            },

            right: {
                style: "thin"
            }

        };

    }

}
    
});

/*
 * ----------------------------------------------
 * BORDES DE LA TABLA
 * ----------------------------------------------
 *
 * Desde GRUPO hasta el último alumno.
 *
 * Columnas:
 * A = Nombres y apellidos
 * B = PAI
 * C... = Días
 * última = Justificación
 *
 * Filas:
 * 13 = GRUPO
 * 14 = Días
 * 15 = Fechas
 * 16... = Alumnos
 */

const ultimaFilaTabla =
    alumnosGrupo.length + 15;

const ultimaColumnaTabla =
    dias.length + 3;


for (
    let filaTabla = 13;
    filaTabla <= ultimaFilaTabla;
    filaTabla++
) {

    for (
        let columnaTabla = 1;
        columnaTabla <= ultimaColumnaTabla;
        columnaTabla++
    ) {

        hoja.getCell(
            filaTabla,
            columnaTabla
        ).border = {

            top: {
                style: "thin"
            },

            left: {
                style: "thin"
            },

            bottom: {
                style: "thin"
            },

            right: {
                style: "thin"
            }

        };

    }

}        

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
