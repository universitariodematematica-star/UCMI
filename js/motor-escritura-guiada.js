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

                    ${numeroEjercicio}. Escriba un texto con
                    ${numeroPalabras}
                    palabras que tenga los siguientes
                    vocablos
                    ${conjuntoPalabras}
                    y oraciones formadas con las
                    estructuras
                    ${conjuntoEstructuras}.

                </div>

            `;


            contenedor.appendChild(
                bloque
            );

        });

    }

};
