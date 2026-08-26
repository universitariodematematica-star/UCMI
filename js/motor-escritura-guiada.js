```javascript
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


            const estructurasHTML =
                (ejercicio.estructuras || [])
                .map(estructura =>
                    "<div>" +
                    estructura +
                    "</div>"
                )
                .join("");


            const palabrasHTML =
                (ejercicio.palabras || [])
                .map((palabra, indice) =>
                    "<span " +
                    "class=\"escritura-guiada-palabra\" " +
                    "data-palabra=\"" + palabra + "\" " +
                    "data-indice=\"" + indice + "\">" +
                    palabra +
                    "</span>"
                )
                .join("");


            bloque.innerHTML = `

                <div class="escritura-guiada-contenido">


                    <div class="escritura-guiada-izquierda">


                        <div class="escritura-guiada-enunciado">

                            <strong>
                                Escribe un texto utilizando las siguientes estructuras:
                            </strong>


                            <div class="escritura-guiada-estructuras">

                                ${estructurasHTML}

                            </div>

                        </div>


                        <textarea
                            class="escritura-guiada-textarea"
                            rows="12"
                            placeholder="Escribe tu texto aquí..."
                        ></textarea>


                        <div class="escritura-guiada-contador">

                            Palabras escritas:
                            <strong>0</strong>

                        </div>


                        <div class="escritura-guiada-faltantes">

                            Palabras faltantes:
                            <strong>
                                ${ejercicio.numeroMinimoPalabras}
                            </strong>

                        </div>


                    </div>


                    <div class="escritura-guiada-derecha">


                        <h3>
                            Palabras
                        </h3>


                        <div class="escritura-guiada-banco">

                            ${palabrasHTML}

                        </div>


                    </div>


                </div>

            `;


            contenedor.appendChild(bloque);


        });

    }

};
```
