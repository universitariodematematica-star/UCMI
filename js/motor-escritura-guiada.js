const UCMIMotorEscrituraGuiada = {

    generar(datos){

        console.log(
            "MOTOR MODELO 16 - ESCRITURA GUIADA:",
            datos
        );


        const contenedor =
            document.getElementById(
                datos.contenedor
            );


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

            const numeroEjercicio =
                ++contadorEjercicios;


            const numeroPalabras =
                Number(
                    ejercicio.numeroMinimoPalabras
                ) || 0;


            const palabras =
                ejercicio.palabras || [];


            const estructuras =
                ejercicio.estructuras || [];


            const conjuntoPalabras =
                palabras.join(", ");


            const conjuntoEstructuras =
                estructuras.join(", ");


const bloque =
    document.createElement("div");

bloque.className =
    "ejercicio-escritura-guiada";

bloque.innerHTML = `

    <div class="instruccion-ejercicio">

        <strong>
            ${numeroEjercicio}.
        </strong>

        Escriba un texto con
        ${numeroPalabras}
        palabras que tenga los siguientes
        vocablos y oraciones formadas con las
        siguientes estructuras:

        <ul style="
    list-style-type: disc;
    padding-left: 35px;
    margin-top: 15px;
">

    <li style="
        margin-bottom: 10px;
    ">
        <strong>Vocablos:</strong>
        ${conjuntoPalabras}
    </li>

    ${estructuras.map(
        estructura =>
        `<li style="margin-bottom:10px;">${estructura}</li>`
    ).join("")}

    </ul>

    </div>


    <div class="contenedor-escritura-guiada">

<div class="campo-escritura-guiada">

    <textarea
        class="texto-escritura-guiada"
        placeholder="Escriba aquí su texto..."
    ></textarea>


    <div class="contador-palabras-guiada">
        Palabras:
        <span class="numero-palabras-guiada">0</span>
        /
        ${numeroPalabras}
    </div>


    <div class="barra-progreso-guiada">

        <div class="progreso-guiada"></div>

    </div>

</div>


        <div class="contenedor-palabras-guiada">

            <div class="titulo-palabras-guiada">
                Vocabulario requerido
            </div>

            <div class="palabras-guiada">

                ${palabras.map(
                    palabra =>
                    `<span class="palabra-guiada">
                        ${palabra}
                    </span>`
                ).join("")}

            </div>

        </div>

</div>

`;

contenedor.appendChild(bloque);


/*================================================
    DETECTAR VOCABULARIO UTILIZADO
================================================*/

const campoEscritura =
    bloque.querySelector(
        ".texto-escritura-guiada"
    );


const contadorPalabras =
    bloque.querySelector(
        ".numero-palabras-guiada"
    );
           


const palabrasGuiadas =
    bloque.querySelectorAll(
        ".palabra-guiada"
    );


if(campoEscritura){

    campoEscritura.addEventListener(
        "input",
        function(){

            const texto =
                campoEscritura.value.trim();


            const palabrasEscritas =
                texto
                ? texto.split(/\s+/).length
                : 0;

             /*================================================
                ACTUALIZAR BARRA DE PROGRESO
            ================================================*/

            if(progresoGuiada){

                const maximoProgreso =
                    numeroPalabras * 2;


                const porcentaje =
                    maximoProgreso > 0
                    ? Math.min(
                        (palabrasEscritas / maximoProgreso) * 100,
                        100
                    )
                    : 0;


                progresoGuiada.style.width =
                    porcentaje + "%";


                if(palabrasEscritas === 0){

                    progresoGuiada.style.background =
                        "#e34234";

                }
                else if(
                    palabrasEscritas >= numeroPalabras &&
                    palabrasEscritas < maximoProgreso
                ){

                    progresoGuiada.style.background =
                        "#228B22";

                }
                else if(
                    palabrasEscritas >= maximoProgreso
                ){

                    progresoGuiada.style.background =
                        "#87CEEB";

                }
                else{

                    progresoGuiada.style.background =
                        "#e34234";

                }

            }           

            if(contadorPalabras){

                contadorPalabras.textContent =
                    palabrasEscritas;

            }


            palabrasGuiadas.forEach(
                elemento => {

                    const palabra =
                        elemento.textContent
                        .trim()
                        .toLowerCase();


                    if(
                        palabra &&
                        texto.toLowerCase()
                        .includes(palabra)
                    ){

                        elemento.classList.add(
                            "palabra-utilizada"
                        );

                    }else{

                        elemento.classList.remove(
                            "palabra-utilizada"
                        );

                    }

                }
            );

        }
    );

}


        });

    }

};
