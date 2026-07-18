/* =====================================================
   UCMI AUDIO PLAYER
   Reproductor múltiple UCMI
   ===================================================== */


window.UCMIAudio = {


crear:function(contenedor, config){


    contenedor.innerHTML = `

    <div class="audio-ucmi">


        <button class="audio-ucmi-boton">

            ▶

        </button>


        <div class="audio-ucmi-contenido">


            <div class="audio-ucmi-titulo">

                ${config.titulo}

            </div>


            <div class="audio-ucmi-progreso">


                <div class="audio-ucmi-barra"></div>


            </div>


            <div class="audio-ucmi-tiempo">

                00:00 / 00:00

            </div>


        </div>


    </div>

    `;



    const audio =
    new Audio(config.archivo);



    const boton =
    contenedor.querySelector(".audio-ucmi-boton");


    const barra =
    contenedor.querySelector(".audio-ucmi-barra");


    const progreso =
    contenedor.querySelector(".audio-ucmi-progreso");


    const tiempo =
    contenedor.querySelector(".audio-ucmi-tiempo");



    function formato(segundos){


        if(isNaN(segundos))
            return "00:00";


        let minutos =
        Math.floor(segundos/60);


        let segundosRestantes =
        Math.floor(segundos%60);



        return String(minutos).padStart(2,"0")
        +":"
        +
        String(segundosRestantes).padStart(2,"0");

    }




    boton.onclick=function(){


        if(audio.paused){

            audio.play();

        }else{

            audio.pause();

        }

    };




    audio.addEventListener("play",()=>{

        boton.textContent="⏸";

    });



    audio.addEventListener("pause",()=>{

        boton.textContent="▶";

    });



    audio.addEventListener("loadedmetadata",()=>{


        tiempo.textContent =
        "00:00 / "
        +
        formato(audio.duration);


    });



    audio.addEventListener("timeupdate",()=>{


        let porcentaje =
        (audio.currentTime/audio.duration)*100;


        barra.style.width =
        porcentaje+"%";


        tiempo.textContent =
        formato(audio.currentTime)
        +
        " / "
        +
        formato(audio.duration);


    });



    audio.addEventListener("ended",()=>{


        boton.textContent="▶";

        barra.style.width="0%";


    });




    progreso.onclick=function(e){


        let rect =
        progreso.getBoundingClientRect();


        let posicion =
        (e.clientX-rect.left)
        /
        rect.width;


        audio.currentTime =
        posicion*audio.duration;


    };




},




cargar:function(lista){


    const contenedores =
    document.querySelectorAll(".audioUCMI");



    lista.forEach((audio,index)=>{


        if(contenedores[index]){


            this.crear(
                contenedores[index],
                audio
            );


        }


    });



}



};
