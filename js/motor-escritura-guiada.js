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

            bloque.innerHTML = `

                <h3>
                    Ejercicio ${ejercicio.numero}
                </h3>

                <div class="escritura-guiada-palabras">

                    <strong>Palabras:</strong>

                    ${ejercicio.palabras
                        .map(palabra => `<span>${palabra}</span>`)
                        .join(" ")}

                </div>

                <div class="escritura-guiada-estructuras">

                    <strong>Estructuras:</strong>

                    <ul>

                        ${ejercicio.estructuras
                            .map(estructura =>
                                `<li>${estructura}</li>`
                            )
                            .join("")}

                    </ul>

                </div>

                <textarea
                    class="escritura-guiada-textarea"
                    rows="8"
                    placeholder="Escribe tu texto aquí..."
                ></textarea>

                <div class="escritura-guiada-contador">

                    Palabras escritas: <strong>0</strong>

                </div>

            `;

            contenedor.appendChild(bloque);

        });

    }

};
