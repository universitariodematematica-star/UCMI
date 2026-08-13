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


        //========================================
        // PRUEBA: PRIMER PÁRRAFO
        //========================================

        const parrafo =
            datos.parrafos[0];

        if(!parrafo){
            console.warn(
                "NO EXISTE EL PRIMER PÁRRAFO"
            );
            return;
        }


        // Buscar las posiciones que deben ocultarse
        const referencia =
            datos.referencias.find(
                ref => ref.parrafo === 1
            );


        const posicionesOcultas =
            referencia
                ? referencia.posiciones
                : [];


        // Dividir el párrafo en palabras
        const palabras =
            parrafo.texto.split(/\s+/);


        // Construir el HTML del párrafo
        let html = "";


        palabras.forEach(
            (palabra, indice) => {

                const posicion =
                    indice + 1;


                if(
                    posicionesOcultas.includes(
                        posicion
                    )
                ){

                    html +=
                        `<input
                            type="text"
                            class="completar-listening-input"
                            data-posicion="${posicion}"
                            style="
                                width:100px;
                                margin:0 4px;
                                padding:6px;
                            "
                        >`;

                }else{

                    html +=
                        `<span>${palabra}</span>`;

                }


                if(
                    indice < palabras.length - 1
                ){

                    html += " ";

                }

            }
        );


        // Mostrar el resultado
        const bloque =
            document.createElement("div");

        bloque.className =
            "ejercicio-completar-listening";

        bloque.style.width = "90%";
        bloque.style.margin = "30px auto";
        bloque.style.padding = "25px";
        bloque.style.fontSize = "20px";
        bloque.style.lineHeight = "2";

        bloque.innerHTML = html;

        contenedor.appendChild(bloque);

    }

};

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;
