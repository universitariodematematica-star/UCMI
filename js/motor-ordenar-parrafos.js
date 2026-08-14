/*=====================================================
 UCMI - MOTOR ORDENAR PÁRRAFOS
 Ejercicio independiente de Ordenar Párrafos
=====================================================*/

const UCMIMotorOrdenarParrafos = {

    generar(config) {

        const contenedor =
            document.getElementById(config.contenedor);

        if (!contenedor) {
            console.error(
                "No existe el contenedor para Ordenar Párrafos."
            );
            return;
        }

        const ejercicios =
            Array.isArray(config.ordenarParrafos)
                ? config.ordenarParrafos
                : [];

        if (ejercicios.length === 0) {
            return;
        }

        /*=================================================
        CONTENEDOR PRINCIPAL
        =================================================*/

        const bloque =
            document.createElement("div");

        bloque.className =
            "ejercicio-ordenar-parrafos";


        /*=================================================
        TÍTULO
        =================================================*/

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Ordenar párrafos";

        bloque.appendChild(titulo);


        /*=================================================
        INSTRUCCIÓN DEL EJERCICIO
        =================================================*/

        console.log(
            "CONTADOR ANTES DE ORDENAR PÁRRAFOS:",
            contadorEjercicios
        );

        contadorEjercicios++;

        console.log(
            "CONTADOR DESPUÉS DE ORDENAR PÁRRAFOS:",
            contadorEjercicios
        );

        const instruccion =
            document.createElement("div");

        instruccion.className =
            "instruccion-ejercicio";

        instruccion.textContent =
            `${contadorEjercicios}. Arrastra los párrafos para colocarlos en el orden correcto.`;

        bloque.appendChild(instruccion);


        /*=================================================
        ZONA DRAG & DROP
        =================================================*/

        const zona =
            document.createElement("div");

        zona.className =
            "zona-ordenar-parrafos";

        bloque.appendChild(zona);


        /*=================================================
        COPIA DE LOS DATOS
        =================================================*/

        const parrafos =
            [...ejercicios];


        /*=================================================
        MEZCLAR PÁRRAFOS
        =================================================*/

        for (
            let i = parrafos.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                parrafos[i],
                parrafos[j]
            ] =
            [
                parrafos[j],
                parrafos[i]
            ];

        }


        /*=================================================
        CREAR PÁRRAFOS ARRASTRABLES
        =================================================*/

        parrafos.forEach(
            (datos, indice) => {

                const elemento =
                    document.createElement("div");

                elemento.className =
                    "parrafo-arrastrable";

                elemento.draggable = true;

                elemento.dataset.orden =
                    datos.orden;

                elemento.dataset.indice =
                    indice;

                elemento.textContent =
                    datos.parrafo;


                /*=========================================
                DRAG START
                =========================================*/

                elemento.addEventListener(
                    "dragstart",
                    evento => {

                        elemento.classList.add(
                            "arrastrando"
                        );

                        evento.dataTransfer.effectAllowed =
                            "move";

                        evento.dataTransfer.setData(
                            "text/plain",
                            ""
                        );

                    }
                );


                /*=========================================
                DRAG END
                =========================================*/

                elemento.addEventListener(
                    "dragend",
                    () => {

                        elemento.classList.remove(
                            "arrastrando"
                        );

                    }
                );


                zona.appendChild(elemento);

            }
        );


        /*=================================================
        DRAG OVER
        =================================================*/

        zona.addEventListener(
            "dragover",
            evento => {

                evento.preventDefault();

                const arrastrando =
                    zona.querySelector(
                        ".arrastrando"
                    );

                if (!arrastrando) {
                    return;
                }

                const despues =
                    obtenerParrafoDespues(
                        zona,
                        evento.clientY
                    );

                if (!despues) {

                    zona.appendChild(
                        arrastrando
                    );

                } else {

                    zona.insertBefore(
                        arrastrando,
                        despues
                    );

                }

            }
        );

/*=================================================
BOTÓN EVALUAR
=================================================*/

const botonEvaluar =
    document.createElement("button");

botonEvaluar.className =
    "boton-evaluar-ordenar-parrafos";

botonEvaluar.textContent =
    "Evaluar";


/*=================================================
RESULTADO DE EVALUACIÓN
=================================================*/

const resultado =
    document.createElement("div");

resultado.className =
    "resultado-ordenar-parrafos";


/*=================================================
EVENTO EVALUAR
=================================================*/

botonEvaluar.addEventListener(
    "click",
    () => {

        const elementos =
            [
                ...zona.querySelectorAll(
                    ".parrafo-arrastrable"
                )
            ];

        let correcto = true;


        elementos.forEach(
            (elemento, indice) => {

                const ordenEsperado =
                    indice + 1;

                const ordenReal =
                    Number(
                        elemento.dataset.orden
                    );

                if (
                    ordenReal !==
                    ordenEsperado
                ) {

                    correcto = false;

                }

            }
        );


        if (correcto) {

            resultado.textContent =
                "✓ ¡Correcto! Los párrafos están en el orden correcto.";

            resultado.classList.remove(
                "resultado-ordenar-incorrecto"
            );

            resultado.classList.add(
                "resultado-ordenar-correcto"
            );

        } else {

            resultado.textContent =
                "✗ El orden de los párrafos no es correcto.";

            resultado.classList.remove(
                "resultado-ordenar-correcto"
            );

            resultado.classList.add(
                "resultado-ordenar-incorrecto"
            );

        }

    }
);


bloque.appendChild(
    botonEvaluar
);

bloque.appendChild(
    resultado
);
        /*=================================================
        INSERTAR BLOQUE EN EL DOM
        =================================================*/

        contenedor.appendChild(
            bloque
        );

    }

};


/*=====================================================
 DETERMINAR POSICIÓN DEL PÁRRAFO
=====================================================*/

function obtenerParrafoDespues(
    contenedor,
    posicionY
) {

    const elementos =
        [
            ...contenedor.querySelectorAll(
                ".parrafo-arrastrable:not(.arrastrando)"
            )
        ];

    return elementos.reduce(
        (mejor, elemento) => {

            const rect =
                elemento.getBoundingClientRect();

            const desplazamiento =
                posicionY -
                rect.top -
                rect.height / 2;

            if (
                desplazamiento < 0 &&
                desplazamiento >
                mejor.desplazamiento
            ) {

                return {

                    desplazamiento:
                        desplazamiento,

                    elemento:
                        elemento

                };

            }

            return mejor;

        },
        {
            desplazamiento:
                Number.NEGATIVE_INFINITY,

            elemento:
                null

        }
    ).elemento;

}


/*=====================================================
 FIN MOTOR ORDENAR PÁRRAFOS
=====================================================*/
