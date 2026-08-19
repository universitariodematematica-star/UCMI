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
                max-width:1100px;
                margin:30px auto;
            }


            .sc-parrafo-contenedor{
                width:100%;
                margin:35px auto;
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
            PÁRRAFOS
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
                ? ejercicio.parrafos
                : [];


        /*=================================================
            BANCO GLOBAL
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
                NÚMERO
            ---------------------------------------------*/

            const numero =
                document.createElement("div");

            numero.className =
                "sc-numero-parrafo";

            numero.textContent =
                parrafo.numero ||
                `Párrafo ${indiceParrafo + 1}`;

            contenedorParrafo.appendChild(numero);


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
                Validación básica.

                inicio y fin representan el rango
                COMPLETO de la frase a sustituir.
            */

            if(!Number.isFinite(inicio)){

                inicio = 0;

            }

            if(!Number.isFinite(fin)){

                fin = inicio;

            }


            inicio =
                Math.max(
                    0,
                    Math.min(inicio, palabras.length)
                );


            fin =
                Math.max(
                    inicio,
                    Math.min(fin, palabras.length)
                );


            /*=================================================
                PARTE ANTERIOR A LA FRASE
            =================================================*/

            if(inicio > 0){

                texto.appendChild(
                    document.createTextNode(
                        palabras
                            .slice(0, inicio)
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


            /*
                AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL:

                TODA la frase entre inicio y fin
                pertenece a UN SOLO contenedor naranja.
            */

            segmento.textContent =
                palabras
                    .slice(inicio, fin)
                    .join(" ");


            segmento.dataset.parrafo =
                indiceParrafo;

            segmento.dataset.inicio =
                inicio;

            segmento.dataset.fin =
                fin;


            texto.appendChild(segmento);


            /*=================================================
                PARTE POSTERIOR A LA FRASE
            =================================================*/

            if(fin < palabras.length){

                texto.appendChild(
                    document.createTextNode(
                        " " +
                        palabras
                            .slice(fin)
                            .join(" ")
                    )
                );

            }


            contenedorParrafo.appendChild(texto);

            bloque.appendChild(
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

        bloque.appendChild(
            bancoTitulo
        );

        bloque.appendChild(
            banco
        );


        /*=================================================
            DESTINOS DE DROP
        =================================================*/

        bloque
            .querySelectorAll(
                ".sc-segmento-original"
            )
            .forEach(destino=>{


                /*-----------------------------------------
                    DRAG OVER
                -----------------------------------------*/

                destino.addEventListener(
                    "dragover",
                    evento=>{

                        evento.preventDefault();

                        destino.classList.add(
                            "sc-destino-hover"
                        );

                    }
                );


                /*-----------------------------------------
                    DRAG LEAVE
                -----------------------------------------*/

                destino.addEventListener(
                    "dragleave",
                    ()=>{

                        destino.classList.remove(
                            "sc-destino-hover"
                        );

                    }
                );


                /*-----------------------------------------
                    DROP
                -----------------------------------------*/

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


                        /*
                            Solo aceptamos opciones azules
                            provenientes del banco.
                        */

                        if(
                            !opcion.classList.contains(
                                "sc-opcion-azul"
                            )
                        ){

                            return;

                        }


                        /*=================================
                            GUARDAR FRASE NARANJA COMPLETA
                        =================================*/

                        const textoOriginal =
                            destino.textContent;


                        /*=================================
                            DEVOLVER NARANJA AL BANCO
                        =================================*/

                        const originalBanco =
                            document.createElement("div");


                        originalBanco.className =
                            "sc-original-banco";


                        originalBanco.textContent =
                            textoOriginal;


                        originalBanco.dataset.parrafo =
                            destino.dataset.parrafo;


                        originalBanco.dataset.inicio =
                            destino.dataset.inicio;


                        originalBanco.dataset.fin =
                            destino.dataset.fin;


                        banco.appendChild(
                            originalBanco
                        );


                        /*=================================
                            CREAR AZUL DENTRO DEL PÁRRAFO
                        =================================*/

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


                        /*
                            IMPORTANTE:

                            El nuevo elemento sigue siendo
                            visualmente AZUL.
                        */


                        /*=================================
                            REEMPLAZAR EL NARANJA
                        =================================*/

                        destino.replaceWith(
                            sustitucion
                        );


                        /*=================================
                            QUITAR AZUL DEL BANCO
                        =================================*/

                        opcion.remove();


                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            null;

                    }
                );

            });


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
