/*=====================================================
INICIO - EXPORTACIÓN DEL CONSTRUCTOR
=====================================================*/

function abrirNuevaPestana(){

    const codigo =
    document.getElementById("codigo").textContent;

    const nuevaVentana =
    window.open();

    nuevaVentana.document.open();

    nuevaVentana.document.write(codigo);

    nuevaVentana.document.close();

} 

function descargarPlantillaUCMI(){

    const enlace = document.createElement("a");

    enlace.href = "plantillas/plantilla-grammar.xlsx";

    enlace.download = "plantilla-grammar.xlsx";

    document.body.appendChild(enlace);

    enlace.click();

    document.body.removeChild(enlace);

} 

async function copiarCodigo(){

    const codigo = document.getElementById("codigo").textContent;

    try{

        await navigator.clipboard.writeText(codigo);

        alert("Código copiado al portapapeles.");

    }catch(error){

        // Compatibilidad con navegadores antiguos
        const textarea = document.createElement("textarea");

        textarea.value = codigo;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(textarea);

        alert("Código copiado al portapapeles.");

    }

}

function descargarHTML(){

    const codigo = document.getElementById("codigo").textContent;

    if(!codigo.trim()){

        alert("No hay ningún código generado.");

        return;

    }

    // Nombre automático del archivo
    let nombre = "grammar";

    if(datosPagina.unidad && datosPagina.tema){

        nombre = `grammar-U${datosPagina.unidad}-T${datosPagina.tema}`;

    }

    const blob = new Blob(
        [codigo],
        {type:"text/html;charset=utf-8"}
    );

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(blob);

    enlace.download = nombre + ".html";

    document.body.appendChild(enlace);

    enlace.click();

    document.body.removeChild(enlace);

    URL.revokeObjectURL(enlace.href);

}

/*=====================================================
FIN - EXPORTACIÓN DEL CONSTRUCTOR
=====================================================*/
