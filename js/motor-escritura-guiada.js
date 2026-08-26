/*=====================================================
MOTOR MODELO 16 - ESCRITURA GUIADA
=====================================================*/

const UCMIMotorEscrituraGuiada = {

generar(datos){

    console.log(
        "MOTOR MODELO 16 - ESCRITURA GUIADA:",
        datos
    );


    const contenedor =
        document.getElementById(datos.contenedor);


    if(!contenedor){

        console.error(
            "ESCRITURA GUIADA: no existe el contenedor."
        );

        return;

    }


    const ejercicios =
        datos.escrituraGuiada?.ejercicios || [];


    if(!ejercicios.length){

        console.warn(
            "ESCRITURA GUIADA: no existen ejercicios."
        );

        return;

    }


    ejercicios.forEach(ejercicio => {

        const bloque =
            document.createElement("div");


        bloque.className =
            "ejercicio-escritura-guiada";


        const numero =
            ejercicio.numero || "";


        const palabras =
            ejercicio.palabras || [];


        const estructuras =
            ejercicio.estructuras || [];


        const minimo =
            Number(ejercicio.numeroMinimoPalabras) || 0;


        bloque.innerHTML = `

            <div class="escritura-guiada-enunciado">

                <strong>
                    ${numero}. Enunciado
                </strong>

            </div>


            <div class="escritura-guiada-contenido">


                <div class="escritura-guiada-izquierda">


                    <div class="escritura-guiada-estructuras">

                        <strong>
                            Estructuras
                        </strong>

                        ${estructuras
                            .map(estructura => `
                                <div class="escritura-guiada-estructura">
                                    ${estructura}
                                </div>
                            `)
                            .join("")}

                    </div>


                    <textarea
                        class="escritura-guiada-textarea"
                        rows="12"
                        placeholder="Escribe tu texto aquí..."
                    ></textarea>


                </div>


                <div class="escritura-guiada-derecha">


                    <div class="escritura-guiada-palabras-titulo">

                        <strong>
                            Palabras
                        </strong>

                    </div>


                    <div class="escritura-guiada-banco">

                        ${palabras
                            .map((palabra, indice) => `

                                <span
                                    class="escritura-guiada-palabra"
                                    data-palabra="${palabra}"
                                    data-indice="${indice}"
                                >
                                    ${palabra}
                                </span>

                            `)
                            .join("")}

                    </div>


                </div>


            </div>


            <div class="escritura-guiada-progreso">


                <div class="escritura-guiada-contadores">

                    <span>
                        Palabras escritas:
                        <strong class="contador-escritas">
                            0
                        </strong>
                    </span>


                    <span>
                        Palabras faltantes:
                        <strong class="contador-faltantes">
                            ${minimo}
                        </strong>
                    </span>

                </div>


                <div class="escritura-guiada-barra">

                    <div class="escritura-guiada-barra-relleno"></div>

                </div>


            </div>

        `;


        contenedor.appendChild(bloque);


        const textarea =
            bloque.querySelector(
                ".escritura-guiada-textarea"
            );


        const contadorEscritas =
            bloque.querySelector(
                ".contador-escritas"
            );


        const contadorFaltantes =
            bloque.querySelector(
                ".contador-faltantes"
            );


        const barra =
            bloque.querySelector(
                ".escritura-guiada-barra-relleno"
            );


        const elementosPalabras =
            bloque.querySelectorAll(
                ".escritura-guiada-palabra"
            );


        textarea.addEventListener(
            "input",
            () => {

                const texto =
                    textarea.value.trim();


                const palabrasEscritas =
                    texto
                        ? texto.split(/\s+/).length
                        : 0;


                const faltantes =
                    Math.max(
                        minimo - palabrasEscritas,
                        0
                    );


                contadorEscritas.textContent =
                    palabrasEscritas;


                contadorFaltantes.textContent =
                    faltantes;


                elementosPalabras.forEach(
                    elemento => {

                        const palabra =
                            elemento.dataset.palabra
                                .trim()
                                .toLowerCase();


                        const textoActual =
                            texto.toLowerCase();


                        const expresion =
                            new RegExp(
                                `\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`
                            );


                        if(expresion.test(textoActual)){

                            elemento.classList.add(
                                "palabra-escrita"
                            );

                        }else{

                            elemento.classList.remove(
                                "palabra-escrita"
                            );

                        }

                    }
                );


                const porcentaje =
                    minimo > 0
                        ? Math.min(
                            (palabrasEscritas / minimo) * 100,
                            100
                        )
                        : 0;


                barra.style.width =
                    porcentaje + "%";

            }
        );

    });

}

};
