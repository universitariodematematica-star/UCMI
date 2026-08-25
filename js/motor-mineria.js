```javascript
/*====================================================
        MOTOR MODELO 15 - MINERÍA
        Escritura de oraciones según estructura
====================================================*/


const UCMIMotorMineria = {

    generar(config){

        const contenedor =
            document.getElementById(
                config.contenedor
            );


        if(!contenedor){

            console.error(
                "MINERÍA: no existe el contenedor:",
                config.contenedor
            );

            return;

        }


        const mineria =
            config.mineria;


        if(
            !mineria ||
            !Array.isArray(mineria.estructuras) ||
            mineria.estructuras.length === 0
        ){

            console.warn(
                "MINERÍA: no existen estructuras para mostrar."
            );

            return;

        }


        let contador =
            Number(config.numeroInicial) || 1;


        let html = "";


        /*================================================
                ENUNCIADO GENERAL
        ================================================*/

        html += `

<div class="ejercicio-mineria">

    <div class="instruccion-ejercicio">

        Escriba tres oraciones que satisfagan
        la estructura correspondiente

    </div>

`;


        /*================================================
                ESTRUCTURAS
        ================================================*/

        mineria.estructuras.forEach(
            (estructura) => {


                const numeroEjercicio =
                    contador++;


                html += `

    <div
        class="bloque-mineria"
        data-estructura="${estructura.numero}"
    >

        <h3>

            ${numeroEjercicio}. Estructura
            ${estructura.numero}

        </h3>


        <div class="estructura-mineria">

            ${escaparTexto(
                estructura.estructura
            )}

        </div>


        <div class="oraciones-mineria">


            <input
                type="text"
                class="respuesta-mineria"
                placeholder="Escriba una oración"
            >


            <input
                type="text"
                class="respuesta-mineria"
                placeholder="Escriba una oración"
            >


            <input
                type="text"
                class="respuesta-mineria"
                placeholder="Escriba una oración"
            >


        </div>


    </div>

`;

            }
        );


        html += `

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

window.UCMIMotorMineria =
    UCMIMotorMineria;
```
