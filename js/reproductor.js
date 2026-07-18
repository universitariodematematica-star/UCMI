/* =====================================================
   UCMI AUDIO PLAYER
   Reproductor múltiple UCMI
   ===================================================== */


window.UCMIAudio = {


iniciar:function(config){


    const reproductores = document.querySelectorAll(".audioUCMI");


    const contenedor = reproductores[config.contenedor];


    if(!contenedor){

        console.error(
            "No existe el reproductor número:",
            config.contenedor
        );

        return;

    }



    contenedor.innerHTML = `


    <div class="ucmi-audio">


        <div class="ucmi-audio-titulo">

            ${config.titulo}

        </div>



        <div class="ucmi-audio-controles">


            <button class="ucmi-play">

                ▶

            </button>



            <div class="ucmi-progreso">

                <input 
                type="range"
                class="ucmi-barra"
                value="0"
                min="0"
                max="100">

            </div>



            <div class="ucmi-tiempo">

                0:00 / 0:00

            </div>


        </div>


    </div>


    `;



    const audio = new Audio(config.archivo);



    const boton = contenedor.querySelector(".ucmi-play");

    const barra = contenedor.querySelector(".ucmi-barra");

    const tiempo = contenedor.querySelector(".ucmi-tiempo");




    function formatoTiempo(segundos){


        if(isNaN(segundos))
            return "0:00";


        let minutos = Math.floor(segundos / 60);

        let segundosRestantes =
        Math.floor(segundos % 60);


        if(segundosRestantes < 10){

            segundosRestantes =
            "0" + segundosRestantes;

        }


        return minutos + ":" + segundosRestantes;


    }




    boton.onclick = function(){


        if(audio.paused){


            audio.play();

            boton.innerHTML="⏸";


        }else{


            audio.pause();

            boton.innerHTML="▶";


        }


    };




    audio.addEventListener(
        "loadedmetadata",
        function(){


            tiempo.innerHTML =
            "0:00 / " +
            formatoTiempo(audio.duration);


        }
    );




    audio.addEventListener(
        "timeupdate",
        function(){


            if(audio.duration){


                barra.value =
                (audio.currentTime / audio.duration) * 100;


            }



            tiempo.innerHTML =
            formatoTiempo(audio.currentTime)
            +
            " / "
            +
            formatoTiempo(audio.duration);



        }
    );




    barra.oninput=function(){


        if(audio.duration){


            audio.currentTime =
            (barra.value / 100) *
            audio.duration;


        }


    };




    audio.addEventListener(
        "ended",
        function(){


            boton.innerHTML="▶";

            barra.value=0;


        }
    );



}



};
