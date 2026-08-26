/*====================================================
MOTOR MODELO 16 - MINERIA
====================================================*/

const UCMIMotorMineria = {

generar(config){

    const contenedor =
        document.getElementById(
            config.contenedor
        );


    if(!contenedor){

        console.error(
            "MINERIA: no existe el contenedor:",
            config.contenedor
        );

        return;

    }


    const mineria =
        config.mineria;


    if(
        !mineria ||
        !Array.isArray(mineria.ejercicios) ||
        mineria.ejercicios.length === 0
    ){

        console.warn(
            "MINERIA: no existen ejercicios."
        );

        return;

    }


    mineria.ejercicios.forEach(ejercicio => {

        const numeroEjercicio =
            ++contadorEjercicios;


        const bloque =
            document.createElement("div");


        bloque.className =
            "ejercicio-mineria";


        bloque.innerHTML = `

            <div class="instruccion-ejercicio">

                <strong>
                    ${numeroEjercicio}.
                </strong>

            </div>

        `;


        contenedor.appendChild(
            bloque
        );

    });

}

};


/*====================================================
EXPORTAR MOTOR
====================================================*/

window.UCMIMotorMineria =
UCMIMotorMineria;
