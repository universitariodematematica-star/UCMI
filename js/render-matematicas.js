// js/render-matematicas.js

export function activarRenderMatematico(documento){

    // Evitar cargar MathJax dos veces
    if(documento.getElementById("mathjax-script")){
        return;
    }

    const script = documento.createElement("script");

    script.id = "mathjax-script";

    script.type = "text/javascript";

    script.src =
    "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";


    script.onload = () => {

        if(documento.defaultView.MathJax){

            documento.defaultView.MathJax.typesetPromise();

        }

    };


    documento.head.appendChild(script);

}
