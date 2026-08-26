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


    <div class="contenedor-escritura-guiada">

        <div class="campo-escritura-guiada">

            <textarea
                class="texto-escritura-guiada"
                placeholder="Escriba aquí su texto..."
            ></textarea>

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

        });

    }

};
