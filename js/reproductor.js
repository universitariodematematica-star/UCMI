/* =====================================================
   UCMI AUDIO PLAYER
   Módulo independiente
   ===================================================== */


window.UCMIAudio = {


iniciar:function(config){


    const contenedor=document.getElementById("audioUCMI");


    if(!contenedor){

        console.error(
        "No existe el contenedor audioUCMI"
        );

        return;

    }



    contenedor.innerHTML=`


    <div class="ucmi-audio">


        <div class="ucmi-audio-titulo">

            ${config.titulo}

        </div>



        <div class="ucmi-audio-controles">


            <button 
            class="ucmi-play"
            id="ucmiPlay">

            ▶

            </button>



            <div class="ucmi-progreso">


                <input 
                type="range"
                class="ucmi-barra"
                id="ucmiBarra"
                value="0"
                min="0"
                max="100">


            </div>



            <div class="ucmi-tiempo"
            id="ucmiTiempo">

            0:00 / 0:00

            </div>



        </div>


    </div>


    `;



    const audio=new Audio(config.archivo);



    const boton=document.getElementById("ucmiPlay");

    const barra=document.getElementById("ucmiBarra");

    const tiempo=document.getElementById("ucmiTiempo");



    function formato(segundos){


        if(isNaN(segundos))
            return "0:00";


        let minutos=Math.floor(segundos/60);

        let segundosRestantes=Math.floor(segundos%60);


        if(segundosRestantes<10)
            segundosRestantes="0"+segundosRestantes;


        return minutos+":"+segundosRestantes;


    }



    boton.onclick=function(){


        if(audio.paused){

            audio.play();

            boton.innerHTML="⏸";

        }

        else{

            audio.pause();

            boton.innerHTML="▶";

        }


    };




    audio.addEventListener(
    "loadedmetadata",
    function(){


        tiempo.innerHTML=
        "0:00 / "+
        formato(audio.duration);


    });



    audio.addEventListener(
    "timeupdate",
    function(){


        barra.value=
        (audio.currentTime/audio.duration)*100;



        tiempo.innerHTML=
        formato(audio.currentTime)
        +" / "+
        formato(audio.duration);


    });



    barra.oninput=function(){


        audio.currentTime=
        (barra.value/100)*audio.duration;


    };



    audio.addEventListener(
    "ended",
    function(){


        boton.innerHTML="▶";

        barra.value=0;


    });



}



};
