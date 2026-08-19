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
                "35px 0 25px 0";

            titulo.style.color =
                "#071426";

            bloque.appendChild(titulo);

        }


        /*=================================================
            INSTRUCCIÓN
        =================================================*/

        const instruccion =
            document.createElement("div");

        instruccion.textContent =
            "Arrastra una opción azul sobre la parte naranja que deseas sustituir.";

        instruccion.style.width =
            "92%";

        instruccion.style.margin =
            "0 auto 30px auto";

        instruccion.style.padding =
            "18px 22px";

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

        instruccion.style.fontWeight =
            "bold";

        instruccion.style.color =
            "#071426";

        bloque.appendChild(instruccion);


        /*=================================================
            PÁRRAFOS
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
                ? ejercicio.parrafos
                : [];


        parrafos.forEach((parrafo, indice)=>{

            const contenedorParrafo =
                document.createElement("div");

            contenedorParrafo.className =
                "modelo14-parrafo";

            contenedorParrafo.style.width =
                "92%";

            contenedorParrafo.style.margin =
                "0 auto 35px auto";


            /*=============================================
                NÚMERO DEL PÁRRAFO
            =============================================*/

            const numero =
                document.createElement("div");

            numero.textContent =
                parrafo.numero || `Párrafo ${indice + 1}`;

            numero.style.fontWeight =
                "bold";

            numero.style.fontSize =
                "1.1em";

            numero.style.marginBottom =
                "10px";

            numero.style.color =
                "#071426";

            contenedorParrafo.appendChild(numero);


            /*=============================================
                ORACIÓN / PÁRRAFO ORIGINAL
            =============================================*/

            const texto =
                document.createElement("div");

            texto.className =
                "modelo14-texto";

            texto.style.width =
                "100%";

            texto.style.padding =
                "22px";

            texto.style.background =
                "white";

            texto.style.border =
                "2px solid #ddd";

            texto.style.borderRadius =
                "16px";

            texto.style.boxShadow =
                "0 5px 15px rgba(0,0,0,.12)";

            texto.style.fontSize =
                "1.15em";

            texto.style.lineHeight =
                "1.7";

            texto.style.boxSizing =
                "border-box";


            /*=============================================
                CONSTRUCCIÓN DEL TEXTO

                inicio y fin corresponden a posiciones
                de palabras.
            =============================================*/

            const palabras =
                String(parrafo.texto || "")
                .trim()
                .split(/\s+/);


            const inicio =
                Number(parrafo.inicio);

            const fin =
                Number(parrafo.fin);


            const antes =
                palabras
                .slice(0, inicio);


            const segmentoOriginal =
                palabras
                .slice(inicio, fin)
                .join(" ");


            const despues =
                palabras
                .slice(fin);


            /*=============================================
                TEXTO ANTES
            =============================================*/

            antes.forEach((palabra, i)=>{

                const span =
                    document.createElement("span");

                span.textContent =
                    palabra;

                texto.appendChild(span);

                texto.appendChild(
                    document.createTextNode(" ")
                );

            });


            /*=============================================
                ZONA NARANJA
            =============================================*/

            const zonaSustitucion =
                document.createElement("span");

            zonaSustitucion.className =
                "modelo14-zona-sustitucion";

            zonaSustitucion.dataset.original =
                segmentoOriginal;

            zonaSustitucion.dataset.parrafo =
                indice;

            zonaSustitucion.textContent =
                segmentoOriginal;

            zonaSustitucion.style.display =
                "inline-block";

            zonaSustitucion.style.padding =
                "4px 9px";

            zonaSustitucion.style.margin =
                "0 3px";

            zonaSustitucion.style.background =
                "#f39c12";

            zonaSustitucion.style.color =
                "#071426";

            zonaSustitucion.style.borderRadius =
                "8px";

            zonaSustitucion.style.fontWeight =
                "bold";

            zonaSustitucion.style.cursor =
                "grab";

            zonaSustitucion.draggable =
                true;


            /*=============================================
                EVENTO PARA ARRASTRAR EL ORIGINAL
                HACIA EL BANCO
            =============================================*/

            zonaSustitucion.addEventListener(
                "dragstart",
                evento=>{

                    evento.dataTransfer.setData(
                        "text/plain",
                        "original"
                    );

                    evento.dataTransfer.effectAllowed =
                        "move";

                    zonaSustitucion.classList.add(
                        "modelo14-arrastrando"
                    );

                }
            );


            zonaSustitucion.addEventListener(
                "dragend",
                ()=>{

                    zonaSustitucion.classList.remove(
                        "modelo14-arrastrando"
                    );

                }
            );


            /*=============================================
                TEXTO DESPUÉS
            =============================================*/

            despues.forEach((palabra, i)=>{

                const span =
                    document.createElement("span");

                span.textContent =
                    palabra;

                texto.appendChild(span);

                if(i < despues.length - 1){

                    texto.appendChild(
                        document.createTextNode(" ")
                    );

                }

            });


            contenedorParrafo.appendChild(texto);


            /*=============================================
                BANCO DE OPCIONES
            =============================================*/

            const banco =
                document.createElement("div");

            banco.className =
                "modelo14-banco";

            banco.style.width =
                "100%";

            banco.style.margin =
                "20px 0 0 0";

            banco.style.padding =
                "20px";

            banco.style.background =
                "#f5f8ff";

            banco.style.border =
                "2px solid #d5dff5";

            banco.style.borderRadius =
                "16px";

            banco.style.display =
                "flex";

            banco.style.flexWrap =
                "wrap";

            banco.style.justifyContent =
                "center";

            banco.style.alignItems =
                "center";

            banco.style.gap =
                "12px";

            banco.style.boxSizing =
                "border-box";


            /*=============================================
                OPCIONES

                La correcta + las incorrectas
                forman UN SOLO BANCO.
            =============================================*/

            const opciones = [

                {
                    texto: parrafo.correcta,
                    correcta: true
                },

                ...(Array.isArray(parrafo.incorrectas)
                    ? parrafo.incorrectas.map(opcion=>({

                        texto: opcion,
                        correcta: false

                    }))
                    : [])

            ];


            /*=============================================
                MEZCLAR OPCIONES
            =============================================*/

            opciones.sort(
                ()=>Math.random() - 0.5
            );


            opciones.forEach((opcion, opcionIndex)=>{

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

                elemento.style.background =
                    "#1565c0";

                elemento.style.color =
                    "white";

                elemento.style.padding =
                    "12px 18px";

                elemento.style.borderRadius =
                    "12px";

                elemento.style.fontWeight =
                    "bold";

                elemento.style.fontSize =
                    "1em";

                elemento.style.cursor =
                    "grab";

                elemento.style.boxShadow =
                    "0 5px 12px rgba(0,0,0,.2)";

                elemento.style.transition =
                    ".2s";


                /*=========================================
                    ARRASTRAR OPCIÓN AZUL
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

                        elemento.classList.add(
                            "modelo14-arrastrando"
                        );

                    }
                );


                elemento.addEventListener(
                    "dragend",
                    ()=>{

                        elemento.classList.remove(
                            "modelo14-arrastrando"
                        );

                    }
                );


                elemento.addEventListener(
                    "mouseenter",
                    ()=>{

                        elemento.style.transform =
                            "translateY(-3px)";

                    }
                );


                elemento.addEventListener(
                    "mouseleave",
                    ()=>{

                        elemento.style.transform =
                            "translateY(0)";

                    }
                );


                banco.appendChild(elemento);

            });


            /*=============================================
                PERMITIR SOLTAR OPCIÓN SOBRE EL NARANJA
            =============================================*/

            zonaSustitucion.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    evento.dataTransfer.dropEffect =
                        "move";

                }
            );


            zonaSustitucion.addEventListener(
                "drop",
                evento=>{

                    evento.preventDefault();

                    const textoArrastrado =
                        evento.dataTransfer.getData(
                            "text/plain"
                        );

                    if(!textoArrastrado){

                        return;

                    }


                    /*=========================================
                        SI SE ARRASTRA UNA OPCIÓN AZUL
                    =========================================*/

                    if(textoArrastrado !== "original"){

                        const opcionesBanco =
                            banco.querySelectorAll(
                                ".modelo14-opcion"
                            );


                        let opcionEncontrada =
                            null;


                        opcionesBanco.forEach(opcion=>{

                            if(
                                opcion.dataset.texto ===
                                textoArrastrado
                            ){

                                opcionEncontrada =
                                    opcion;

                            }

                        });


                        if(!opcionEncontrada){

                            return;

                        }


                        /*=====================================
                            EL TEXTO QUE ESTABA EN NARANJA
                            REGRESA AL BANCO
                        =====================================*/

                        const textoAnterior =
                            zonaSustitucion.textContent;


                        const opcionAnterior =
                            document.createElement("div");

                        opcionAnterior.className =
                            "modelo14-opcion";

                        opcionAnterior.textContent =
                            textoAnterior;

                        opcionAnterior.draggable =
                            true;

                        opcionAnterior.dataset.texto =
                            textoAnterior;

                        opcionAnterior.dataset.correcta =
                            "original";


                        opcionAnterior.style.background =
                            "#1565c0";

                        opcionAnterior.style.color =
                            "white";

                        opcionAnterior.style.padding =
                            "12px 18px";

                        opcionAnterior.style.borderRadius =
                            "12px";

                        opcionAnterior.style.fontWeight =
                            "bold";

                        opcionAnterior.style.fontSize =
                            "1em";

                        opcionAnterior.style.cursor =
                            "grab";

                        opcionAnterior.style.boxShadow =
                            "0 5px 12px rgba(0,0,0,.2)";


                        opcionAnterior.addEventListener(
                            "dragstart",
                            evento=>{

                                evento.dataTransfer.setData(
                                    "text/plain",
                                    "original"
                                );

                                evento.dataTransfer.effectAllowed =
                                    "move";

                            }
                        );


                        banco.appendChild(
                            opcionAnterior
                        );


                        /*=====================================
                            COLOCAR LA NUEVA OPCIÓN
                            EN EL PÁRRAFO
                        =====================================*/

                        zonaSustitucion.textContent =
                            textoArrastrado;


                        zonaSustitucion.dataset.actual =
                            textoArrastrado;


                        /*=====================================
                            LA OPCIÓN AZUL UTILIZADA
                            SALE DEL BANCO
                        =====================================*/

                        opcionEncontrada.remove();

                    }

                }
            );


            /*=============================================
                PERMITIR DEVOLVER EL ORIGINAL AL BANCO
            =============================================*/

            banco.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    evento.dataTransfer.dropEffect =
                        "move";

                }
            );


            banco.addEventListener(
                "drop",
                evento=>{

                    evento.preventDefault();

                    const tipo =
                        evento.dataTransfer.getData(
                            "text/plain"
                        );

                    if(tipo === "original"){

                        const textoActual =
                            zonaSustitucion.textContent;

                        const opcionActual =
                            document.createElement("div");

                        opcionActual.className =
                            "modelo14-opcion";

                        opcionActual.textContent =
                            textoActual;

                        opcionActual.draggable =
                            true;

                        opcionActual.dataset.texto =
                            textoActual;

                        opcionActual.style.background =
                            "#1565c0";

                        opcionActual.style.color =
                            "white";

                        opcionActual.style.padding =
                            "12px 18px";

                        opcionActual.style.borderRadius =
                            "12px";

                        opcionActual.style.fontWeight =
                            "bold";

                        opcionActual.style.cursor =
                            "grab";

                        opcionActual.style.boxShadow =
                            "0 5px 12px rgba(0,0,0,.2)";


                        opcionActual.addEventListener(
                            "dragstart",
                            evento=>{

                                evento.dataTransfer.setData(
                                    "text/plain",
                                    "original"
                                );

                                evento.dataTransfer.effectAllowed =
                                    "move";

                            }
                        );


                        banco.appendChild(
                            opcionActual
                        );


                        zonaSustitucion.textContent =
                            zonaSustitucion.dataset.original;


                        zonaSustitucion.dataset.actual =
                            zonaSustitucion.dataset.original;

                    }

                }
            );


            contenedorParrafo.appendChild(
                banco
            );


            bloque.appendChild(
                contenedorParrafo
            );

        });


        /*=================================================
            INSERTAR EL MODELO EN LA PÁGINA
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
