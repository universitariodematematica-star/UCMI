/*=====================================================
    MOTOR MODELO 14
    SUSTITUCIÓN CONTEXTUAL
=====================================================*/

const UCMIMotorSustitucionContextual = {

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
            LIMPIAR CONTENEDOR
        =================================================*/

        const bloque =
            document.createElement("div");

        bloque.className =
            "ucmi-sustitucion-contextual";


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
            ESTILOS DEL MODELO 14
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


            /*---------------------------------------------
                SEGMENTO ORIGINAL
            ---------------------------------------------*/

            .sc-segmento-original{
                display:inline-block;
                padding:5px 10px;
                margin:2px 3px;
                background:#f39c12;
                color:#071426;
                border:2px solid #d68910;
                border-radius:8px;
                font-weight:bold;
                min-width:20px;
                cursor:pointer;
                transition:.2s;
            }


            .sc-segmento-original.sc-destino-activo{
                box-shadow:
                    0 0 0 4px rgba(243,156,18,.25);
            }


            /*---------------------------------------------
                SUSTITUCIÓN COLOCADA EN EL PÁRRAFO
            ---------------------------------------------*/

            .sc-sustitucion-colocada{
                display:inline-block;
                padding:5px 10px;
                margin:2px 3px;
                background:#1565c0;
                color:white;
                border:2px solid #0d47a1;
                border-radius:8px;
                font-weight:bold;
                cursor:default;
            }


            /*---------------------------------------------
                BANCO DE OPCIONES
            ---------------------------------------------*/

            .sc-banco-titulo{
                margin-top:35px;
                margin-bottom:12px;
                font-size:1.1em;
                font-weight:bold;
                color:#071426;
            }


            .sc-banco{
                width:100%;
                box-sizing:border-box;
                min-height:90px;
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


            /*---------------------------------------------
                OPCIONES AZULES
            ---------------------------------------------*/

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


            /*---------------------------------------------
                ORIGINAL QUE REGRESA AL BANCO
            ---------------------------------------------*/

            .sc-original-banco{
                display:inline-block;
                padding:11px 18px;
                background:#f39c12;
                color:#071426;
                border:2px solid #d68910;
                border-radius:12px;
                font-weight:bold;
                cursor:default;
                user-select:none;
            }


            /*---------------------------------------------
                DESTINO DURANTE DRAG
            ---------------------------------------------*/

            .sc-destino-hover{
                outline:4px solid rgba(243,156,18,.35);
                outline-offset:2px;
            }


            /*---------------------------------------------
                EXPLICACIÓN
            ---------------------------------------------*/

            .sc-explicacion{
                margin-top:20px;
                padding:16px 20px;
                background:#eef6ff;
                border-left:7px solid #3949AB;
                border-radius:12px;
                line-height:1.6;
                color:#071426;
            }

        `;

        bloque.appendChild(estilos);


        /*=================================================
            VARIABLES
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
                ? ejercicio.parrafos
                : [];


        /*
            Banco global del ejercicio.

            Cada opción azul pertenece a un segmento
            original determinado mediante su índice.
        */

        const banco =
            document.createElement("div");

        banco.className =
            "sc-banco";


        /*=================================================
            CONSTRUIR PÁRRAFOS
        =================================================*/

        parrafos.forEach((parrafo, indiceParrafo)=>{

            const contenedorParrafo =
                document.createElement("div");

            contenedorParrafo.className =
                "sc-parrafo-contenedor";


            /*---------------------------------------------
                NÚMERO DEL PÁRRAFO
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
                CONTENEDOR DEL TEXTO
            ---------------------------------------------*/

            const texto =
                document.createElement("div");

            texto.className =
                "sc-parrafo";


            const palabras =
                String(parrafo.texto || "")
                .split(/\s+/);


            const inicio =
                Number.isFinite(Number(parrafo.inicio))
                    ? Number(parrafo.inicio)
                    : 0;


            const fin =
                Number.isFinite(Number(parrafo.fin))
                    ? Number(parrafo.fin)
                    : inicio;


            /*
                El segmento original se obtiene mediante
                inicio / fin.

                fin se interpreta como límite exclusivo.
            */

            palabras.forEach((palabra, indicePalabra)=>{

                const espacio =
                    document.createTextNode(
                        indicePalabra === 0
                            ? ""
                            : " "
                    );

                texto.appendChild(espacio);


                if(
                    indicePalabra >= inicio &&
                    indicePalabra < fin
                ){

                    const segmento =
                        document.createElement("span");

                    segmento.className =
                        "sc-segmento-original";

                    segmento.textContent =
                        palabra;


                    segmento.dataset.parrafo =
                        indiceParrafo;

                    segmento.dataset.inicio =
                        indicePalabra;

                    segmento.dataset.fin =
                        indicePalabra + 1;


                    texto.appendChild(segmento);

                }else{

                    texto.appendChild(
                        document.createTextNode(palabra)
                    );

                }

            });


            contenedorParrafo.appendChild(texto);

            bloque.appendChild(contenedorParrafo);


            /*=================================================
                CREAR BANCO DE OPCIONES DEL PÁRRAFO
            =================================================*/

            const opciones = [];

            if(parrafo.correcta){

                opciones.push({
                    texto: parrafo.correcta,
                    correcta: true
                });

            }


            if(Array.isArray(parrafo.incorrectas)){

                parrafo.incorrectas.forEach(opcion=>{

                    opciones.push({
                        texto: opcion,
                        correcta: false
                    });

                });

            }


            /*---------------------------------------------
                MEZCLAR OPCIONES
            ---------------------------------------------*/

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


            /*---------------------------------------------
                CREAR BOTONES AZULES
            ---------------------------------------------*/

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


                boton.addEventListener(
                    "dragstart",
                    evento=>{

                        evento.dataTransfer.effectAllowed =
                            "move";

                        evento.dataTransfer.setData(
                            "text/plain",
                            "sc-opcion"
                        );

                        /*
                            Guardamos directamente la referencia
                            al botón que se está arrastrando.
                        */

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            boton;

                    }
                );


                boton.addEventListener(
                    "dragend",
                    ()=>{

                        UCMIMotorSustitucionContextual
                            .elementoArrastrado =
                            null;

                    }
                );


                banco.appendChild(boton);

            });

        });


        /*=================================================
            TÍTULO DEL BANCO
        =================================================*/

        const bancoTitulo =
            document.createElement("div");

        bancoTitulo.className =
            "sc-banco-titulo";

        bancoTitulo.textContent =
            "Arrastra una opción azul sobre la parte naranja que deseas sustituir:";

        bloque.appendChild(bancoTitulo);

        bloque.appendChild(banco);


        /*=================================================
            DRAG OVER
        =================================================*/

        bloque.querySelectorAll(
            ".sc-segmento-original"
        ).forEach(destino=>{

            destino.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    destino.classList.add(
                        "sc-destino-hover"
                    );

                }
            );


            destino.addEventListener(
                "dragleave",
                ()=>{

                    destino.classList.remove(
                        "sc-destino-hover"
                    );

                }
            );


            /*=================================================
                DROP
            =================================================*/

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
                        Solo permitimos que una opción azul
                        se coloque sobre un segmento naranja.
                    */

                    if(
                        !opcion.classList.contains(
                            "sc-opcion-azul"
                        )
                    ){

                        return;

                    }


                    /*-----------------------------------------
                        CREAR EL ORIGINAL NARANJA PARA EL BANCO
                    -----------------------------------------*/

                    const originalBanco =
                        document.createElement("div");

                    originalBanco.className =
                        "sc-original-banco";

                    originalBanco.textContent =
                        destino.textContent;


                    originalBanco.dataset.parrafo =
                        destino.dataset.parrafo;

                    originalBanco.dataset.inicio =
                        destino.dataset.inicio;

                    originalBanco.dataset.fin =
                        destino.dataset.fin;


                    /*
                        El original naranja vuelve al banco.
                    */

                    banco.appendChild(
                        originalBanco
                    );


                    /*-----------------------------------------
                        CONVERTIR LA OPCIÓN AZUL EN ELEMENTO
                        COLOCADO DENTRO DEL PÁRRAFO
                    -----------------------------------------*/

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
                        Conservamos el color azul.
                    */

                    /*-----------------------------------------
                        REEMPLAZAR NARANJA POR AZUL
                    -----------------------------------------*/

                    destino.replaceWith(
                        sustitucion
                    );


                    /*-----------------------------------------
                        QUITAR EL AZUL DEL BANCO
                    -----------------------------------------*/

                    opcion.remove();


                    /*
                        El elemento azul ya está colocado
                        dentro del párrafo y permanece azul.

                        El elemento naranja original queda
                        nuevamente disponible en el banco.
                    */

                    UCMIMotorSustitucionContextual
                        .elementoArrastrado =
                        null;

                }
            );

        });


        /*=================================================
            COLOCAR EL BLOQUE EN LA PÁGINA
        =================================================*/

        contenedor.appendChild(
            bloque
        );

    },


    /*=====================================================
        REFERENCIA AL ELEMENTO QUE SE ESTÁ ARRASTRANDO
    =====================================================*/

    elementoArrastrado:null

};


/*=====================================================
    EXPOSICIÓN GLOBAL
=====================================================*/

window.UCMIMotorSustitucionContextual =
    UCMIMotorSustitucionContextual;
