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

        contenedorPreguntas.style.marginTop =
            "25px";


        if(
            Array.isArray(datos.preguntas)
        ){

            datos.preguntas.forEach(
                (pregunta, indice) => {

const bloque =
    document.createElement("div");

bloque.className =
    "pregunta-comprension";

bloque.style.marginBottom =
    "28px";

bloque.style.paddingBottom =
    "20px";

bloque.style.borderBottom =
    "1px solid #e5e7eb";


                    /*
                    =====================================
                    ENUNCIADO
                    =====================================
                    */

                    const enunciado =
                        document.createElement("p");

                    enunciado.className =
                        "enunciado-comprension";

                    enunciado.style.fontWeight =
    "600";

enunciado.style.marginBottom =
    "14px";

enunciado.style.lineHeight =
    "1.5";

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

opciones.style.display =
    "flex";

opciones.style.flexDirection =
    "column";

opciones.style.gap =
    "10px";

opciones.style.marginTop =
    "8px";                    


/*
=====================================
CREAR LISTA DE OPCIONES
=====================================
*/

const listaOpciones = [];


/*
-------------------------------------
RESPUESTA CORRECTA
-------------------------------------
*/

if(
    pregunta.correcta
){

    listaOpciones.push({
        texto: pregunta.correcta,
        correcta: true
    });

}


/*
-------------------------------------
RESPUESTAS INCORRECTAS
-------------------------------------
*/

if(
    Array.isArray(
        pregunta.incorrectas
    )
){

    pregunta.incorrectas.forEach(
        incorrecta => {

            if(incorrecta){

                listaOpciones.push({
                    texto: incorrecta,
                    correcta: false
                });

            }

        }
    );

}


/*
=====================================
ALEATORIZAR OPCIONES
=====================================
*/

for(
    let i = listaOpciones.length - 1;
    i > 0;
    i--
){

    const j =
        Math.floor(
            Math.random() * (i + 1)
        );

    [
        listaOpciones[i],
        listaOpciones[j]
    ] =
    [
        listaOpciones[j],
        listaOpciones[i]
    ];

}


/*
=====================================
GENERAR OPCIONES
=====================================
*/

listaOpciones.forEach(
    (opcion, indiceOpcion) => {

        const label =
            document.createElement(
                "label"
            );

        label.className =
    "opcion-comprension";

label.style.display =
    "block";

label.style.width =
    "100%";

label.style.padding =
    "10px 14px";

label.style.border =
    "1px solid #d9e2ec";

label.style.borderRadius =
    "8px";

label.style.boxSizing =
    "border-box";

label.style.cursor =
    "pointer";

label.style.backgroundColor =
    "#f8fafc";        


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
            opcion.texto;


/*
-------------------------------------
LETRA DE LA OPCIÓN
-------------------------------------
*/

        const letra =
            String.fromCharCode(
                97 + indiceOpcion
            );


        const texto =
            document.createTextNode(
                letra + ") " + opcion.texto
            );


        label.appendChild(
            radio
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


botonEvaluar.addEventListener(
    "click",
    function(){

        const preguntas =
            contenedorPreguntas.querySelectorAll(
                ".pregunta-comprension"
            );


        preguntas.forEach(
            (bloquePregunta) => {

                const radioSeleccionado =
                    bloquePregunta.querySelector(
                        'input[type="radio"]:checked'
                    );


                let resultado =
                    bloquePregunta.querySelector(
                        ".resultado-comprension"
                    );


if(!resultado){

    resultado =
        document.createElement("div");

    resultado.className =
        "resultado-comprension";

    resultado.style.marginTop =
        "14px";

    resultado.style.padding =
        "8px 12px";

    resultado.style.fontWeight =
        "bold";

    resultado.style.borderRadius =
        "6px";

    bloquePregunta.appendChild(
        resultado
    );

}


                if(!radioSeleccionado){

                    resultado.textContent =
                        "Seleccione una opción.";

                    return;

                }


                const preguntaNumero =
                    radioSeleccionado.name
                        .replace(
                            "comprension-pregunta-",
                            ""
                        );


                const pregunta =
                    datos.preguntas.find(
                        p =>
                            String(
                                p.numero ||
                                ""
                            ) ===
                            String(
                                preguntaNumero
                            )
                    );


                if(!pregunta){

                    resultado.textContent =
                        "No se pudo evaluar esta pregunta.";

                    return;

                }


if(
    radioSeleccionado.value ===
    pregunta.correcta
){

    resultado.textContent =
        "✓ Respuesta correcta.";

    resultado.style.color =
        "#15803d";

    resultado.style.backgroundColor =
        "#f0fdf4";

    resultado.style.border =
        "1px solid #bbf7d0";

}else{

    resultado.textContent =
        "✗ Respuesta incorrecta.";

    resultado.style.color =
        "#b91c1c";

    resultado.style.backgroundColor =
        "#fef2f2";

    resultado.style.border =
        "1px solid #fecaca";

}
            }
        );

    }
);


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
