/*=====================================================*
*MOTOR - COMPLETAR TEXTO LISTENING*
*=====================================================*/

function evaluarCompletarListening(){

    const entradas =
        document.querySelectorAll(
            ".completar-listening-input"
        );

    let correctas = 0;
    let total = entradas.length;

    entradas.forEach(entrada => {

        const correcta =
            (entrada.dataset.correcta || "")
            .trim()
            .toLowerCase();

        const respuesta =
            (entrada.value || "")
            .trim()
            .toLowerCase();

        if(respuesta === correcta){

            correctas++;

            entrada.style.border =
                "2px solid green";

        }else{

            entrada.style.border =
                "2px solid red";

        }

    });

    const resultado =
        document.getElementById(
            "resultado-completar-listening"
        );

    if(resultado){

        resultado.innerHTML =
            `Resultado: ${correctas} de ${total} respuestas correctas.`;

        resultado.style.color =
            correctas === total
                ? "green"
                : "red";

    }

}

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
// ENUNCIADO DEL EJERCICIO
//========================================

contadorEjercicios++;

const instruccionEjercicio =
    document.createElement("div");

instruccionEjercicio.className =
    "instruccion-ejercicio";

instruccionEjercicio.textContent =
    `${contadorEjercicios}. Lee el texto mientras escuchas y coloca las palabras faltantes.`;

contenedor.appendChild(
    instruccionEjercicio
);


//========================================
// AUDIO DEL EJERCICIO
//========================================

const contenedorAudio =
    document.createElement("div");

contenedorAudio.className =
    "audioUCMI";

const datosAudio =
    document.createElement("div");

datosAudio.className =
    "audio-data";

datosAudio.dataset.titulo =
    "Listening";

datosAudio.dataset.audio =
    datos.audio || "";

contenedorAudio.appendChild(
    datosAudio
);

contenedor.appendChild(
    contenedorAudio
);


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
                        data-correcta="${escaparTexto(palabra)}"
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


//========================================
// BOTÓN EVALUAR
//========================================

const botonEvaluar =
    document.createElement("button");

botonEvaluar.type =
    "button";

botonEvaluar.className =
    "verificar";

botonEvaluar.textContent =
    "Evaluar";

botonEvaluar.onclick =
    evaluarCompletarListening;

contenedor.appendChild(
    botonEvaluar
);


//========================================
// RESULTADO
//========================================

const resultado =
    document.createElement("div");

resultado.className =
    "resultado";

resultado.id =
    "resultado-completar-listening";

contenedor.appendChild(
    resultado
);

console.log(
    "EVALUAR COMPLETAR LISTENING:",
    typeof evaluarCompletarListening
);        

    }

};

window.UCMIMotorCompletarListening =
    UCMIMotorCompletarListening;
