/*====================================================
MOTOR MODELO 16 - ESCRITURA GUIADA
====================================================*/

const UCMIMotorEscrituraGuiada = {

generar(config){

    const contenedor =
        document.getElementById(
            config.contenedor
        );


    if(!contenedor){

        console.error(
            "ESCRITURA GUIADA: no existe el contenedor:",
            config.contenedor
        );

        return;

    }


    const escrituraGuiada =
        config.escrituraGuiada;


    if(
        !escrituraGuiada ||
        !Array.isArray(escrituraGuiada.ejercicios) ||
        escrituraGuiada.ejercicios.length === 0
    ){

        console.warn(
            "ESCRITURA GUIADA: no existen ejercicios."
        );

        return;

    }


    const ejercicio =
        escrituraGuiada.ejercicios[0];


    const numeroEjercicio =
        ++contadorEjercicios;


    const numeroPalabras =
        ejercicio.numeroMinimoPalabras || 0;


    const palabras =
        ejercicio.palabras || [];


    const estructuras =
        ejercicio.estructuras || [];


    const conjuntoPalabras =
        palabras.join(", ");


    const conjuntoEstructuras =
        estructuras.join(", ");


    const html = `

<div class="ejercicio-escritura-guiada">

<div class="instruccion-ejercicio">

    ${numeroEjercicio}. Escriba un texto con
    ${numeroPalabras}
    palabras que tenga los siguientes vocablos
    ${conjuntoPalabras}
    y oraciones formadas con las estructuras
    ${conjuntoEstructuras}.

</div>

</div>

`;

    contenedor.insertAdjacentHTML(
        "beforeend",
        html
    );

}

};

/*====================================================
EXPORTAR MOTOR
====================================================*/

window.UCMIMotorEscrituraGuiada =
UCMIMotorEscrituraGuiada;
