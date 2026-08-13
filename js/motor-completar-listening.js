/*=====================================================*
*MOTOR - COMPLETAR TEXTO LISTENING*
*=====================================================*/

const UCMIMotorCompletarListening = {

    generar(config){

        const contenedor =
            document.getElementById(
                config.contenedor
            );

        if(!contenedor){
            console.error(
                "NO SE ENCONTRÓ EL CONTENEDOR"
            );
            return;
        }

        const datos =
            config.completarTextoListening;

        if(!datos){
            console.error(
                "NO EXISTEN DATOS DE COMPLETAR TEXTO LISTENING"
            );
            return;
        }

        console.log(
            "DATOS COMPLETAR TEXTO LISTENING:",
            datos
        );

    }

};

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;
