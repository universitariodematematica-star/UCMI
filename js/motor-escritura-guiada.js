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

<div class="estado-escritura-guiada">
    <span class="texto-estado-escritura-guiada">
        INCOMPLETO
    </span>
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

const progresoGuiada =
    bloque.querySelector(
        ".progreso-guiada"
    );            
           
const estadoEscritura =
    bloque.querySelector(
        ".texto-estado-escritura-guiada"
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

    const minimo =
        numeroPalabras;


    const maximoColor =
        numeroPalabras * 2;


    /*--------------------------------------------
        PROGRESO DE LA BARRA

        La barra se completa al alcanzar
        el mínimo requerido.
    --------------------------------------------*/

    const porcentajeBarra =
        minimo > 0
        ? Math.min(
            (palabrasEscritas / minimo) * 100,
            100
        )
        : 0;


    progresoGuiada.style.width =
        porcentajeBarra + "%";


    /*--------------------------------------------
        PROGRESO CROMÁTICO

        0 → mínimo:
        rojo escarlata → verde

        mínimo → doble del mínimo:
        verde → azul cielo
    --------------------------------------------*/

    let porcentajeColor = 0;


    if(maximoColor > 0){

        porcentajeColor =
            Math.min(
                (palabrasEscritas / maximoColor) * 100,
                100
            );

    }


    let colorInicio;
    let colorFin;
    let porcentajeTransicion;


    if(
        palabrasEscritas <= minimo
    ){

        /*----------------------------------------
            ROJO → VERDE
        ----------------------------------------*/

        colorInicio = {
            r:227,
            g:66,
            b:52
        };


        colorFin = {
            r:34,
            g:139,
            b:34
        };


        porcentajeTransicion =
            minimo > 0
            ? palabrasEscritas / minimo
            : 0;

    }
    else{

        /*----------------------------------------
            VERDE → AZUL CIELO
        ----------------------------------------*/

        colorInicio = {
            r:34,
            g:139,
            b:34
        };


        colorFin = {
            r:135,
            g:206,
            b:235
        };


        porcentajeTransicion =
            numeroPalabras > 0
            ? (
                (palabrasEscritas - minimo)
                / minimo
            )
            : 0;

    }


    porcentajeTransicion =
        Math.max(
            0,
            Math.min(
                porcentajeTransicion,
                1
            )
        );


    /*--------------------------------------------
        INTERPOLACIÓN DEL COLOR

        La transición se realiza de manera
        progresiva entre los colores.
    --------------------------------------------*/

    const rojo =
        Math.round(
            colorInicio.r +
            (
                colorFin.r -
                colorInicio.r
            ) *
            porcentajeTransicion
        );


    const verde =
        Math.round(
            colorInicio.g +
            (
                colorFin.g -
                colorInicio.g
            ) *
            porcentajeTransicion
        );


    const azul =
        Math.round(
            colorInicio.b +
            (
                colorFin.b -
                colorInicio.b
            ) *
            porcentajeTransicion
        );


    progresoGuiada.style.backgroundColor =
        `rgb(${rojo}, ${verde}, ${azul})`;

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

        /*================================================
    ACTUALIZAR ESTADO DEL EJERCICIO
================================================*/

if(estadoEscritura){

    const vocabularioCompleto =
        [...palabrasGuiadas].every(
            elemento =>
                elemento.classList.contains(
                    "palabra-utilizada"
                )
        );


    if(
        palabrasEscritas >= numeroPalabras &&
        vocabularioCompleto
    ){

        estadoEscritura.textContent =
            "COMPLETO";

        estadoEscritura.style.color =
            "#228B22";

    }
    else{

        estadoEscritura.textContent =
            "INCOMPLETO";

        estadoEscritura.style.color =
            "#e34234";

    }

}

        }
    );

}


        });

    }

};
