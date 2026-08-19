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
            CONTENEDOR PRINCIPAL
        =================================================*/

        const bloque =
            document.createElement("div");

        bloque.className =
            "modelo14-sustitucion-contextual";


        /*=================================================
            ESTILOS DEL MODELO 14
        =================================================*/

        const estilo =
            document.createElement("style");

        estilo.textContent = `

            .modelo14-sustitucion-contextual{
                width:100%;
                margin:0 auto;
            }

            .modelo14-parrafo{
                width:92%;
                margin:0 auto 40px auto;
            }

            .modelo14-numero{
                margin-bottom:12px;
                font-size:1.1em;
                font-weight:bold;
                color:#071426;
            }

            .modelo14-texto{
                width:100%;
                padding:22px;
                box-sizing:border-box;
                background:white;
                border:2px solid #ddd;
                border-radius:16px;
                box-shadow:0 5px 15px rgba(0,0,0,.12);
                font-size:1.15em;
                line-height:1.8;
                color:#071426;
            }

            .modelo14-zona-drop{
                display:inline-block;
                padding:4px 9px;
                margin:0 3px;
                background:#f39c12;
                color:#071426;
                border:2px solid #e67e22;
                border-radius:8px;
                font-weight:bold;
                min-height:1.2em;
                cursor:default;
                transition:.2s;
            }

            .modelo14-zona-drop.activa{
                background:#f1c40f;
                border:3px dashed #d35400;
                transform:scale(1.02);
            }

            .modelo14-banco{
                width:100%;
                margin-top:20px;
                padding:20px;
                box-sizing:border-box;
                background:#f5f8ff;
                border:2px solid #d5dff5;
                border-radius:16px;
                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                align-items:center;
                gap:12px;
            }

            .modelo14-opcion{
                display:inline-block;
                padding:12px 18px;
                background:#1565c0;
                color:white;
                border:none;
                border-radius:12px;
                font-size:1em;
                font-weight:bold;
                cursor:grab;
                box-shadow:0 5px 12px rgba(0,0,0,.20);
                user-select:none;
                transition:.2s;
            }

            .modelo14-opcion:hover{
                transform:translateY(-3px);
                box-shadow:0 8px 16px rgba(0,0,0,.25);
            }

            .modelo14-opcion:active{
                cursor:grabbing;
                transform:scale(.97);
            }

            .modelo14-instruccion{
                width:92%;
                margin:0 auto 30px auto;
                padding:18px 22px;
                box-sizing:border-box;
                background:#eef6ff;
                border-left:8px solid #3949AB;
                border-radius:14px;
                box-shadow:0 6px 14px rgba(0,0,0,.15);
                font-size:1.15em;
                line-height:1.6;
                color:#071426;
                font-weight:bold;
            }

        `;

        bloque.appendChild(estilo);


        /*=================================================
            INSTRUCCIÓN
        =================================================*/

        const instruccion =
            document.createElement("div");

        instruccion.className =
            "modelo14-instruccion";

        instruccion.textContent =
            "Arrastra una opción azul sobre la parte naranja que deseas sustituir.";

        bloque.appendChild(instruccion);


        /*=================================================
            PÁRRAFOS
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
                ? ejercicio.parrafos
                : [];


        parrafos.forEach((parrafo, indice)=>{


            /*=============================================
                CONTENEDOR DEL PÁRRAFO
            =============================================*/

            const contenedorParrafo =
                document.createElement("div");

            contenedorParrafo.className =
                "modelo14-parrafo";


            /*=============================================
                NÚMERO
            =============================================*/

            const numero =
                document.createElement("div");

            numero.className =
                "modelo14-numero";

            numero.textContent =
                parrafo.numero ||
                `Párrafo ${indice + 1}`;

            contenedorParrafo.appendChild(numero);


            /*=============================================
                TEXTO ORIGINAL
            =============================================*/

            const texto =
                document.createElement("div");

            texto.className =
                "modelo14-texto";


            /*=============================================
                PALABRAS DEL TEXTO
            =============================================*/

            const palabras =
                String(parrafo.texto || "")
                .trim()
                .split(/\s+/);


            const inicio =
                Number(parrafo.inicio);

            const fin =
                Number(parrafo.fin);


            console.log(
                "MODELO 14 - POSICIONES:",
                {
                    parrafo: indice + 1,
                    palabras,
                    inicio,
                    fin,
                    segmento:
                        palabras.slice(inicio, fin).join(" ")
                }
            );


            /*=============================================
                PARTE ANTERIOR AL SEGMENTO
            =============================================*/

            for(
                let i = 0;
                i < inicio && i < palabras.length;
                i++
            ){

                texto.appendChild(
                    document.createTextNode(
                        palabras[i]
                    )
                );

                if(i < palabras.length - 1){

                    texto.appendChild(
                        document.createTextNode(" ")
                    );

                }

            }


            /*=============================================
                SEGMENTO QUE SE PUEDE SUSTITUIR
            =============================================*/

            const segmento =
                palabras
                .slice(inicio, fin)
                .join(" ");


            const zonaDrop =
                document.createElement("span");

            zonaDrop.className =
                "modelo14-zona-drop";

            zonaDrop.textContent =
                segmento;

            zonaDrop.dataset.original =
                segmento;

            zonaDrop.dataset.parrafo =
                indice;


            /*=============================================
                DRAGOVER

                La zona naranja NO es draggable.
                Solamente recibe elementos.
            =============================================*/

            zonaDrop.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    evento.dataTransfer.dropEffect =
                        "move";

                    zonaDrop.classList.add(
                        "activa"
                    );

                }
            );


            /*=============================================
                DRAGLEAVE
            =============================================*/

            zonaDrop.addEventListener(
                "dragleave",
                ()=>{

                    zonaDrop.classList.remove(
                        "activa"
                    );

                }
            );


            /*=============================================
                DROP

                POR AHORA SOLO COMPROBAMOS QUE
                EL DROP ESTÁ FUNCIONANDO.
            =============================================*/

            zonaDrop.addEventListener(
                "drop",
                evento=>{

                    evento.preventDefault();

                    zonaDrop.classList.remove(
                        "activa"
                    );


                    const textoRecibido =
                        evento.dataTransfer.getData(
                            "text/plain"
                        );


                    console.log(
                        "DROP MODELO 14:",
                        textoRecibido
                    );


                    /*
                        NO hacemos todavía el intercambio.

                        Esta prueba solamente confirma que:

                        AZUL
                          ↓
                        DRAG
                          ↓
                        NARANJA
                          ↓
                        DROP
                          ↓
                        TEXTO RECIBIDO
                    */

                }
            );


            texto.appendChild(
                zonaDrop
            );


            /*=============================================
                PARTE POSTERIOR AL SEGMENTO
            =============================================*/

            for(
                let i = fin;
                i < palabras.length;
                i++
            ){

                if(
                    texto.lastChild &&
                    texto.lastChild.nodeType ===
                    Node.TEXT_NODE
                ){

                    texto.appendChild(
                        document.createTextNode(" ")
                    );

                }else{

                    texto.appendChild(
                        document.createTextNode(" ")
                    );

                }

                texto.appendChild(
                    document.createTextNode(
                        palabras[i]
                    )
                );

            }


            contenedorParrafo.appendChild(
                texto
            );


            /*=============================================
                BANCO DE OPCIONES
            =============================================*/

            const banco =
                document.createElement("div");

            banco.className =
                "modelo14-banco";


            /*=============================================
                CONSTRUIR LAS OPCIONES

                1 correcta
                3 incorrectas

                TODAS JUNTAS.
            =============================================*/

            const opciones = [

                {
                    texto:parrafo.correcta,
                    correcta:true
                },

                ...(Array.isArray(parrafo.incorrectas)
                    ? parrafo.incorrectas.map(
                        opcion=>({
                            texto:opcion,
                            correcta:false
                        })
                    )
                    : [])

            ];


            /*=============================================
                MEZCLAR OPCIONES
            =============================================*/

            opciones.sort(
                ()=>Math.random() - 0.5
            );


            /*=============================================
                CREAR OPCIONES AZULES
            =============================================*/

            opciones.forEach(opcion=>{

                if(!opcion.texto){

                    return;

                }


                const elemento =
                    document.createElement("div");

                elemento.className =
                    "modelo14-opcion";

                elemento.textContent =
                    opcion.texto;

                elemento.draggable =
                    true;

                elemento.dataset.texto =
                    opcion.texto;

                elemento.dataset.correcta =
                    opcion.correcta
                        ? "true"
                        : "false";


                /*=========================================
                    DRAGSTART
                =========================================*/

                elemento.addEventListener(
                    "dragstart",
                    evento=>{

                        evento.dataTransfer.setData(
                            "text/plain",
                            opcion.texto
                        );

                        evento.dataTransfer.effectAllowed =
                            "move";

                        console.log(
                            "DRAG MODELO 14:",
                            opcion.texto
                        );

                    }
                );


                /*=========================================
                    DRAGEND
                =========================================*/

                elemento.addEventListener(
                    "dragend",
                    ()=>{

                        console.log(
                            "FIN DRAG MODELO 14:",
                            opcion.texto
                        );

                    }
                );


                banco.appendChild(
                    elemento
                );

            });


            /*=============================================
                AGREGAR BANCO AL PÁRRAFO
            =============================================*/

            contenedorParrafo.appendChild(
                banco
            );


            /*=============================================
                AGREGAR PÁRRAFO AL MODELO
            =============================================*/

            bloque.appendChild(
                contenedorParrafo
            );

        });


        /*=================================================
            AGREGAR MODELO AL CONTENEDOR
        =================================================*/

        contenedor.appendChild(
            bloque
        );


        console.log(
            "MODELO 14 - RENDER COMPLETADO."
        );

    }

};


/*=====================================================
    EXPOSICIÓN GLOBAL
=====================================================*/

window.UCMIMotorSustitucionContextual =
    UCMIMotorSustitucionContextual;
