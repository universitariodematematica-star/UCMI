 /*
    =====================================================
    UCMI - Reproductor de Audio Académico
    Archivo común para Listening y Speaking
    =====================================================

    Funciones:
    - Reproducción personalizada.
    - Barra de progreso.
    - Control de tiempo.

    No incluye:
    - Contenido de ejercicios.
    - Firebase.
    - Protección.
*/


(function () {


    function inicializarAudios() {


        const reproductores = document.querySelectorAll(
            ".audio-ucmi"
        );


        reproductores.forEach(function (contenedor) {


            const audio = contenedor.querySelector(
                "audio"
            );


            const boton = contenedor.querySelector(
                ".audio-ucmi-boton"
            );


            const barra = contenedor.querySelector(
                ".audio-ucmi-barra"
            );


            const progreso = contenedor.querySelector(
                ".audio-ucmi-progreso"
            );


            const tiempo = contenedor.querySelector(
                ".audio-ucmi-tiempo"
            );


            if (!audio || !boton)
                return;



            boton.addEventListener(
                "click",
                function () {


                    if (audio.paused) {

                        audio.play();

                        boton.innerHTML = "⏸";


                    } else {

                        audio.pause();

                        boton.innerHTML = "▶";

                    }


                }
            );



            audio.addEventListener(
                "timeupdate",
                function () {


                    if (!audio.duration)
                        return;


                    let porcentaje =
                        (audio.currentTime /
                        audio.duration) * 100;



                    barra.style.width =
                        porcentaje + "%";



                    tiempo.textContent =
                        formatearTiempo(
                            audio.currentTime
                        )
                        +
                        " / "
                        +
                        formatearTiempo(
                            audio.duration
                        );


                }
            );



            audio.addEventListener(
                "ended",
                function () {


                    boton.innerHTML = "▶";

                    barra.style.width = "0%";

                }
            );



            progreso.addEventListener(
                "click",
                function (e) {


                    const rect =
                        progreso.getBoundingClientRect();


                    const posicion =
                        e.clientX - rect.left;


                    const porcentaje =
                        posicion / rect.width;



                    audio.currentTime =
                        porcentaje *
                        audio.duration;


                }
            );


        });


    }



    function formatearTiempo(segundos) {


        if (isNaN(segundos))
            return "0:00";


        let minutos =
            Math.floor(segundos / 60);


        let segundosRestantes =
            Math.floor(segundos % 60);



        if (segundosRestantes < 10)
            segundosRestantes =
                "0" + segundosRestantes;



        return minutos +
            ":" +
            segundosRestantes;

    }



    window.UCMIAudio = {


        iniciar: inicializarAudios


    };



    document.addEventListener(
        "DOMContentLoaded",
        inicializarAudios
    );



})();
