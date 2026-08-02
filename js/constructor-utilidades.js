/*=====================================================
INICIO - FUNCIONES AUXILIARES DEL CONSTRUCTOR
=====================================================*/

function escaparHTML(texto){

    if(texto === null || texto === undefined){
        return "";
    }

    return String(texto)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}    

function capitalizar(texto){

    texto = String(texto).trim();

    if(texto===""){
        return "";
    }

    texto = texto.toLowerCase();

    return texto.replace(
        /^([¡¿]*)([a-záéíóúñ])/i,
        function(_, signos, letra){
            return signos + letra.toUpperCase();
        }
    );

}

    function normalizarTexto(texto){

    return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/ñ/g,"n")
    .replace(/[^a-z0-9]/g,"");

}

function normalizarRespuestaTraduccion(texto){

    if(texto === null || texto === undefined){

        return "";

    }

    texto = String(texto)

        .toLowerCase()

        .trim()

        .replace(/\s+/g," ")

        // eliminar signos de puntuación excepto apóstrofe
        .replace(/[.,!?;:]/g,"");


    //========================================
    // Expandir contracciones
    //========================================

    const contracciones = {

        "i'm":"i am",
        "you're":"you are",
        "he's":"he is",
        "she's":"she is",
        "it's":"it is",
        "we're":"we are",
        "they're":"they are",

        "i've":"i have",
        "you've":"you have",
        "we've":"we have",
        "they've":"they have",

        "i'll":"i will",
        "you'll":"you will",
        "he'll":"he will",
        "she'll":"she will",
        "we'll":"we will",
        "they'll":"they will",

        "don't":"do not",
        "doesn't":"does not",
        "didn't":"did not",

        "can't":"cannot",
        "won't":"will not",

        "isn't":"is not",
        "aren't":"are not",
        "wasn't":"was not",
        "weren't":"were not",

        "hasn't":"has not",
        "haven't":"have not",
        "hadn't":"had not",

        "shouldn't":"should not",
        "wouldn't":"would not",
        "couldn't":"could not",

        "there's":"there is",
        "that's":"that is",
        "what's":"what is",
        "who's":"who is",
        "where's":"where is",
        "when's":"when is",
        "why's":"why is",
        "how's":"how is"

    };


    Object.entries(contracciones).forEach(

        ([contraccion, expansion])=>{

            texto = texto.replace(

                new RegExp("\\b"+contraccion+"\\b","g"),

                expansion

            );

        }

    );

    return texto;

}

/*=====================================================
FIN - FUNCIONES AUXILIARES DEL CONSTRUCTOR
=====================================================*/
