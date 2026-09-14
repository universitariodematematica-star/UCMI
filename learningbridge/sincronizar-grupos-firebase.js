const UCMI_GRUPOS_FIREBASE = {};

/*

* ==================================================
* CARGAR GRUPOS ACTUALES DESDE FIREBASE
* ==================================================
  */

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
                ] = grupo;

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

/*

* ==================================================
* OBTENER GRUPO ACTUAL DE UN ESTUDIANTE
* ==================================================
  */

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

/*

* ==================================================
* FILTRAR REGISTROS SEGÚN GRUPO ACTUAL
* ==================================================
*
* NO elimina sesiones históricas.
*
* Solamente conserva al estudiante
* en el grupo que actualmente tiene
* registrado en Firebase.
*
* ==================================================
  */

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

* ==================================================
* INICIALIZAR SINCRONIZACIÓN
* ==================================================
  */

window.cargarGruposActualesFirebase =
cargarGruposActualesFirebase;

window.obtenerGrupoActualFirebase =
obtenerGrupoActualFirebase;

window.filtrarRegistrosPorGrupoActualFirebase =
filtrarRegistrosPorGrupoActualFirebase;

/*

* ==================================================
* INICIAR AUTOMÁTICAMENTE
* ==================================================
*
* Firebase se inicializa en asistencia.html.
* Este archivo espera a que Firebase esté disponible.
*
* ==================================================
  */

(function esperarFirebase() {

if (
    window.learningBridgeFirebaseDB
) {

    cargarGruposActualesFirebase();

    return;

}


setTimeout(
    esperarFirebase,
    100
);


})();

