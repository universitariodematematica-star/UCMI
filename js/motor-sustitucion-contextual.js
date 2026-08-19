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
            DATOS
        =================================================*/

        const parrafos =
            Array.isArray(ejercicio.parrafos)
            ? ejercicio.parrafos
            : [];


        if(parrafos.length === 0){

            console.warn(
                "UCMI Modelo 14: no existen párrafos para mostrar."
            );

            return;

        }


        /*=================================================
            ESTILOS DEL MODELO 14
        =================================================*/

        if(!document.getElementById(
            "estilos-modelo-14"
        )){

            const estilos =
                document.createElement("style");

            estilos.id =
                "estilos-modelo-14";

            estilos.textContent = `

                .modelo14-contenedor{

                    width:92%;
                    margin:35px auto;

                }


                .modelo14-parrafo{

                    width:100%;
                    box-sizing:border-box;

                    margin:0 auto 25px auto;

                    padding:22px 25px;

                    background:#f6a623;

                    border-radius:16px;

                    box-shadow:
                        0 6px 15px rgba(0,0,0,.20);

                    color:#071426;

                    font-size:19px;

                    line-height:1.7;

                    font-weight:bold;

                }


                .modelo14-numero{

                    display:block;

                    margin-bottom:10px;

                    font-size:16px;

                    color:#071426;

                    font-weight:bold;

                }


                .modelo14-banco{

                    width:100%;

                    box-sizing:border-box;

                    margin:25px auto;

                    padding:22px;

                    background:#f5f8ff;

                    border-radius:18px;

                    box-shadow:
                        0 7px 18px rgba(0,0,0,.15);

                    display:flex;

                    flex-wrap:wrap;

                    justify-content:center;

                    align-items:center;

                    gap:12px;

                }


                .modelo14-opcion{

                    display:inline-block;

                    padding:13px 20px;

                    background:#1565c0;

                    color:white;

                    border:none;

                    border-radius:14px;

                    font-size:17px;

                    font-weight:bold;

                    cursor:grab;

                    box-shadow:
                        0 5px 12px rgba(0,0,0,.20);

                    transition:.2s ease;

                    user-select:none;

                }


                .modelo14-opcion:hover{

                    transform:translateY(-3px);

                    box-shadow:
                        0 8px 16px rgba(0,0,0,.25);

                }


                .modelo14-opcion:active{

                    cursor:grabbing;

                    transform:scale(.97);

                }


                .modelo14-parrafo.modelo14-destino{

                    border:3px dashed #3949AB;

                }


                .modelo14-opcion.modelo14-arrastrando{

                    opacity:.5;

                }

            `;

            document.head.appendChild(estilos);

        }


        /*=================================================
            CONTENEDOR PRINCIPAL
        =================================================*/

        const zona =
            document.createElement("div");

        zona.className =
            "modelo14-contenedor";


        /*=================================================
            CREAR PÁRRAFOS
        =================================================*/

        parrafos.forEach((parrafo, indice)=>{

            const bloque =
                document.createElement("div");

            bloque.className =
                "modelo14-parrafo";

            bloque.dataset.parrafo =
                indice;


            const numero =
                document.createElement("span");

            numero.className =
                "modelo14-numero";

            numero.textContent =
                parrafo.numero ||
                `Párrafo ${indice + 1}`;


            const texto =
                document.createElement("div");

            texto.className =
                "modelo14-texto";

            texto.textContent =
                parrafo.texto || "";


            bloque.appendChild(numero);

            bloque.appendChild(texto);

            zona.appendChild(bloque);


            /*=============================================
                DRAG & DROP - DESTINO
            =============================================*/

            bloque.addEventListener(
                "dragover",
                evento=>{

                    evento.preventDefault();

                    bloque.classList.add(
                        "modelo14-destino"
                    );

                }
            );


            bloque.addEventListener(
                "dragleave",
                ()=>{

                    bloque.classList.remove(
                        "modelo14-destino"
                    );

                }
            );


            bloque.addEventListener(
                "drop",
                evento=>{

                    evento.preventDefault();

                    bloque.classList.remove(
                        "modelo14-destino"
                    );


                    const opcion =
                        evento.dataTransfer.getData(
                            "text/plain"
                        );


                    if(!opcion){

                        return;

                    }


                    /*=====================================
                        SUSTITUCIÓN CONTEXTUAL

                        inicio y fin representan
                        posiciones de palabras.
                    =====================================*/

                    const palabras =
                        String(
                            parrafo.texto || ""
                        ).split(/\s+/);


                    const inicio =
                        Number(parrafo.inicio);


                    const fin =
                        Number(parrafo.fin);


                    if(
                        !Number.isInteger(inicio) ||
                        !Number.isInteger(fin) ||
                        inicio < 1 ||
                        fin < inicio
                    ){

                        console.warn(
                            "UCMI Modelo 14: posiciones inválidas:",
                            parrafo
                        );

                        return;

                    }


                    const nuevasPalabras = [

                        ...palabras.slice(
                            0,
                            inicio - 1
                        ),

                        opcion,

                        ...palabras.slice(fin)

                    ];


                    texto.textContent =
                        nuevasPalabras.join(" ");


                }
            );

        });


        /*=================================================
            BANCO ÚNICO DE OPCIONES
        =================================================*/

        const banco =
            document.createElement("div");

        banco.className =
            "modelo14-banco";


        /*
            Todas las opciones de todos los párrafos
            se colocan juntas en un único banco.
        */

        parrafos.forEach(parrafo=>{

            if(parrafo.correcta){

                crearOpcion(
                    parrafo.correcta
                );

            }


            if(
                Array.isArray(
                    parrafo.incorrectas
                )
            ){

                parrafo.incorrectas.forEach(
                    incorrecta=>{

                        crearOpcion(
                            incorrecta
                        );

                    }
                );

            }

        });


        function crearOpcion(textoOpcion){

            const opcion =
                document.createElement("div");

            opcion.className =
                "modelo14-opcion";

            opcion.textContent =
                textoOpcion;

            opcion.draggable =
                true;


            opcion.addEventListener(
                "dragstart",
                evento=>{

                    evento.dataTransfer.setData(
                        "text/plain",
                        textoOpcion
                    );

                    opcion.classList.add(
                        "modelo14-arrastrando"
                    );

                }
            );


            opcion.addEventListener(
                "dragend",
                ()=>{

                    opcion.classList.remove(
                        "modelo14-arrastrando"
                    );

                }
            );


            banco.appendChild(opcion);

        }


        zona.appendChild(banco);


        /*=================================================
            INSERTAR MODELO 14
        =================================================*/

        contenedor.appendChild(zona);

    }

};


/*=====================================================
    EXPOSICIÓN GLOBAL
=====================================================*/

window.UCMIMotorSustitucionContextual =
    UCMIMotorSustitucionContextual;
