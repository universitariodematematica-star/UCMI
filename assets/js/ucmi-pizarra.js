/*
    =====================================================
    UCMI - Pizarra Académica
    Archivo común para páginas de contenidos educativos
    =====================================================

    Funciones:
    - Dibujar sobre la página.
    - Cambiar colores.
    - Borrar trazos.
    - Activar/desactivar modo pizarra.

    No incluye:
    - Firebase.
    - Autenticación.
    - Protección.
    - Guardado de datos.
*/


(function () {

    let canvas;
    let ctx;

    let dibujando = false;

    let colorActual = "#ff0000";

    let grosor = 3;

    let activa = false;


    function crearCanvas() {

        canvas = document.createElement("canvas");

        canvas.id = "drawingCanvas";

        canvas.width = document.documentElement.scrollWidth;
        canvas.height = document.documentElement.scrollHeight;


        document.body.appendChild(canvas);


        ctx = canvas.getContext("2d");


        ctx.lineCap = "round";
        ctx.lineJoin = "round";


        canvas.style.pointerEvents = "none";


        agregarEventos();

    }



    function agregarEventos() {


        canvas.addEventListener(
            "mousedown",
            iniciarDibujo
        );


        canvas.addEventListener(
            "mousemove",
            dibujar
        );


        canvas.addEventListener(
            "mouseup",
            terminarDibujo
        );


        canvas.addEventListener(
            "mouseleave",
            terminarDibujo
        );



        canvas.addEventListener(
            "touchstart",
            iniciarDibujo,
            { passive:false }
        );


        canvas.addEventListener(
            "touchmove",
            dibujar,
            { passive:false }
        );


        canvas.addEventListener(
            "touchend",
            terminarDibujo
        );

    }



    function obtenerPosicion(e) {


        let rect = canvas.getBoundingClientRect();


        if (e.touches) {

            return {

                x: e.touches[0].clientX - rect.left,

                y: e.touches[0].clientY - rect.top

            };

        }


        return {

            x: e.clientX - rect.left,

            y: e.clientY - rect.top

        };

    }



    function iniciarDibujo(e) {


        if (!activa) return;


        e.preventDefault();


        dibujando = true;


        let pos = obtenerPosicion(e);


        ctx.beginPath();

        ctx.moveTo(
            pos.x,
            pos.y
        );

    }



    function dibujar(e) {


        if (!dibujando || !activa)
            return;


        e.preventDefault();


        let pos = obtenerPosicion(e);


        ctx.strokeStyle = colorActual;

        ctx.lineWidth = grosor;


        ctx.lineTo(
            pos.x,
            pos.y
        );


        ctx.stroke();

    }



    function terminarDibujo() {

        dibujando = false;

    }



    function activar() {


        activa = true;


        canvas.style.pointerEvents = "auto";


    }



    function desactivar() {


        activa = false;


        canvas.style.pointerEvents = "none";


    }



    function limpiar() {


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }



    function cambiarColor(color) {

        colorActual = color;

    }



    function cambiarGrosor(valor) {

        grosor = valor;

    }



    function actualizarTamañoCanvas() {


        let imagen = canvas.toDataURL();


        canvas.width = document.documentElement.scrollWidth;

        canvas.height = document.documentElement.scrollHeight;


        let img = new Image();


        img.onload = function () {

            ctx.drawImage(
                img,
                0,
                0
            );

        };


        img.src = imagen;

    }



    window.addEventListener(
        "resize",
        actualizarTamañoCanvas
    );



    window.UCMIPizarra = {


        iniciar: crearCanvas,

        activar: activar,

        desactivar: desactivar,

        limpiar: limpiar,

        color: cambiarColor,

        grosor: cambiarGrosor

    };



})();
