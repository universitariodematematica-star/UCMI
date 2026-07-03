import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

/**
 * MODAL PROFESORES
 * - carga curso del aula
 * - obtiene asignaturas del curso
 * - filtra docentes compatibles
 * - muestra checkbox
 */

export async function abrirSelectorProfesores(aulaId, entidad) {

    // =========================
    // OVERLAY
    // =========================
    const overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,.75)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "99999";

    overlay.innerHTML = `
        <div style="
            width:900px;
            max-width:95%;
            max-height:90%;
            overflow:auto;
            background:#111;
            border-radius:16px;
            padding:25px;
            color:white;
        ">

            <h4 class="mb-4">
                Asignar profesores al aula
            </h4>

            <div id="listaProfesores">
                Cargando...
            </div>

            <div class="mt-4 d-flex justify-content-between">

                <button id="guardarProfesores" class="btn btn-success">
                    Guardar profesores
                </button>

                <button id="cerrarProfesores" class="btn btn-danger">
                    Cerrar
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("cerrarProfesores").onclick = () => overlay.remove();

    const lista = document.getElementById("listaProfesores");

    // =========================
    // 1. AULA
    // =========================
    const aulaSnap = await getDoc(doc(db, "aulas", aulaId));

    if (!aulaSnap.exists()) {
        lista.innerHTML = "El aula no existe.";
        return;
    }

    const aula = aulaSnap.data();

    if (!aula.cursoId) {
        lista.innerHTML = "El aula no tiene curso asignado.";
        return;
    }

    // =========================
    // 2. ASIGNATURAS DEL CURSO
    // =========================
    const asignaturasSnap = await getDocs(
        query(
            collection(db, "curso_asignaturas"),
            where("cursoId", "==", aula.cursoId),
            where("entidad", "==", entidad)
        )
    );

    const asignaturasCurso = [];

    asignaturasSnap.forEach(d => {
        const data = d.data();
        asignaturasCurso.push(data.asignatura);
    });

    // =========================
    // 3. DOCENTES
    // =========================
    const docentesSnap = await getDocs(
        query(
            collection(db, "usuarios"),
            where("entidad", "==", entidad),
            where("perfil", "==", "Docente Academia")
        )
    );

    lista.innerHTML = "";

    const docentesFiltrados = [];

    docentesSnap.forEach(docSnap => {

        const d = docSnap.data();

        const asignaturasDocente = d.asignaturas || [];

        const coincide = asignaturasDocente.some(a =>
            asignaturasCurso.includes(a.asignatura)
        );

        if (!coincide) return;

        docentesFiltrados.push({
            id: docSnap.id,
            data: d
        });
    });

    if (docentesFiltrados.length === 0) {
        lista.innerHTML = "No hay docentes compatibles con este curso.";
        return;
    }

    docentesFiltrados.forEach(d => {

        const asignaturasTxt = (d.data.asignaturas || [])
            .map(a => a.asignatura)
            .join(", ");

        lista.innerHTML += `
            <div style="
                padding:8px 0;
                border-bottom:1px solid rgba(255,255,255,.1);
                display:flex;
                gap:10px;
                align-items:center;
            ">

                <input type="checkbox" value="${d.id}" class="chk-profesor">

                👨‍🏫 ${d.data.nombreResponsable}

                <small style="opacity:.7">
                    (${asignaturasTxt})
                </small>

            </div>
        `;
    });

    // =========================
    // AQUÍ CONTINÚA PARTE 2
    // =========================
}

// =========================
// AQUÍ CONTINÚA PARTE 2
// =========================

    // =========================
    // 4. DOCENTES YA ASIGNADOS AL AULA
    // =========================
    const asignadosSnap = await getDocs(
        query(
            collection(db, "aula_integrantes"),
            where("aulaId", "==", aulaId),
            where("entidad", "==", entidad),
            where("perfil", "==", "Docente Academia")
        )
    );

    const docentesAsignados = new Set();

    asignadosSnap.forEach(d => {
        const data = d.data();
        docentesAsignados.add(data.usuarioId);
    });

    // =========================
    // 5. MARCAR CHECKBOX AUTOMÁTICAMENTE
    // =========================
    function marcarAsignados() {

        const checks = overlay.querySelectorAll(".chk-profesor");

        checks.forEach(chk => {

            if (docentesAsignados.has(chk.value)) {
                chk.checked = true;
            }

        });
    }

    marcarAsignados();

    // =========================
    // 6. ESTADO LOCAL (SEGUIMIENTO CAMBIOS)
    // =========================
    const estadoInicial = new Set(docentesAsignados);

    function obtenerSeleccionActual() {

        const seleccionados = new Set();

        overlay.querySelectorAll(".chk-profesor").forEach(chk => {

            if (chk.checked) {
                seleccionados.add(chk.value);
            }

        });

        return seleccionados;
    }

    // =========================
    // LISTENERS
    // =========================
    document.getElementById("cerrarProfesores").onclick = () => {
        overlay.remove();
    };

    // =========================
    // AQUÍ CONTINÚA PARTE 3
    // =========================

// AQUÍ CONTINÚA PARTE 3

    // =========================
    // 7. GUARDAR CAMBIOS (SINCRONIZACIÓN DIFERENCIAL)
    // =========================
    document.getElementById("guardarProfesores").onclick = async () => {

        const seleccionActual = obtenerSeleccionActual();

        const batch = writeBatch(db);

        // =========================
        // 7.1 AGREGAR NUEVOS DOCENTES
        // =========================
        seleccionActual.forEach(idDocente => {

            const ref = doc(db, "aula_integrantes", aulaId + "_" + idDocente);

            batch.set(ref, {
                aulaId,
                usuarioId: idDocente,
                perfil: "Docente Academia",
                entidad,
                fechaAsignacion: serverTimestamp()
            });

        });

        // =========================
        // 7.2 ELIMINAR LOS DESMARCADOS
        // =========================
        estadoInicial.forEach(idDocente => {

            if (!seleccionActual.has(idDocente)) {

                const ref = doc(db, "aula_integrantes", aulaId + "_" + idDocente);

                batch.delete(ref);
            }
        });

        // =========================
        // 7.3 EJECUTAR CAMBIOS
        // =========================
        await batch.commit();

        // =========================
        // 7.4 CIERRE Y CONFIRMACIÓN
        // =========================
        overlay.remove();

        alert("Profesores actualizados correctamente.");
    };

}
