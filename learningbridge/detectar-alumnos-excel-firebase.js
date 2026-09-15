const UCMI_ALUMNOS_NUEVOS = [];
const UCMI_ALUMNOS_DESAPARECIDOS = [];

/*
UTILIDADES

*/

function normalizarStudentIdExcelFirebase(valor) {
return String(valor || "")
.trim();
}

function obtenerNombreExcelFirebase(alumno) {
return (
String(alumno.apellidos || "").trim() +
" " +
String(alumno.nombres || "").trim()
).trim();
}

/*
LEER STUDENT ID DEL EXCEL

*/

async function obtenerAlumnosExcelParaComparacion() {

const archivoInput =
    document.getElementById(
        "archivoAsistencia"
    );

if (!archivoInput) {
    return [];
}

const archivo =
    archivoInput.files &&
    archivoInput.files[0];

if (!archivo) {
    return [];
}

try {

    const datos =
        await archivo.arrayBuffer();

    const libro =
        new ExcelJS.Workbook();

    await libro.xlsx.load(
        datos
    );

    const alumnosExcel = [];

    libro.worksheets.forEach(
       hoja => {

                if (
                    String(
                        hoja.name || ""
                    ).trim() ===
                    "Configuracion-Grupos"
                ) {
                    return;
                }
                
                hoja.eachRow(
                    (fila, numeroFila) => {

                    if (
                        numeroFila < 5
                    ) {
                        return;
                    }

                    const valores =
                        fila.values;

                    const apellidos =
                        valores[1];

                    const nombres =
                        valores[2];

                    const studentId =
                        normalizarStudentIdExcelFirebase(
                            valores[3]
                        );

                    if (!studentId) {
                        return;
                    }

                    alumnosExcel.push({

                        studentId:
                            studentId,

                        apellidos:
                            String(
                                apellidos ||
                                ""
                            ).trim(),

                        nombres:
                            String(
                                nombres ||
                                ""
                            ).trim(),

                        grupo:
                            String(
                                hoja.name ||
                                ""
                            ).trim()

                    });

                }
            );

        }
    );

    /*
     * ------------------------------------------------
     * ELIMINAR DUPLICADOS POR STUDENT ID
     * ------------------------------------------------
     */

    const mapa =
        new Map();

    alumnosExcel.forEach(
        alumno => {

            if (
                !mapa.has(
                    alumno.studentId
                )
            ) {
                mapa.set(
                    alumno.studentId,
                    alumno
                );
            }

        }
    );

    return Array.from(
        mapa.values()
    );

}
catch (error) {

    console.error(
        "Error al leer el Excel para detectar alumnos:",
        error
    );

    return [];

}

}

/*
OBTENER ALUMNOS DE FIREBASE

*/

async function obtenerAlumnosFirebaseParaComparacion() {

const db =
    window.learningBridgeFirebaseDB;

if (!db) {

    console.warn(
        "Firebase todavía no está disponible para detectar alumnos."
    );

    return [];

}

try {

const snapshot =
await window.ucmiFirebaseGetDocs(
window.ucmiFirebaseCollection(
db,
"alumnos"
)
);

    const alumnosFirebase = [];

    snapshot.forEach(
        documento => {

            const datos =
                documento.data();

            const studentId =
                normalizarStudentIdExcelFirebase(
                    datos.studentId ||
                    documento.id
                );

            if (!studentId) {
                return;
            }

            alumnosFirebase.push({

                studentId:
                    studentId,

                apellidos:
                    String(
                        datos.apellidos ||
                        ""
                    ).trim(),

                nombres:
                    String(
                        datos.nombres ||
                        ""
                    ).trim(),

                grupo:
                    String(
                        datos.grupo ||
                        ""
                    ).trim(),

                faseRetiro:
                    datos.faseRetiro ===
                    true

            });

        }
    );

    return alumnosFirebase;

}
catch (error) {

    console.error(
        "Error al obtener alumnos de Firebase:",
        error
    );

    return [];

}

}

/*
DETECTAR NUEVOS Y DESAPARECIDOS

*/

async function detectarAlumnosExcelFirebase() {

const alumnosExcel =
    await obtenerAlumnosExcelParaComparacion();

if (
    alumnosExcel.length === 0
) {

    UCMI_ALUMNOS_NUEVOS.length = 0;

    UCMI_ALUMNOS_DESAPARECIDOS.length = 0;

    mostrarAlertasAlumnosExcelFirebase();

    return;

}

const alumnosFirebase =
    await obtenerAlumnosFirebaseParaComparacion();

if (
    alumnosFirebase.length === 0
) {

    console.warn(
        "No se obtuvieron alumnos de Firebase. No se realizará la comparación."
    );

    return;

}

const idsExcel =
    new Set(
        alumnosExcel.map(
            alumno =>
                alumno.studentId
        )
    );

const idsFirebase =
    new Set(
        alumnosFirebase.map(
            alumno =>
                alumno.studentId
        )
    );

/*
 * ------------------------------------------------
 * ALUMNOS NUEVOS
 * ------------------------------------------------
 */

UCMI_ALUMNOS_NUEVOS.length = 0;

alumnosExcel.forEach(
    alumno => {

        if (
            !idsFirebase.has(
                alumno.studentId
            )
        ) {

            UCMI_ALUMNOS_NUEVOS.push(
                alumno
            );

        }

    }
);

/*
 * ------------------------------------------------
 * ALUMNOS DESAPARECIDOS
 * ------------------------------------------------
 *
 * Incluye también faseRetiro === true.
 *
 * Mientras exista en Firebase,
 * sigue siendo un alumno activo para
 * esta comparación.
 * ------------------------------------------------
 */

UCMI_ALUMNOS_DESAPARECIDOS.length = 0;

alumnosFirebase.forEach(
    alumno => {

        if (
            !idsExcel.has(
                alumno.studentId
            )
        ) {

            UCMI_ALUMNOS_DESAPARECIDOS.push(
                alumno
            );

        }

    }
);

window.ucmiAlumnosNuevos =
    UCMI_ALUMNOS_NUEVOS;

window.ucmiAlumnosDesaparecidos =
    UCMI_ALUMNOS_DESAPARECIDOS;

console.log(
    "ALUMNOS NUEVOS:",
    UCMI_ALUMNOS_NUEVOS
);

console.log(
    "ALUMNOS DESAPARECIDOS:",
    UCMI_ALUMNOS_DESAPARECIDOS
);

mostrarAlertasAlumnosExcelFirebase();

}

/*
MOSTRAR ALERTAS

*/

function mostrarAlertasAlumnosExcelFirebase() {

let contenedor =
    document.getElementById(
        "alertasAlumnosExcelFirebase"
    );

if (!contenedor) {

    contenedor =
        document.createElement(
            "div"
        );

    contenedor.id =
        "alertasAlumnosExcelFirebase";

    const resultado =
        document.getElementById(
            "resultadoAsistencia"
        );

    if (
        resultado &&
        resultado.parentNode
    ) {

        resultado.parentNode.insertBefore(
            contenedor,
            resultado
        );

    }
    else {

        document.body.appendChild(
            contenedor
        );

    }

}

contenedor.innerHTML = "";

const hayNuevos =
    UCMI_ALUMNOS_NUEVOS.length >
    0;

const hayDesaparecidos =
    UCMI_ALUMNOS_DESAPARECIDOS.length >
    0;

if (
    !hayNuevos &&
    !hayDesaparecidos
) {

    contenedor.style.display =
        "none";

    return;

}

contenedor.style.display =
    "block";

contenedor.style.margin =
    "20px 0";

contenedor.style.padding =
    "18px";

contenedor.style.backgroundColor =
    "#fff";

contenedor.style.border =
    "1px solid #ddd";

contenedor.style.borderRadius =
    "8px";

contenedor.style.boxShadow =
    "0 2px 6px rgba(0,0,0,0.08)";

/*
 * ------------------------------------------------
 * TÍTULO GENERAL
 * ------------------------------------------------
 */

const titulo =
    document.createElement(
        "div"
    );

titulo.textContent =
    "⚠️ REVISIÓN DE ALUMNOS";

titulo.style.fontWeight =
    "700";

titulo.style.fontSize =
    "18px";

titulo.style.marginBottom =
    "16px";

titulo.style.color =
    "#333";

contenedor.appendChild(
    titulo
);

/*
 * ------------------------------------------------
 * ALUMNOS NUEVOS
 * ------------------------------------------------
 */

if (hayNuevos) {

    const tituloNuevos =
        document.createElement(
            "div"
        );

    tituloNuevos.textContent =
        "🟢 ALUMNOS NUEVOS — " +
        UCMI_ALUMNOS_NUEVOS.length;

    tituloNuevos.style.fontWeight =
        "700";

    tituloNuevos.style.fontSize =
        "17px";

    tituloNuevos.style.marginBottom =
        "10px";

    tituloNuevos.style.color =
        "#178a75";

    contenedor.appendChild(
        tituloNuevos
    );

    UCMI_ALUMNOS_NUEVOS.forEach(
        alumno => {

            const fila =
                document.createElement(
                    "div"
                );

            fila.textContent =
                obtenerNombreExcelFirebase(
                    alumno
                ) +
                " — ID: " +
                alumno.studentId +
                " — Grupo: " +
                alumno.grupo;

            fila.style.padding =
                "8px 10px";

            fila.style.marginBottom =
                "5px";

            fila.style.backgroundColor =
                "#f0faf7";

            fila.style.border =
                "1px solid #b8dfd5";

            fila.style.borderRadius =
                "5px";

            contenedor.appendChild(
                fila
            );

        }
    );

}

/*
 * ------------------------------------------------
 * ALUMNOS DESAPARECIDOS
 * ------------------------------------------------
 */

if (hayDesaparecidos) {

    const tituloDesaparecidos =
        document.createElement(
            "div"
        );

    tituloDesaparecidos.textContent =
        "🔴 ALUMNOS DESAPARECIDOS — " +
        UCMI_ALUMNOS_DESAPARECIDOS.length;

    tituloDesaparecidos.style.fontWeight =
        "700";

    tituloDesaparecidos.style.fontSize =
        "17px";

    tituloDesaparecidos.style.marginTop =
        "18px";

    tituloDesaparecidos.style.marginBottom =
        "10px";

    tituloDesaparecidos.style.color =
        "#8b1e1e";

    contenedor.appendChild(
        tituloDesaparecidos
    );

    UCMI_ALUMNOS_DESAPARECIDOS.forEach(
        alumno => {

            const fila =
                document.createElement(
                    "div"
                );

            fila.textContent =
                obtenerNombreExcelFirebase(
                    alumno
                ) +
                " — ID: " +
                alumno.studentId +
                " — Grupo: " +
                alumno.grupo;

            fila.style.padding =
                "8px 10px";

            fila.style.marginBottom =
                "5px";

            fila.style.backgroundColor =
                "#fff4f4";

            fila.style.border =
                "1px solid #e0bcbc";

            fila.style.borderRadius =
                "5px";

            contenedor.appendChild(
                fila
            );

        }
    );

}

}

/*
ESPERAR A QUE FIREBASE Y EL EXCEL ESTÉN LISTOS

*/

let firmaAnteriorAlumnosExcelFirebase =
"";

function obtenerFirmaArchivoExcelFirebase() {

const input =
    document.getElementById(
        "archivoAsistencia"
    );

if (
    !input ||
    !input.files ||
    !input.files[0]
) {
    return "";
}

const archivo =
    input.files[0];

return (
    archivo.name +
    "|" +
    archivo.size +
    "|" +
    archivo.lastModified
);

}

function vigilarAlumnosExcelFirebase() {

const firma =
    obtenerFirmaArchivoExcelFirebase();

if (
    firma &&
    firma !==
        firmaAnteriorAlumnosExcelFirebase
) {

    firmaAnteriorAlumnosExcelFirebase =
        firma;

    setTimeout(
        function() {

            detectarAlumnosExcelFirebase();

        },
        1000
    );

}

if (!firma) {

    firmaAnteriorAlumnosExcelFirebase =
        "";

}

}

window.detectarAlumnosExcelFirebase =
detectarAlumnosExcelFirebase;

window.ucmiAlumnosNuevos =
UCMI_ALUMNOS_NUEVOS;

window.ucmiAlumnosDesaparecidos =
UCMI_ALUMNOS_DESAPARECIDOS;

setInterval(
vigilarAlumnosExcelFirebase,
1000
);
