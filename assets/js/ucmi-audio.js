/* ==========================================================
   UCMI - Reproductor de Audio
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const audio = document.getElementById("audioUCMI");
    const boton = document.getElementById("playAudio");
    const barra = document.getElementById("progreso");
    const contenedorBarra = document.getElementById("barraProgreso");
    const tiempo = document.getElementById("tiempoAudio");

    if (!audio || !boton || !barra || !contenedorBarra || !tiempo) {
        console.warn("UCMI Audio: elementos no encontrados.");
        return;
    }

    //--------------------------------------------------------
    // Convierte segundos a MM:SS
    //--------------------------------------------------------

    function formato(segundos) {

        if (isNaN(segundos)) return "00:00";

        const min = Math.floor(segundos / 60);
        const seg = Math.floor(segundos % 60);

        return (
            String(min).padStart(2, "0") +
            ":" +
            String(seg).padStart(2, "0")
        );

    }

    //--------------------------------------------------------
    // Actualizar barra y tiempo
    //--------------------------------------------------------

    function actualizar() {

        const porcentaje =
            (audio.currentTime / audio.duration) * 100;

        barra.style.width = porcentaje + "%";

        tiempo.textContent =
            formato(audio.currentTime) +
            " / " +
            formato(audio.duration);

    }

    //--------------------------------------------------------
    // Play / Pause
    //--------------------------------------------------------

    boton.addEventListener("click", () => {

        if (audio.paused) {

            audio.play();

        } else {

            audio.pause();

        }

    });

    //--------------------------------------------------------
    // Cambiar icono
    //--------------------------------------------------------

    audio.addEventListener("play", () => {

        boton.textContent = "⏸";

    });

    audio.addEventListener("pause", () => {

        boton.textContent = "▶";

    });

    audio.addEventListener("ended", () => {

        boton.textContent = "▶";

        barra.style.width = "0%";

    });

    //--------------------------------------------------------
    // Tiempo
    //--------------------------------------------------------

    audio.addEventListener("timeupdate", actualizar);

    audio.addEventListener("loadedmetadata", actualizar);

    //--------------------------------------------------------
    // Adelantar haciendo clic
    //--------------------------------------------------------

    contenedorBarra.addEventListener("click", e => {

        const rect = contenedorBarra.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const porcentaje = x / rect.width;

        audio.currentTime = porcentaje * audio.duration;

    });

});
