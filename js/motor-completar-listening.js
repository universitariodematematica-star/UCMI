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
// ENUNCIADO
//========================================

const instruccion =
    document.createElement("div");

instruccion.className =
    "instruccion-ejercicio";

instruccion.textContent =
    "Lee el texto mientras escuchas y coloca las palabras faltantes.";

contenedor.appendChild(instruccion);


//========================================
// GENERAR TODOS LOS PÁRRAFOS
//========================================

datos.parrafos.forEach(
    (parrafo, indiceParrafo) => {

        //====================================
        // NÚMERO DEL PÁRRAFO
        //====================================

        const numeroParrafo =
            indiceParrafo + 1;


        //====================================
        // BUSCAR REFERENCIA DEL PÁRRAFO
        //====================================

        const referencia =
            datos.referencias.find(
                ref =>
                    ref.parrafo ===
                    numeroParrafo
            );


        const posicionesOcultas =
            referencia
                ? referencia.posiciones
                : [];


        //====================================
        // DIVIDIR EL PÁRRAFO EN PALABRAS
        //====================================

        const palabras =
            parrafo.texto.split(/\s+/);


        //====================================
        // CONSTRUIR HTML
        //====================================

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
                            data-parrafo="${numeroParrafo}"
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
                    indice <
                    palabras.length - 1
                ){

                    html += " ";

                }

            }
        );


        //====================================
        // CREAR BLOQUE DEL PÁRRAFO
        //====================================

        const bloque =
            document.createElement("div");


        bloque.className =
            "ejercicio-completar-listening";


        bloque.style.width = "90%";
        bloque.style.margin = "0 auto 12px auto";
        bloque.style.padding = "4px 25px";
        bloque.style.fontSize = "20px";
        bloque.style.lineHeight = "1.6";
        bloque.style.textAlign = "justify";


        bloque.innerHTML = html;


        //====================================
        // INSERTAR PÁRRAFO
        //====================================

        contenedor.appendChild(bloque);

    }
);

    }

};

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;
