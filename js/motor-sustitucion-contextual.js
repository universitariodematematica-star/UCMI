/*=====================================================
    MOTOR MODELO 14
    SUSTITUCIÓN CONTEXTUAL
=====================================================*/

const UCMIMotorSustitucionContextual = {

    elementoArrastrado: null,


    /*=====================================================
        GENERAR
    =====================================================*/

    generar(configuracion = {}){

        const contenedor =
            document.getElementById(configuracion.contenedor);

        if(!contenedor){

            console.error(
                "UCMI Modelo 14: no se encontró el contenedor."
            );

            return;

        }


        const ejercicio =
            configuracion.sustitucionContextual || {};


        console.log(
            "MOTOR MODELO 14 - SUSTITUCIÓN CONTEXTUAL:",
            ejercicio
        );


        /*=================================================
            CONTENEDOR PRINCIPAL
        =================================================*/

        const bloque =
            document.createElement("div");

        bloque.className =
            "ucmi-sustitucion-contextual";


        /*=================================================
            ESTILOS
        =================================================*/

        const estilos =
            document.createElement("style");

        estilos.textContent = `

            .ucmi-sustitucion-contextual{
                width:94%;
                max-width:1200px;
                margin:30px auto;
            }


            /*=============================================
                DOS PANELES INDEPENDIENTES
            =============================================*/

            .sc-columnas{
                width:100%;
                display:grid;
                grid-template-columns:minmax(0, 1.7fr) minmax(280px, 1fr);
                gap:25px;
                align-items:start;
            }


            /*=============================================
                PANEL DE LECTURA
            =============================================*/

            .sc-panel-lectura{
                height:70vh;
                overflow-y:auto;
                padding:10px 18px 30px 5px;
                box-sizing:border-box;
                background:#f8f9fa;
                border-radius:18px;
                box-shadow:
                    0 6px 16px rgba(0,0,0,.12);
            }


            /*=============================================
                PANEL DEL BANCO
            =============================================*/

            .sc-panel-banco{
                height:70vh;
                overflow-y:auto;
                padding:20px;
                box-sizing:border-box;
                background:#ffffff;
                border-radius:18px;
                box-shadow:
                    0 6px 16px rgba(0,0,0,.15);

                position:sticky;
                top:20px;
            }


            .sc-parrafo-contenedor{
                width:100%;
                margin:0 auto 30px auto;
            }

            .sc-numero-parrafo{
                font-size:1.15em;
                font-weight:bold;
                margin-bottom:12px;
                color:#071426;
            }


            .sc-parrafo{
                width:100%;
                box-sizing:border-box;
                padding:24px;
                background:#ffffff;
                border-radius:16px;
                box-shadow:0 6px 16px rgba(0,0,0,.15);
                font-size:1.2em;
                line-height:1.8;
                color:#071426;
            }


            /*=============================================
                FRASE ORIGINAL COMPLETA
            =============================================*/

            .sc-segmento-original{
                display:inline-block;
                padding:5px 10px;
                margin:2px 3px;
                background:#f39c12;
                color:#071426;
                border:2px solid #d68910;
                border-radius:8px;
                font-weight:bold;
                cursor:pointer;
            }


            .sc-segmento-original.sc-destino-hover{
                outline:4px solid rgba(243,156,18,.30);
                outline-offset:2px;
            }


            /*=============================================
                FRASE AZUL YA COLOCADA
            =============================================*/

            .sc-sustitucion-colocada{
                display:inline-block;
                padding:5px 10px;
                margin:2px 3px;
                background:#1565c0;
                color:white;
                border:2px solid #0d47a1;
                border-radius:8px;
                font-weight:bold;
            }


            /*=============================================
                TÍTULO DEL BANCO
            =============================================*/

            .sc-banco-titulo{
                margin-top:35px;
                margin-bottom:12px;
                font-size:1.1em;
                font-weight:bold;
                color:#071426;
            }


            /*=============================================
                BANCO
            =============================================*/

            .sc-banco{
                width:100%;
                min-height:90px;
                box-sizing:border-box;
                padding:20px;
                background:#f8f9fa;
                border-radius:18px;
                box-shadow:
                    0 6px 16px rgba(0,0,0,.12);

                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                align-items:center;
                gap:12px;
            }


            /*=============================================
                OPCIONES AZULES
            =============================================*/

            .sc-opcion-azul{
                display:inline-block;
                padding:11px 18px;
                background:#1565c0;
                color:white;
                border:2px solid #0d47a1;
                border-radius:12px;
                font-weight:bold;
                cursor:grab;
                user-select:none;
                box-shadow:
                    0 5px 12px rgba(0,0,0,.18);

                transition:.2s;
            }


            .sc-opcion-azul:hover{
                transform:translateY(-2px);

                box-shadow:
                    0 8px 16px rgba(0,0,0,.25);
            }


            .sc-opcion-azul:active{
                cursor:grabbing;
            }


            /*=============================================
                FRASE ORIGINAL QUE REGRESA AL BANCO
            =============================================*/

            .sc-original-banco{
                display:inline-block;
                padding:11px 18px;
                background:#f39c12;
                color:#071426;
                border:2px solid #d68910;
                border-radius:12px;
                font-weight:bold;
                user-select:none;
            }

            @media (max-width:800px){

                .sc-columnas{
                    grid-template-columns:1fr;
                }


                .sc-panel-lectura,
                .sc-panel-banco{
                    height:60vh;
                    position:static;
                }

            }

        `;

        bloque.appendChild(estilos);


        /*=================================================
            TÍTULO
        =================================================*/

        if(ejercicio.nombre){

            const titulo =
                document.createElement("h2");

            titulo.textContent =
                ejercicio.nombre;

            titulo.style.textAlign =
                "center";

            titulo.style.margin =
                "30px auto";

            bloque.appendChild(titulo);

        }

                /*=================================================
            INSTRUCCIÓN DEL EJERCICIO
        =================================================*/

        const instruccion =
            document.createElement("div");

        instruccion.className =
            "instruccion-ejercicio";

        instruccion.textContent =
            (++contadorEjercicios) +
            ". Arrastra una opción azul sobre la frase naranja que deseas sustituir para que la lectura mantenga el mismo sentido lo más posible.";

        bloque.appendChild(
            instruccion
        );


        /*=================================================
            PÁRRAFOS
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
                ? ejercicio.parrafos
                : [];


        /*=================================================
            ESTRUCTURA DE DOS PANELES
        =================================================*/

        const columnas =
            document.createElement("div");

        columnas.className =
            "sc-columnas";


        /*=================================================
            PANEL DE LECTURA
        =================================================*/

        const panelLectura =
            document.createElement("div");

        panelLectura.className =
            "sc-panel-lectura";


        /*=================================================
            PANEL DEL BANCO
        =================================================*/

        const panelBanco =
            document.createElement("div");

        panelBanco.className =
            "sc-panel-banco";


        /*=================================================
            TÍTULO DEL BANCO
        =================================================*/

        const bancoTitulo =
            document.createElement("div");

        bancoTitulo.className =
            "sc-banco-titulo";

        bancoTitulo.textContent =
            "Arrastra una opción azul sobre la frase naranja que deseas sustituir:";


        const banco =
            document.createElement("div");

        banco.className =
            "sc-banco";


        /*=================================================
            CONSTRUIR CADA PÁRRAFO
        =================================================*/

        parrafos.forEach((parrafo, indiceParrafo)=>{

            const contenedorParrafo =
                document.createElement("div");

            contenedorParrafo.className =
                "sc-parrafo-contenedor";



            /*---------------------------------------------
                TEXTO DEL PÁRRAFO
            ---------------------------------------------*/

            const texto =
                document.createElement("div");

            texto.className =
                "sc-parrafo";


            const palabras =
                String(parrafo.texto || "")
                    .trim()
                    .split(/\s+/);


            let inicio =
                Number(parrafo.inicio);

            let fin =
                Number(parrafo.fin);


            /*
                Excel utiliza posiciones de palabras
                comenzando desde 1 y con FIN incluido.

                JavaScript utiliza índices comenzando
                desde 0 y slice() excluye el segundo límite.
            */

            if(!Number.isFinite(inicio)){

                inicio = 1;

            }

            if(!Number.isFinite(fin)){

                fin = inicio;

            }


            inicio =
                Math.max(
                    1,
                    Math.min(inicio, palabras.length)
                );


            fin =
                Math.max(
                    inicio,
                    Math.min(fin, palabras.length)
                );


            const indiceInicio =
                inicio - 1;

            const indiceFin =
                fin;


            /*=================================================
                PARTE ANTERIOR A LA FRASE
            =================================================*/

            if(indiceInicio > 0){

                texto.appendChild(
                    document.createTextNode(
                        palabras
                            .slice(0, indiceInicio)
                            .join(" ")
                        + " "
                    )
                );

            }


            /*=================================================
                ÚNICO SEGMENTO NARANJA
            =================================================*/

            const segmento =
                document.createElement("span");

            segmento.className =
                "sc-segmento-original";


            segmento.textContent =
                palabras
                    .slice(indiceInicio, indiceFin)
                    .join(" ");


            segmento.dataset.parrafo =
                indiceParrafo;

            segmento.dataset.inicio =
                inicio;

            segmento.dataset.fin =
                fin;


            texto.appendChild(
                segmento
            );


            /*=================================================
                PARTE POSTERIOR A LA FRASE
            =================================================*/

            if(indiceFin < palabras.length){

                texto.appendChild(
                    document.createTextNode(
                        " " +
                        palabras
                            .slice(indiceFin)
                            .join(" ")
                    )
                );

            }


            contenedorParrafo.appendChild(
                texto
            );


            /*=================================================
                PÁRRAFO AL PANEL DE LECTURA
            =================================================*/

            panelLectura.appendChild(
                contenedorParrafo
            );


            /*=================================================
                OPCIONES DEL PÁRRAFO
            =================================================*/

            const opciones = [];


            /*---------------------------------------------
                CORRECTA
            ---------------------------------------------*/

            if(parrafo.correcta){

                opciones.push({

                    texto:
                        parrafo.correcta,

                    correcta:
                        true

                });

            }


            /*---------------------------------------------
                INCORRECTAS
            ---------------------------------------------*/

            if(
                Array.isArray(
                    parrafo.incorrectas
                )
            ){

                parrafo.incorrectas.forEach(
                    opcion=>{

                        opciones.push({

                            texto:
                                opcion,

                            correcta:
                                false

                        });

                    }
                );

            }


            /*=================================================
                MEZCLAR OPCIONES
            =================================================*/

            for(
                let i = opciones.length - 1;
                i > 0;
                i--
            ){

                const j =
                    Math.floor(
                        Math.random() * (i + 1)
                    );


                [
                    opciones[i],
                    opciones[j]
                ] =
                [
                    opciones[j],
                    opciones[i]
                ];

            }


            /*=================================================
                CREAR OPCIONES AZULES
            =================================================*/

            opciones.forEach(opcion=>{

                const boton =
                    document.createElement("div");


                boton.className =
                    "sc-opcion-azul";


                boton.textContent =
                    opcion.texto;


                boton.draggable =
                    true;


                boton.dataset.parrafo =
                    indiceParrafo;


                boton.dataset.correcta =
                    opcion.correcta
                        ? "true"
                        : "false";


                /*-----------------------------------------
                    DRAG START
                -----------------------------------------*/

                boton.addEventListener(
                    "dragstart",
                    evento=>{

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            boton;


                        evento.dataTransfer.effectAllowed =
                            "move";


                        evento.dataTransfer.setData(
                            "text/plain",
                            "sustitucion-contextual"
                        );

                    }
                );


                /*-----------------------------------------
                    DRAG END
                -----------------------------------------*/

                boton.addEventListener(
                    "dragend",
                    ()=>{

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            null;

                    }
                );


                banco.appendChild(
                    boton
                );

            });

        });


        /*=================================================
            BANCO
        =================================================*/

        panelBanco.appendChild(
            bancoTitulo
        );

        panelBanco.appendChild(
            banco
        );


        /*=================================================
            ARMAR LAS DOS COLUMNAS
        =================================================*/

        columnas.appendChild(
            panelLectura
        );

        columnas.appendChild(
            panelBanco
        );


        bloque.appendChild(
            columnas
        );


        /*=================================================
    DESTINOS DE DROP
=================================================*/

function activarDestinoDrop(destino){

    /*---------------------------------------------
        DRAG OVER
    ---------------------------------------------*/

    destino.addEventListener(
        "dragover",
        evento=>{

            evento.preventDefault();

            destino.classList.add(
                "sc-destino-hover"
            );

        }
    );


    /*---------------------------------------------
        DRAG LEAVE
    ---------------------------------------------*/

    destino.addEventListener(
        "dragleave",
        ()=>{

            destino.classList.remove(
                "sc-destino-hover"
            );

        }
    );


    /*---------------------------------------------
        DROP
    ---------------------------------------------*/

    destino.addEventListener(
        "drop",
        evento=>{

            evento.preventDefault();


            destino.classList.remove(
                "sc-destino-hover"
            );


            const opcion =
                UCMIMotorSustitucionContextual
                    .elementoArrastrado;


            if(!opcion){

                return;

            }


            /*-------------------------------------
                SOLO ACEPTAMOS OPCIONES DEL BANCO
            -------------------------------------*/

            if(
                !opcion.classList.contains(
                    "sc-opcion-azul"
                )
            ){

                return;

            }


            /*=====================================
                GUARDAR EL CONTENIDO ACTUAL
            =====================================*/

            const textoAnterior =
                destino.textContent;


            /*=====================================
                CREAR ELEMENTO PARA DEVOLVER
                AL BANCO
            =====================================*/

            const elementoBanco =
                document.createElement("div");


            elementoBanco.textContent =
                textoAnterior;


            /*-------------------------------------
                SI ERA LA FRASE ORIGINAL,
                CONSERVA SU COLOR NARANJA
            -------------------------------------*/

            if(
                destino.classList.contains(
                    "sc-segmento-original"
                )
            ){

                elementoBanco.className =
                    "sc-original-banco";


                elementoBanco.dataset.parrafo =
                    destino.dataset.parrafo;


                elementoBanco.dataset.inicio =
                    destino.dataset.inicio;


                elementoBanco.dataset.fin =
                    destino.dataset.fin;

            }


            /*-------------------------------------
                SI ERA UNA SUSTITUCIÓN AZUL,
                REGRESA COMO OPCIÓN AZUL
            -------------------------------------*/

            else
            if(
                destino.classList.contains(
                    "sc-sustitucion-colocada"
                )
            ){

                elementoBanco.className =
                    "sc-opcion-azul";


                elementoBanco.draggable =
                    true;


                elementoBanco.dataset.parrafo =
                    destino.dataset.parrafo;


                elementoBanco.dataset.correcta =
                    destino.dataset.correcta;


                /*---------------------------------
                    DRAG START
                ---------------------------------*/

                elementoBanco.addEventListener(
                    "dragstart",
                    evento=>{

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            elementoBanco;


                        evento.dataTransfer.effectAllowed =
                            "move";


                        evento.dataTransfer.setData(
                            "text/plain",
                            "sustitucion-contextual"
                        );

                    }
                );


                /*---------------------------------
                    DRAG END
                ---------------------------------*/

                elementoBanco.addEventListener(
                    "dragend",
                    ()=>{

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            null;

                    }
                );

            }


            /*=====================================
                DEVOLVER ELEMENTO AL BANCO
            =====================================*/

            banco.appendChild(
                elementoBanco
            );


            /*=====================================
                CREAR NUEVA SUSTITUCIÓN AZUL
            =====================================*/

            const sustitucion =
                document.createElement("span");


            sustitucion.className =
                "sc-sustitucion-colocada";


            sustitucion.textContent =
                opcion.textContent;


            sustitucion.dataset.parrafo =
                destino.dataset.parrafo;


            sustitucion.dataset.correcta =
                opcion.dataset.correcta;


            /*=====================================
                ACTIVAR ESTE NUEVO ELEMENTO
                COMO DESTINO DE DROP
            =====================================*/

            activarDestinoDrop(
                sustitucion
            );


            /*=====================================
                REEMPLAZAR EL DESTINO ACTUAL
            =====================================*/

            destino.replaceWith(
                sustitucion
            );


            /*=====================================
                QUITAR LA OPCIÓN DEL BANCO
            =====================================*/

            opcion.remove();


            UCMIMotorSustitucionContextual
                .elementoArrastrado =
                null;

        }
    );

}


/*=================================================
    ACTIVAR DESTINOS NARANJAS INICIALES
=================================================*/

bloque
    .querySelectorAll(
        ".sc-segmento-original"
    )
    .forEach(
        destino=>{

            activarDestinoDrop(
                destino
            );

        }
    );

        /*=================================================
            BOTÓN ÚNICO DE EVALUACIÓN
        =================================================*/

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

                const segmentos =
                    bloque.querySelectorAll(
                        ".sc-sustitucion-colocada"
                    );


                segmentos.forEach(
                    sustitucion => {

                        const resultadoCorrecto =
                            sustitucion.dataset.correcta ===
                            "true";


                        if(resultadoCorrecto){

                            sustitucion.style.background =
                                "#c8f7c5";

                            sustitucion.style.color =
                                "#15803d";

                            sustitucion.style.border =
                                "2px solid #15803d";

                        }else{

                            sustitucion.style.background =
                                "#ffcdd2";

                            sustitucion.style.color =
                                "#b71c1c";

                            sustitucion.style.border =
                                "2px solid #b71c1c";

                        }

                    }
                );

            }
        );


        bloque.appendChild(
            botonEvaluar
        );


        /*=================================================
            INSERTAR MOTOR EN LA PÁGINA
        =================================================*/

        contenedor.appendChild(
            bloque
        );

    }

};


/*=====================================================
    EXPOSICIÓN GLOBAL
=====================================================*/

window.UCMIMotorSustitucionContextual =
    UCMIMotorSustitucionContextual;
