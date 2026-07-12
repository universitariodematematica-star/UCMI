// js/matematicas/calculo/tangentes.js


function enteroAleatorio(minimo, maximo) {

    return Math.floor(
        Math.random() * (maximo - minimo + 1)
    ) + minimo;

}


function enteroAleatorioExcepto(
    minimo,
    maximo,
    excluidos
) {

    let valor;


    do {

        valor = enteroAleatorio(
            minimo,
            maximo
        );

    } while (
        excluidos.includes(valor)
    );


    return valor;

}


// ===============================================
// TANGENTE A FUNCIÓN CUADRÁTICA
// ===============================================

export function generarTangenteCuadratica() {


    const A =
        enteroAleatorioExcepto(
            -3,
            3,
            [0]
        );


    const B =
        enteroAleatorioExcepto(
            -3,
            3,
            [0]
        );


    const C =
        enteroAleatorioExcepto(
            -3,
            3,
            [0]
        );


    const t =
        enteroAleatorio(
            -3,
            3
        );


    const m =
        2 * A * t + B;


    const bRecta =
        C - A * t * t;


    return {

        A: A,

        B: B,

        C: C,

        t: t,

        m: m,

        bRecta: bRecta

    };


}
