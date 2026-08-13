/*=====================================================
    MOTOR - COMPLETAR TEXTO LISTENING
    UCMI
=====================================================*/

const UCMIMotorCompletarListening = {

    generar: function(datos){

        if(!datos){

            console.error(
                "No se recibieron datos para Completar texto listening."
            );

            return;

        }

        console.log(
            "Datos Completar texto listening:",
            datos
        );

    }

};


/*=====================================================
    EXPONER MOTOR
=====================================================*/

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;
