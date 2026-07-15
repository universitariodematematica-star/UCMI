/*
    =====================================================
    UCMI - Pizarra Académica
    Archivo común para páginas de contenidos educativos
    =====================================================

    Funciones:
    - Dibujar sobre la página.
    - Cambiar colores.
    - Borrar trazos.
    - Limpiar la pizarra.
    - No bloquear elementos interactivos.

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

    let colorActual = null;

    let borrando = false;

    let grosor = 3;


    // =====================================================
    // CREAR / PREPARAR CANVAS
    // =====================================================

    function iniciar() {

        canvas = document.getElementById("drawingCanvas");


        if (!canvas) {

            canvas = document.createElement("canvas");

            canvas.id = "drawingCanvas";

            document.body.appendChild(canvas);

        }


        ctx = canvas.getContext("2d");


        prepararCanvas();

        agregarEventos();

        conectarHerramientas();

    }


    function prepararCanvas() {

        const ancho = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth
        );

        const alto = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );


        canvas.width = ancho;

        canvas.height = alto;


        ctx.lineCap = "round";

        ctx.lineJoin = "round";

    }


    // =====================================================
    // DETECTAR ELEMENTOS INTERACTIVOS
    // =====================================================

    function esInteractivo(elemento) {

        if (!elemento) return false;


        return elemento.closest(

            'button, a, input, textarea, select, audio, video, iframe, [contenteditable="true"], #ucmiToolbar'

        );

    }


    // =====================================================
    // OBTENER POSICIÓN
    // =====================================================

    function obtenerPosicion(evento) {

        if (evento.touches && evento.touches.length > 0) {

            return {

                x: evento.touches[0].pageX,

                y: evento.touches[0].pageY

            };

        }


        return {

            x: evento.pageX,

            y: evento.pageY

        };

    }


    // =====================================================
    // INICIAR DIBUJO
    // =====================================================

    function iniciarDibujo(evento) {

        if (esInteractivo(evento.target)) return;


        if (colorActual === null && !borrando) return;


        if (evento.touches) {

            const touch = evento.touches[0];

            const elemento = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );


            if (esInteractivo(elemento)) return;


            evento.preventDefault();

        }


        dibujando = true;


        const posicion = obtenerPosicion(evento);


        ctx.beginPath();


        ctx.moveTo(
            posicion.x,
            posicion.y
        );

    }


    // =====================================================
    // DIBUJAR
    // =====================================================

    function dibujar(evento) {

        if (!dibujando) return;


        if (evento.touches) {

            evento.preventDefault();

        }


        const posicion = obtenerPosicion(evento);


        if (borrando) {

            ctx.globalCompositeOperation = "destination-out";

            ctx.lineWidth = 25;

        } else {

            ctx.globalCompositeOperation = "source-over";

            ctx.strokeStyle = colorActual;

            ctx.lineWidth = grosor;

        }


        ctx.lineCap = "round";

        ctx.lineJoin = "round";


        ctx.lineTo(
            posicion.x,
            posicion.y
        );


        ctx.stroke();

    }


    // =====================================================
    // TERMINAR DIBUJO
    // =====================================================

    function terminarDibujo() {

        dibujando = false;


        if (ctx) {

            ctx.beginPath();

        }

    }


    // =====================================================
    // CAMBIAR COLOR
    // =====================================================

    function cambiarColor(color) {

        colorActual = color;

        borrando = false;

    }


    // =====================================================
    // ACTIVAR BORRADOR
    // =====================================================

    function activarBorrador() {

        colorActual = null;

        borrando = true;

    }


    // =====================================================
    // CAMBIAR GROSOR
    // =====================================================

    function cambiarGrosor(valor) {

        grosor = valor;

    }


    // =====================================================
    // LIMPIAR PIZARRA
    // =====================================================

    function limpiar() {

        if (!ctx || !canvas) return;


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        colorActual = null;

        borrando = false;

    }


    // =====================================================
    // CONECTAR HERRAMIENTAS
    // =====================================================

    function conectarHerramientas() {

        const botonRojo = document.getElementById("redButton");

        const botonAzul = document.getElementById("blueButton");

        const botonLima = document.getElementById("limeButton");

        const botonBorrador = document.getElementById("eraserButton");

        const botonLimpiar = document.getElementById("clearButton");


        if (botonRojo) {

            botonRojo.addEventListener("click", function () {

                cambiarColor("red");

            });

        }


        if (botonAzul) {

            botonAzul.addEventListener("click", function () {

                cambiarColor("blue");

            });

        }


        if (botonLima) {

            botonLima.addEventListener("click", function () {

                cambiarColor("yellowgreen");

            });

        }


        if (botonBorrador) {

            botonBorrador.addEventListener("click", function () {

                activarBorrador();

            });

        }


        if (botonLimpiar) {

            botonLimpiar.addEventListener("click", function () {

                limpiar();

            });

        }

    }


    // =====================================================
    // ACTUALIZAR TAMAÑO DEL CANVAS
    // =====================================================

    function actualizarTamañoCanvas() {

        if (!canvas || !ctx) return;


        const imagen = canvas.toDataURL();


        const nuevoAncho = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth
        );

        const nuevoAlto = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );


        if (
            canvas.width === nuevoAncho &&
            canvas.height === nuevoAlto
        ) {

            return;

        }


        canvas.width = nuevoAncho;

        canvas.height = nuevoAlto;


        const img = new Image();


        img.onload = function () {

            ctx.drawImage(
                img,
                0,
                0
            );

        };


        img.src = imagen;

    }


    // =====================================================
    // EVENTOS GENERALES
    // =====================================================

    function agregarEventos() {

        document.addEventListener(
            "mousedown",
            iniciarDibujo
        );


        document.addEventListener(
            "mousemove",
            dibujar
        );


        document.addEventListener(
            "mouseup",
            terminarDibujo
        );


        document.addEventListener(
            "touchstart",
            iniciarDibujo,
            { passive: false }
        );


        document.addEventListener(
            "touchmove",
            dibujar,
            { passive: false }
        );


        document.addEventListener(
            "touchend",
            terminarDibujo
        );


        window.addEventListener(
            "resize",
            actualizarTamañoCanvas
        );

    }


    // =====================================================
    // API UCMI
    // =====================================================

    window.UCMIPizarra = {

        iniciar: iniciar,

        limpiar: limpiar,

        color: cambiarColor,

        borrador: activarBorrador,

        grosor: cambiarGrosor,

        actualizar: actualizarTamañoCanvas

    };


})();
