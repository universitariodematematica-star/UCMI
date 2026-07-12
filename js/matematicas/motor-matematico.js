// js/matematicas/motor-matematico.js


import {
    generarTangenteCuadratica
} from "./calculo/tangentes.js";


// ===============================================
// CATÁLOGO DE GENERADORES
// ===============================================

const generadores = {

    tangente_cuadratica:
        generarTangenteCuadratica

};


// ===============================================
// EJECUTAR GENERADOR
// ===============================================

export function ejecutarGenerador(
    nombreGenerador
) {


    const generador =
        generadores[nombreGenerador];


    if (!generador) {

        throw new Error(
            "Generador matemático no encontrado: " +
            nombreGenerador
        );

    }


    return generador();


}


// ===============================================
// APLICAR DATOS A UNA PLANTILLA
// ===============================================

export function aplicarParametros(
    texto,
    datos
) {


    let resultado = texto;


    for (
        const [nombre, valor]
        of Object.entries(datos)
    ) {


        const marcador =
            `{{${nombre}}}`;


        resultado =
            resultado
                .split(marcador)
                .join(String(valor));


    }


    return resultado;


}
