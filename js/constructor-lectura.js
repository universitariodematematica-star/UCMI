/*=====================================================
INICIO - FUNCIONES AUXILIARES DE LECTURA
=====================================================*/    

function leerCelda(celda){

    let valor = celda.value;

    if (valor === null || valor === undefined){
        return "";
    }

    // Si ya es texto, número o booleano
    if (typeof valor !== "object"){
        return String(valor);
    }

    // Fórmula con resultado calculado
    if ("result" in valor){
        if (valor.result === null || valor.result === undefined){
            return "";
        }
        return String(valor.result);
    }

    // Texto enriquecido
    if (valor.richText){
        return valor.richText.map(x => x.text || "").join("");
    }

    // Texto
    if ("text" in valor){
        return String(valor.text || "");
    }

    // Hipervínculo
    if ("hyperlink" in valor){
        return String(valor.hyperlink || "");
    }

    // Fecha
    if (valor instanceof Date){
        return valor.toISOString();
    }

    // Último recurso
    return "";
}

/*=====================================================
FIN - FUNCIONES AUXILIARES DE LECTURA
=====================================================*/    
