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
            ESTILOS
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

        `;

        bloque.appendChild(estilo);


        /*=================================================
            INSTRUCCIÓN
        =================================================*/

        const instruccion =
            document.createElement("div");

        instruccion.style.width =
            "92%";

        instruccion.style.margin =
            "0 auto 30px auto";

        instruccion.style.padding =
            "18px 22px";

        instruccion.style.boxSizing =
            "border-box";

        instruccion.style.background =
            "#eef6ff";

        instruccion.style.borderLeft =
            "8px solid #3949AB";

        instruccion.style.borderRadius =
            "14px";

        instruccion.style.boxShadow =
            "0 6px 14px rgba(0,0,0,.15)";

        instruccion.style.fontSize =
            "1.15em";

        instruccion.style.lineHeight =
            "1.6";

        instruccion.style.color =
            "#071426";

        instruccion.style.fontWeight =
            "bold";

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
                PALABRAS
            =============================================*/

            const palabras =
                String(parrafo.texto || "")
                .trim()
                .split(/\s+/);


            const inicio =
                Number(parrafo.inicio);

            const fin =
                Number(parrafo.fin);


            const segmentoOriginal =
                palabras
                .slice(inicio, fin)
                .join(" ");


            /*=============================================
                PARTE ANTERIOR
            =============================================*/

            for(
                let i = 0;
                i < inicio &&
                i < palabras.length;
                i++
            ){

                texto.appendChild(
                    document.createTextNode(
                        palabras[i]
                    )
                );

                texto.appendChild(
                    document.createTextNode(" ")
                );

            }


            /*=============================================
                ZONA NARANJA
            =============================================*/

            const zonaDrop =
                document.createElement("span");

            zonaDrop.className =
                "modelo14-zona-drop";

            zonaDrop.textContent =
                segmentoOriginal;

            zonaDrop.dataset.original =
                segmentoOriginal;

            zonaDrop.dataset.actual =
                segmentoOriginal;

            zonaDrop.dataset.parrafo =
                indice;


            /*=============================================
                PARTE POSTERIOR
            =============================================*/

            for(
                let i = fin;
                i < palabras.length;
                i++
            ){

                if(i > fin){

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


            /*=================================================
                BANCO DE OPCIONES
            =================================================*/

            const banco =
                document.createElement("div");

            banco.className =
                "modelo14-banco";


            /*=================================================
                FUNCIÓN PARA CREAR UNA OPCIÓN AZUL
            =================================================*/

            function crearOpcion(
                textoOpcion,
                correcta = false,
                esOriginal = false
            ){

                const elemento =
                    document.createElement("div");

                elemento.className =
                    "modelo14-opcion";

                elemento.textContent =
                    textoOpcion;

                elemento.draggable =
                    true;

                elemento.dataset.texto =
                    textoOpcion;

                elemento.dataset.correcta =
                    correcta
                        ? "true"
                        : "false";

                elemento.dataset.original =
                    esOriginal
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
                            textoOpcion
                        );

                        evento.dataTransfer.effectAllowed =
                            "move";

                        elemento.classList.add(
                            "modelo14-arrastrando"
                        );

                    }
                );


                /*=========================================
                    DRAGEND
                =========================================*/

                elemento.addEventListener(
                    "dragend",
                    ()=>{

                        elemento.classList.remove(
                            "modelo14-arrastrando"
                        );

                    }
                );


                return elemento;

            }


            /*=================================================
                OPCIONES INICIALES
            =================================================*/

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


            /*=================================================
                MEZCLAR OPCIONES
            =================================================*/

            opciones.sort(
                ()=>Math.random() - 0.5
            );


            /*=================================================
                CREAR BANCO INICIAL
            =================================================*/

            opciones.forEach(opcion=>{

                if(!opcion.texto){

                    return;

                }

                banco.appendChild(
                    crearOpcion(
                        opcion.texto,
                        opcion.correcta,
                        false
                    )
                );

            });


            /*=================================================
                DRAGOVER SOBRE ZONA NARANJA
            =================================================*/

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


            /*=================================================
                DRAGLEAVE
            =================================================*/

            zonaDrop.addEventListener(
                "dragleave",
                ()=>{

                    zonaDrop.classList.remove(
                        "activa"
                    );

                }
            );


            /*=================================================
                DROP SOBRE ZONA NARANJA
            =================================================*/

            zonaDrop.addEventListener(
                "drop",
                evento=>{

                    evento.preventDefault();

                    zonaDrop.classList.remove(
                        "activa"
                    );


                    const textoArrastrado =
                        evento.dataTransfer.getData(
                            "text/plain"
                        );


                    if(!textoArrastrado){

                        return;

                    }


                    /*=========================================
                        BUSCAR LA OPCIÓN AZUL UTILIZADA
                    =========================================*/

                    const opcionesBanco =
                        banco.querySelectorAll(
                            ".modelo14-opcion"
                        );


                    let opcionUtilizada =
                        null;


                    opcionesBanco.forEach(opcion=>{

                        if(
                            opcion.dataset.texto ===
                            textoArrastrado
                        ){

                            opcionUtilizada =
                                opcion;

                        }

                    });


                    if(!opcionUtilizada){

                        return;

                    }


                    /*=========================================
                        GUARDAR EL TEXTO QUE ESTABA EN NARANJA
                    =========================================*/

                    const textoAnterior =
                        zonaDrop.textContent;


                    /*=========================================
                        CREAR NUEVA OPCIÓN AZUL
                        CON EL TEXTO ANTERIOR
                    =========================================*/

                    const opcionAnterior =
                        crearOpcion(
                            textoAnterior,
                            false,
                            true
                        );


                    banco.appendChild(
                        opcionAnterior
                    );


                    /*=========================================
                        COLOCAR LA NUEVA OPCIÓN
                        EN LA ZONA NARANJA
                    =========================================*/

                    zonaDrop.textContent =
                        textoArrastrado;

                    zonaDrop.dataset.actual =
                        textoArrastrado;


                    /*=========================================
                        ELIMINAR DEL BANCO
                        LA OPCIÓN UTILIZADA
                    =========================================*/

                    opcionUtilizada.remove();


                    console.log(
                        "MODELO 14 - SUSTITUCIÓN:",
                        {
                            anterior:textoAnterior,
                            nueva:textoArrastrado
                        }
                    );

                }
            );


            /*=================================================
                PERMITIR DEVOLVER EL TEXTO NARANJA
                AL BANCO
            =================================================*/

            banco.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    evento.dataTransfer.dropEffect =
                        "move";

                }
            );


            /*=================================================
                CONSTRUIR EL PÁRRAFO
            =================================================*/

            texto.insertBefore(
                zonaDrop,
                texto.childNodes[inicio] || null
            );


            contenedorParrafo.appendChild(
                texto
            );


            contenedorParrafo.appendChild(
                banco
            );


            bloque.appendChild(
                contenedorParrafo
            );

        });


        /*=================================================
            INSERTAR MODELO EN LA PÁGINA
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
