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
         * VERIFICAR REGISTROS
         * ----------------------------------------------
         */

        console.log(
            "REGISTROS DISPONIBLES:",
            window.registrosAsistencia
        );


        /*
         * ----------------------------------------------
         * OBTENER GRUPOS
         * ----------------------------------------------
         */

        const grupos = [
            ...new Set(
                window.registrosAsistencia
                    .map(alumno => alumno.grupo)
                    .filter(grupo => grupo)
            )
        ];


        console.log(
            "GRUPOS ENCONTRADOS:",
            grupos
        );

    });
