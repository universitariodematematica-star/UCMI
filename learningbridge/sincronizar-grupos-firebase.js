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
