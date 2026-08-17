/*=====================================================
    UCMI - MOTOR COMPRENSIÓN DE TEXTO
=====================================================*/

const UCMIMotorComprensionTexto = {

    generar: function(configuracion){

        const contenedor =
            document.getElementById(
                configuracion.contenedor
            );

        if(!contenedor){
            console.error(
                "UCMIMotorComprensionTexto: no existe el contenedor."
            );
            return;
        }


        const datos =
            configuracion.comprensionTexto;


        console.log(
            "========== MOTOR COMPRENSIÓN DE TEXTO =========="
        );

        console.log(
            "CONFIGURACIÓN RECIBIDA:",
            configuracion
        );

        console.log(
            "DATOS RECIBIDOS:",
            datos
        );

        console.log(
            "PÁRRAFOS RECIBIDOS:",
            datos ? datos.parrafos : null
        );

        console.log(
            "PREGUNTAS RECIBIDAS:",
            datos ? datos.preguntas : null
        );

        console.log(
    "PRIMERA PREGUNTA DETALLADA:",
    datos &&
    Array.isArray(datos.preguntas) &&
    datos.preguntas.length > 0
        ? JSON.stringify(datos.preguntas[0], null, 2)
        : null
);

        console.log(
            "===============================================" 
        );


        if(!datos){
            console.error(
                "UCMIMotorComprensionTexto: no se recibieron datos."
            );
            return;
        }


        /*
        =================================================
        CREAR CONTENEDOR DEL EJERCICIO
        =================================================
        */

        const zona =
            document.createElement("div");

        zona.className =
            "ejercicio-comprension-texto";


        /*
        =================================================
        ESTILOS DEL EJERCICIO
        =================================================
        */

        zona.style.maxWidth =
            "900px";

        zona.style.margin =
            "30px auto";

        zona.style.padding =
            "30px";

        zona.style.backgroundColor =
            "#ffffff";

        zona.style.border =
            "1px solid #d9e2ec";

        zona.style.borderRadius =
            "12px";

        zona.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.08)";

        zona.style.boxSizing =
            "border-box";


        /*
        =================================================
        TÍTULOS
        =================================================
        */

        zona.querySelectorAll("h2,h3").forEach(
            elemento => {

                elemento.style.color =
                    "#071426";

            }
        );


        /*
        =================================================
        TÍTULO
        =================================================
        */

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Comprensión de texto";

        zona.appendChild(
            titulo
        );


        /*
        =================================================
        INSTRUCCIÓN
        =================================================
        */

        const instruccion =
            document.createElement("div");

        instruccion.className =
            "instruccion-ejercicio";

        instruccion.textContent =
            (++contadorEjercicios) +
            ". Lee el siguiente texto y responde las preguntas relacionadas";

        zona.appendChild(
            instruccion
        );


        /*
        =================================================
        TÍTULO DE LA LECTURA
        =================================================
        */

        const tituloTexto =
            document.createElement("h3");

        tituloTexto.textContent =
            datos.titulo || "";

        tituloTexto.style.textAlign =
            "center";

        zona.appendChild(
            tituloTexto
        );


        /*
        =================================================
        TEXTO
        =================================================
        */

        const contenedorTexto =
            document.createElement("div");

        contenedorTexto.className =
            "texto-comprension";

        contenedorTexto.style.textAlign =
            "justify";


        if(
            Array.isArray(datos.parrafos)
        ){

            datos.parrafos.forEach(
                parrafo => {

                    const elemento =
                        document.createElement("p");

                    elemento.textContent =
                        parrafo.texto || "";

                    contenedorTexto.appendChild(
                        elemento
                    );

                }
            );

        }


        zona.appendChild(
            contenedorTexto
        );


        /*
        =================================================
        PREGUNTAS
        =================================================
        */

        const tituloPreguntas =
            document.createElement("h3");

        tituloPreguntas.textContent =
            "Preguntas";

        zona.appendChild(
            tituloPreguntas
        );


        const contenedorPreguntas =
            document.createElement("div");

        contenedorPreguntas.className =
            "preguntas-comprension";


        if(
            Array.isArray(datos.preguntas)
        ){

            datos.preguntas.forEach(
                (pregunta, indice) => {

                    const bloque =
                        document.createElement("div");

                    bloque.className =
                        "pregunta-comprension";


                    /*
                    =====================================
                    ENUNCIADO
                    =====================================
                    */

                    const enunciado =
                        document.createElement("p");

                    enunciado.className =
                        "enunciado-comprension";

                    enunciado.textContent =
                        (
                            pregunta.numero ||
                            indice + 1
                        ) +
                        ". " +
                        (
                            pregunta.pregunta ||
                            ""
                        );

                    bloque.appendChild(
                        enunciado
                    );


                    /*
                    =====================================
                    OPCIONES
                    =====================================
                    */

                    const opciones =
                        document.createElement("div");

                    opciones.className =
                        "opciones-comprension";


                    const listaOpciones = [];


                    if(
                        pregunta.correcta
                    ){

                        listaOpciones.push(
                            pregunta.correcta
                        );

                    }


                    if(
                        Array.isArray(
                            pregunta.incorrectas
                        )
                    ){

                        pregunta.incorrectas.forEach(
                            incorrecta => {

                                if(incorrecta){

                                    listaOpciones.push(
                                        incorrecta
                                    );

                                }

                            }
                        );

                    }


                    listaOpciones.forEach(
                        (opcion, indiceOpcion) => {

                            const label =
                                document.createElement(
                                    "label"
                                );

                            label.className =
                                "opcion-comprension";


                            const radio =
                                document.createElement(
                                    "input"
                                );

                            radio.type =
                                "radio";

                            radio.name =
                                "comprension-pregunta-" +
                                (
                                    pregunta.numero ||
                                    indice
                                );

                            radio.value =
                                opcion;


                            label.appendChild(
                                radio
                            );


                            const texto =
                                document.createTextNode(
                                    " " + opcion
                                );

                            label.appendChild(
                                texto
                            );


                            opciones.appendChild(
                                label
                            );

                        }
                    );


                    bloque.appendChild(
                        opciones
                    );


                    contenedorPreguntas.appendChild(
                        bloque
                    );

                }
            );

        }


        zona.appendChild(
            contenedorPreguntas
        );

/*
=================================================
BOTÓN DE EVALUACIÓN
=================================================
*/

const botonEvaluar =
    document.createElement("button");

botonEvaluar.type =
    "button";

botonEvaluar.className =
    "verificar";

botonEvaluar.textContent =
    "Evaluar";

zona.appendChild(
    botonEvaluar
);
        

        /*
        =================================================
        INSERTAR EN LA PÁGINA
        =================================================
        */

        contenedor.appendChild(
            zona
        );

    }

};
