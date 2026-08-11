/*====================================================*
* UCMI - MOTOR DE ESTRUCTURAS GRAMATICALES
*====================================================*
*
* Motor independiente para el ejercicio:
* Estructuras gramaticales
*
* IMPORTANTE:
* - No modifica motor-ejercicios.js
* - Utiliza los datos provenientes del mismo Excel
* - Estructuras se genera después de Identificar imágenes
* - La numeración será recibida desde el generador
*
*====================================================*/

const UCMIMotorEstructuras = {

    generar: function(config = {}) {

        console.log(
            "========== MOTOR DE ESTRUCTURAS =========="
        );

        console.log(
            "ESTRUCTURAS RECIBIDAS:",
            config.estructuras
        );

        console.log(
            "NÚMERO INICIAL:",
            config.numeroInicial
        );

        const contenedor =
            document.getElementById(
                config.contenedor || "zona-ejercicios"
            );

        if(!contenedor){

            console.error(
                "UCMIMotorEstructuras: no se encontró el contenedor."
            );

            return config.numeroInicial || 1;
        }

        const estructuras =
            config.estructuras || {};

        const numeroInicial =
            Number(config.numeroInicial) || 1;

        /*
         * TODAVÍA NO GENERAMOS LA ESTRUCTURA.
         *
         * En este primer paso solamente comprobamos
         * que el nuevo motor recibe correctamente:
         *
         * 1. las estructuras provenientes del Excel
         * 2. el contador de numeración
         * 3. el contenedor donde se mostrará
         */

        console.log(
            "CONTENEDOR:",
            contenedor
        );

        console.log(
            "NÚMERO DESDE EL CUAL DEBE CONTINUAR:",
            numeroInicial
        );

        console.log(
            "========== FIN MOTOR DE ESTRUCTURAS =========="
        );

        return numeroInicial;
    }

};


/*====================================================*
* EXPONER MOTOR GLOBALMENTE
*====================================================*/

window.UCMIMotorEstructuras =
    UCMIMotorEstructuras;
