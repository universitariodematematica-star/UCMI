/*=====================================================
MOTOR MODELO 16 - ESCRITURA GUIADA
=====================================================*/

const UCMIMotorEscrituraGuiada = {

```
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


        bloque.innerHTML = `

            <!--=====================================
                ENUNCIADO
            =====================================-->

            <div class="escritura-guiada-enunciado">

                <strong>
                    ${ejercicio.numero}. Enunciado
                </strong>

            </div>


            <!--=====================================
                ESTRUCTURAS
            =====================================-->

            <div class="escritura-guiada-estructuras">

                ${ejercicio.estructuras
                    .map(estructura => `

                        <div class="escritura-guiada-estructura">

                            ${estructura}

                        </div>

                    `)
                    .join("")}

            </div>


            <!--=====================================
                CONTENEDORES PRINCIPALES
            =====================================-->

            <div class="escritura-guiada-contenido">


                <!--=================================
                    IZQUIERDA
                =================================-->

                <div class="escritura-guiada-izquierda">

                    <textarea
                        class="escritura-guiada-textarea"
                        rows="12"
                        placeholder="Escribe tu texto aquí..."
                    ></textarea>

                </div>


                <!--=================================
                    DERECHA
                =================================-->

                <div class="escritura-guiada-derecha">

                    <h3>
                        Palabras
                    </h3>


                    <div class="escritura-guiada-banco">

                        ${ejercicio.palabras
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


            <!--=====================================
                INFORMACIÓN Y PROGRESO
            =====================================-->

            <div class="escritura-guiada-informacion">

                <div class="escritura-guiada-contador">

                    Palabras escritas:
                    <strong class="escritura-guiada-numero-escritas">
                        0
                    </strong>

                </div>


                <div class="escritura-guiada-faltantes">

                    Palabras faltantes:
                    <strong class="escritura-guiada-numero-faltantes">

                        ${ejercicio.numeroMinimoPalabras}

                    </strong>

                </div>


                <div class="escritura-guiada-progreso">

                    <div class="escritura-guiada-barra">

                        <div
                            class="escritura-guiada-barra-relleno"
                            style="width:0%;"
                        ></div>

                    </div>

                </div>

            </div>

        `;


        contenedor.appendChild(bloque);


    });

}
```

};
