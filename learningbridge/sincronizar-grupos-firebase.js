const UCMI_GRUPOS_FIREBASE = {};

async function cargarGruposActualesFirebase() {

try {

    const db =
        window.learningBridgeFirebaseDB;

    if (!db) {

        throw new Error(
            "Firebase Firestore todavía no está disponible."
        );

    }

    const {
        collection,
        getDocs
    } =
        await import(
            "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        );

    const snapshot =
        await getDocs(
            collection(
                db,
                "alumnos"
            )
        );

    Object.keys(
        UCMI_GRUPOS_FIREBASE
    ).forEach(
        studentId => {

            delete UCMI_GRUPOS_FIREBASE[
                studentId
            ];

        }
    );

    snapshot.forEach(
        documento => {

            const datos =
                documento.data();

            const studentId =
                String(
                    datos.studentId ||
                    documento.id ||
                    ""
                ).trim();

            const grupo =
                String(
                    datos.grupo ||
                    ""
                ).trim();

            if (
                studentId &&
                grupo
            ) {

                UCMI_GRUPOS_FIREBASE[
                    studentId
                ] =
                    grupo;

            }

        }
    );

    window.ucmiGruposFirebase =
        UCMI_GRUPOS_FIREBASE;

    console.log(
        "Grupos actuales cargados desde Firebase:",
        UCMI_GRUPOS_FIREBASE
    );

    return UCMI_GRUPOS_FIREBASE;

} catch (error) {

    console.error(
        "Error al cargar grupos actuales desde Firebase:",
        error
    );

    return {};

}

}

function obtenerGrupoActualFirebase(
studentId
) {

const id =
    String(
        studentId || ""
    ).trim();

if (!id) {
    return "";
}

return (
    UCMI_GRUPOS_FIREBASE[id] ||
    ""
);

}

function filtrarRegistrosPorGrupoActualFirebase(
registros
) {

if (
    !Array.isArray(
        registros
    )
) {

    return [];

}

return registros.filter(
    alumno => {

        const studentId =
            String(
                alumno.studentId ||
                ""
            ).trim();

        const grupoActual =
            obtenerGrupoActualFirebase(
                studentId
            );

        if (!grupoActual) {
            return false;
        }

        return (
            String(
                alumno.grupo ||
                ""
            ).trim() ===
            grupoActual
        );

    }
);

}

/*

============================================================
OCULTAR DE LA TABLA LOS GRUPOS HISTÓRICOS
============================================================
*/

function sincronizarTablaConFirebase() {

const tabla =
    document.querySelector(
        "#resultadoAsistencia table"
    );

if (!tabla) {
    return;
}

const filas =
    tabla.querySelectorAll(
        "tr"
    );

filas.forEach(
    (fila, indice) => {

        if (indice === 0) {
            return;
        }

        const celdas =
            fila.querySelectorAll(
                "td"
            );

        if (celdas.length < 2) {
            return;
        }

        const nombre =
            String(
                celdas[0].textContent ||
                ""
            ).trim();

        const grupo =
            String(
                celdas[1].textContent ||
                ""
            ).trim();

        if (!nombre || !grupo) {
            return;
        }

        const registros =
            window.registrosAsistencia ||
            [];

        const alumno =
            registros.find(
                registro => {

                    const nombreRegistro =
                        `${registro.apellidos || ""} ${registro.nombres || ""}`
                            .trim();

                    return (
                        nombreRegistro ===
                        nombre &&
                        String(
                            registro.grupo ||
                            ""
                        ).trim() ===
                        grupo
                    );

                }
            );

        if (!alumno) {
            fila.style.display = "none";
            return;
        }

        const grupoActual =
            obtenerGrupoActualFirebase(
                alumno.studentId
            );

        if (
            !grupoActual ||
            grupo !== grupoActual
        ) {

            fila.style.display =
                "none";

        } else {

            fila.style.display =
                "";

        }

    }
);

}

/*

============================================================
OBSERVAR CAMBIOS EN LA TABLA
============================================================
*/

function iniciarSincronizacionVisual() {

const contenedor =
    document.getElementById(
        "resultadoAsistencia"
    );

if (!contenedor) {

    setTimeout(
        iniciarSincronizacionVisual,
        200
    );

    return;

}

const observer =
    new MutationObserver(
        function() {

            sincronizarTablaConFirebase();

        }
    );

observer.observe(
    contenedor,
    {
        childList: true,
        subtree: true
    }
);

sincronizarTablaConFirebase();

}

/*

============================================================
EXPONER FUNCIONES
============================================================
*/

window.cargarGruposActualesFirebase =
cargarGruposActualesFirebase;

window.obtenerGrupoActualFirebase =
obtenerGrupoActualFirebase;

window.filtrarRegistrosPorGrupoActualFirebase =
filtrarRegistrosPorGrupoActualFirebase;

/*

============================================================
ESPERAR FIREBASE
============================================================
*/

(function esperarFirebase() {

if (
    window.learningBridgeFirebaseDB
) {

    cargarGruposActualesFirebase()
        .then(
            function() {

                iniciarSincronizacionVisual();

            }
        );

    return;

}

setTimeout(
    esperarFirebase,
    100
);

})();
