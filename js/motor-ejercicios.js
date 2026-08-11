/*====================================================*
* UCMI - MOTOR DE ESTRUCTURAS GRAMATICALES
* Ejercicio independiente
*====================================================*/

const UCMIMotorEstructuras = {

generar: function(estructuras){

    if(
        !estructuras ||
        !estructuras.tablas ||
        !Array.isArray(estructuras.tablas) ||
        estructuras.tablas.length === 0
    ){

        console.log(
            "ESTRUCTURAS: no hay tablas para generar"
        );

        return "";
    }


    console.log(
        "ESTRUCTURAS: generando tablas:",
        estructuras.tablas.length
    );


    let htmlEstructuras = `

<div class="seccion-estructuras">

    <div class="instruccion-ejercicio">
        Construya las oraciones según la estructura que aparece en los encabezados de las tablas, usando las expresiones o palabras disponibles.
    </div>

`;


    estructuras.tablas.forEach(
        (tabla, indice) => {

            htmlEstructuras += `

        <div
            class="estructura-gramatical"
            data-estructura="${tabla.numero}"
        >

            <div class="titulo-estructura">
                Estructura ${tabla.numero}
            </div>


            <div class="tabla-estructura">

                <table>

                    <thead>

                        <tr>

            `;


            tabla.encabezados.forEach(
                encabezado => {

                    htmlEstructuras += `

                        <th>
                            ${escaparTexto(encabezado)}
                        </th>

                    `;

                }
            );


            htmlEstructuras += `

                        </tr>

                    </thead>

                    <tbody>

            `;


            tabla.oraciones.forEach(
                (oracion, indiceOracion) => {

                    htmlEstructuras += `

                        <tr>

                    `;


                    oracion.forEach(
                        (elemento, indiceElemento) => {

                            htmlEstructuras += `

                                <td
                                    class="celda-estructural"
                                    data-estructura="${tabla.numero}"
                                    data-oracion="${indiceOracion + 1}"
                                    data-elemento="${indiceElemento + 1}"
                                    data-correcto-estructura="${tabla.numero}"
                                    data-correcto-oracion="${indiceOracion + 1}"
                                    data-correcto-elemento="${indiceElemento + 1}"
                                ></td>

                            `;

                        }
                    );


                    htmlEstructuras += `

                        </tr>

                    `;

                }
            );


            htmlEstructuras += `

                    </tbody>

                </table>

            </div>


            <div class="elementos-estructurales">

            `;


            tabla.oraciones.forEach(
                (oracion, indiceOracion) => {

                    htmlEstructuras += `

                        <div
                            class="elementos-oracion"
                            data-estructura="${tabla.numero}"
                            data-oracion="${indiceOracion + 1}"
                        >

                    `;


                    const elementosMezclados =
                        oracion
                            .map(
                                (elemento, indiceElemento) => ({
                                    contenido: elemento,
                                    indiceElemento: indiceElemento
                                })
                            )
                            .filter(
                                item =>
                                    item.contenido !== null &&
                                    item.contenido !== undefined &&
                                    item.contenido.trim() !== ""
                            );


                    elementosMezclados.sort(
                        () => Math.random() - 0.5
                    );


                    elementosMezclados.forEach(
                        item => {

                            const elemento =
                                item.contenido;

                            const indiceElemento =
                                item.indiceElemento;


                            htmlEstructuras += `

                                <div
                                    class="elemento-estructural"
                                    draggable="true"
                                    data-estructura="${tabla.numero}"
                                    data-oracion="${indiceOracion + 1}"
                                    data-elemento="${indiceElemento + 1}"
                                >
                                    ${escaparTexto(elemento)}
                                </div>

                            `;

                        }
                    );


                    htmlEstructuras += `

                        </div>

                    `;

                }
            );


            htmlEstructuras += `

            </div>

            <button
                type="button"
                class="boton-evaluar-estructuras"
                onclick="UCMIMotorEstructuras.evaluar(this)"
                data-estructura="${tabla.numero}"
            >
                Evaluar
            </button>

        </div>

            `;

        }
    );


    htmlEstructuras += `

</div>

`;


    console.log(
        "ESTRUCTURAS: HTML generado correctamente"
    );


    return htmlEstructuras;

},


activarDragDrop: function(){

    console.log(
        "ESTRUCTURAS: activando Drag & Drop"
    );


    const elementos =
        document.querySelectorAll(
            ".elemento-estructural"
        );


    const celdas =
        document.querySelectorAll(
            ".celda-estructural"
        );


    console.log(
        "ESTRUCTURAS: elementos arrastrables:",
        elementos.length
    );


    console.log(
        "ESTRUCTURAS: celdas destino:",
        celdas.length
    );


    elementos.forEach(
        elemento => {

            elemento.addEventListener(
                "dragstart",
                function(event){

                    event.dataTransfer.setData(
                        "text/plain",
                        this.dataset.estructura +
                        "|" +
                        this.dataset.oracion +
                        "|" +
                        this.dataset.elemento
                    );


                    this.classList.add(
                        "elemento-arrastrando"
                    );


                    console.log(
                        "ESTRUCTURAS: dragstart",
                        "Estructura =", this.dataset.estructura,
                        "| Oración =", this.dataset.oracion,
                        "| Elemento =", this.dataset.elemento
                    );

                }
            );


            elemento.addEventListener(
                "dragend",
                function(){

                    this.classList.remove(
                        "elemento-arrastrando"
                    );

                }
            );

        }
    );


    celdas.forEach(
        celda => {

            celda.addEventListener(
                "dragover",
                function(event){

                    event.preventDefault();

                    this.classList.add(
                        "celda-destino-hover"
                    );

                }
            );


            celda.addEventListener(
                "dragleave",
                function(){

                    this.classList.remove(
                        "celda-destino-hover"
                    );

                }
            );


            celda.addEventListener(
                "drop",
                function(event){

                    event.preventDefault();


                    this.classList.remove(
                        "celda-destino-hover"
                    );


                    const datos =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    if(!datos){
                        return;
                    }


                    const partes =
                        datos.split("|");


                    const estructura =
                        partes[0];

                    const oracion =
                        partes[1];

                    const elemento =
                        partes[2];


                    console.log(
                        "ESTRUCTURAS: drop",
                        "Elemento =", elemento,
                        "Estructura =", estructura,
                        "Oración =", oracion,
                        "Celda destino =",
                        this.dataset.estructura,
                        this.dataset.oracion,
                        this.dataset.elemento
                    );


                    const elementoArrastrado =
                        document.querySelector(
                            `.elemento-estructural[data-estructura="${estructura}"][data-oracion="${oracion}"][data-elemento="${elemento}"]`
                        );


                    if(!elementoArrastrado){

                        console.warn(
                            "ESTRUCTURAS: elemento arrastrado no encontrado"
                        );

                        return;

                    }


                    const elementoAnterior =
                        this.querySelector(
                            ".elemento-estructural"
                        );


                    if(elementoAnterior){

                        const estructuraAnterior =
                            elementoAnterior.dataset.estructura;

                        const oracionAnterior =
                            elementoAnterior.dataset.oracion;


                        const bancoAnterior =
                            document.querySelector(
                                `.elementos-oracion[data-estructura="${estructuraAnterior}"][data-oracion="${oracionAnterior}"]`
                            );


                        if(bancoAnterior){

                            bancoAnterior.appendChild(
                                elementoAnterior
                            );

                        }

                    }


                    this.appendChild(
                        elementoArrastrado
                    );

                }
            );

        }
    );

},


evaluar: function(boton){

    console.log(
        "========== EVALUACIÓN ESTRUCTURA =========="
    );


    //========================================
    // IDENTIFICAR ESTRUCTURA
    //========================================

    const estructura =
        boton.dataset.estructura;


    console.log(
        "ESTRUCTURA A EVALUAR:",
        estructura
    );


    //========================================
    // BUSCAR LAS CELDAS DE ESTA ESTRUCTURA
    //========================================

    const celdas =
        document.querySelectorAll(
            `.celda-estructural[data-estructura="${estructura}"]`
        );


    console.log(
        "CELDAS ENCONTRADAS:",
        celdas.length
    );


    if(celdas.length === 0){

        console.warn(
            "ESTRUCTURAS: no se encontraron celdas"
        );

        return;

    }


    //========================================
    // CONTADORES
    //========================================

    let correctas = 0;
    let incorrectas = 0;


    //========================================
    // EVALUAR CADA CELDA
    //========================================

    celdas.forEach(
        celda => {

            //====================================
            // BUSCAR ELEMENTO COLOCADO
            //====================================

            const elemento =
                celda.querySelector(
                    ".elemento-estructural"
                );


            //====================================
            // CELDA VACÍA
            //====================================

            if(!elemento){

                celda.classList.add(
                    "estructura-incorrecta"
                );

                celda.classList.remove(
                    "estructura-correcta"
                );

                incorrectas++;

                console.log(
                    "CELDA VACÍA:",
                    "Oración =", celda.dataset.oracion,
                    "| Elemento =", celda.dataset.elemento
                );

                return;

            }


            //====================================
            // INFORMACIÓN DEL ELEMENTO COLOCADO
            //====================================

            const estructuraElemento =
                elemento.dataset.estructura;

            const oracionElemento =
                elemento.dataset.oracion;

            const elementoElemento =
                elemento.dataset.elemento;


            //====================================
            // INFORMACIÓN CORRECTA DE LA CELDA
            //====================================

            const estructuraCorrecta =
                celda.dataset.correctoEstructura;

            const oracionCorrecta =
                celda.dataset.correctoOracion;

            const elementoCorrecto =
                celda.dataset.correctoElemento;


            //====================================
            // COMPARAR
            //====================================

            const esCorrecto =
                estructuraElemento === estructuraCorrecta &&
                oracionElemento === oracionCorrecta &&
                elementoElemento === elementoCorrecto;


            //====================================
            // RESULTADO
            //====================================

            if(esCorrecto){

                celda.classList.remove(
                    "estructura-incorrecta"
                );

                celda.classList.add(
                    "estructura-correcta"
                );

                correctas++;

            }else{

                celda.classList.remove(
                    "estructura-correcta"
                );

                celda.classList.add(
                    "estructura-incorrecta"
                );

                incorrectas++;

            }


            console.log(
                "EVALUACIÓN CELDA:",
                "Estructura =", estructura,
                "| Oración =", celda.dataset.oracion,
                "| Elemento =", celda.dataset.elemento,
                "| Colocado =", elemento.dataset.elemento,
                "| Correcta =", esCorrecto
            );

        }
    );


    //========================================
    // RESULTADO DE LA ESTRUCTURA
    //========================================

    console.log(
        "========== RESULTADO =========="
    );


    console.log(
        "Estructura:",
        estructura
    );


    console.log(
        "Correctas:",
        correctas
    );


    console.log(
        "Incorrectas:",
        incorrectas
    );


    //========================================
    // MOSTRAR RESULTADO
    //========================================

    let resultado =
        boton.parentElement.querySelector(
            ".resultado-estructura"
        );


    if(!resultado){

        resultado =
            document.createElement(
                "div"
            );

        resultado.className =
            "resultado-estructura";


        boton.parentElement.appendChild(
            resultado
        );

    }


    resultado.textContent =
        `Correctas: ${correctas} | Incorrectas: ${incorrectas}`;

}


window.UCMIMotorEstructuras =
    UCMIMotorEstructuras;
