// js/render-matematicas.js

export function activarRenderMatematico(documento) {

    const ventana = documento.defaultView;


    // ===============================================
    // SI MATHJAX YA ESTÁ CARGADO
    // RENDERIZAR EL NUEVO CONTENIDO
    // ===============================================

    if (ventana.MathJax && ventana.MathJax.typesetPromise) {

        ventana.MathJax.typesetPromise();

        return;

    }


    // ===============================================
    // CONFIGURAR MATHJAX
    // ===============================================

    ventana.MathJax = {

        tex: {

            inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"]
            ],

            displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"]
            ]

        }

    };


    // ===============================================
    // EVITAR CARGAR EL SCRIPT DOS VECES
    // ===============================================

    if (documento.getElementById("mathjax-script")) {

        return;

    }


    // ===============================================
    // CARGAR MATHJAX
    // ===============================================

    const script = documento.createElement("script");

    script.id = "mathjax-script";

    script.type = "text/javascript";

    script.src =
        "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";


    script.onload = () => {

        if (
            ventana.MathJax &&
            ventana.MathJax.typesetPromise
        ) {

            ventana.MathJax.typesetPromise();

        }

    };


    documento.head.appendChild(script);

}
