/*
=====================================================
UCMI - Sistema de Navegación Académica
Archivo común para páginas de contenido
=====================================================

Funciones:
- Cambia automáticamente el botón "Seguir".
- Controla la secuencia:
  Grammar → Listening → Reading → Writing → Speaking
- Elimina el botón siguiente cuando llega a Speaking.

No incluye:
- Firebase.
- Protección.
- Evaluaciones.
=====================================================
*/


(function () {


    const rutaNavegacion = {


        grammar: {

            texto: "SEGUIR AL LISTENING",

            url: "#"

        },


        listening: {

            texto: "SEGUIR AL READING",

            url: "#"

        },


        reading: {

            texto: "SEGUIR AL WRITING",

            url: "#"

        },


        writing: {

            texto: "SEGUIR AL SPEAKING",

            url: "#"

        },


        speaking: {

            texto: null,

            url: null

        }


    };



    function configurarNavegacion(skillActual) {


        const boton = document.getElementById(
            "botonSiguiente"
        );


        if (!boton) return;



        const siguiente = rutaNavegacion[skillActual];



        if (!siguiente) return;



        // Última skill

        if (siguiente.texto === null) {


            boton.style.display = "none";


            return;

        }



        boton.textContent = siguiente.texto;


        boton.href = siguiente.url;



    }



    window.UCMINavegacion = {


        iniciar: configurarNavegacion


    };



})();
