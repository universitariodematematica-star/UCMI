let contadorEjercicios = 0;

const UCMIResultados = {

    guardar(id, datos){

        localStorage.setItem(
            "ucmi_resultado_" + id,
            JSON.stringify(datos)
        );

    },


    obtener(id){

        const resultado =
        localStorage.getItem(
            "ucmi_resultado_" + id
        );


        return resultado
        ? JSON.parse(resultado)
        : null;

    }

};

const UCMIRestaurarEjercicios = {

    reiniciar(){

        Object.keys(localStorage)
        .forEach(key=>{

            if(key.startsWith("ucmi_resultado_")){

                localStorage.removeItem(key);

            }

        });


        window.top.location.reload();

    }

};

function escaparTexto(texto){

    return String(texto ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/'/g,"&#39;")
    .replace(/"/g,"&quot;")
    .replace(/\n/g," ");

}

function normalizarRespuestaTraduccion(texto){

    texto = String(texto ?? "")

    // minúsculas
    .toLowerCase()

    // convierte apóstrofes tipográficos
    .replace(/[’`´]/g,"'")

    // elimina espacios repetidos
    .replace(/\s+/g," ")

    // elimina espacios al inicio y final
    .trim()

    // elimina signos finales
    .replace(/[.,!?;:]+$/,"");


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

        "shouldn't":"should not",
        "wouldn't":"would not",
        "couldn't":"could not"

    };


    Object.entries(contracciones)
    .forEach(([contraccion, expansion])=>{

        texto = texto.replaceAll(
            contraccion,
            expansion
        );

    });


    return texto;

}

/*====================================================
        SECCIÓN: SELECCIÓN SIMPLE
====================================================*/

function crearSeleccionSimple(ejerciciosSelSimple){

    let htmlSelSimple = `

<div class="instruccion-ejercicio">
Seleccione la opción que llena correctamente el espacio en blanco en cada ítem.
</div>

`;

//========================================
// Generar ejercicios selección simple
//========================================

ejerciciosSelSimple.forEach((ejercicio, indice)=>{


    let opciones = [

        ejercicio.correcta,

        ejercicio.incorrecta1,

        ejercicio.incorrecta2,

        ejercicio.incorrecta3

    ];


    // Mezclar opciones aleatoriamente

    for(let i = opciones.length - 1; i > 0; i--){

    const j = Math.floor(Math.random() * (i + 1));

    [opciones[i], opciones[j]] =
    [opciones[j], opciones[i]];

}


    htmlSelSimple += `

<div 
class="ejercicio-sel-simple"
data-id="sel-${indice}"
>

<h3>
${++contadorEjercicios}. ${ejercicio.oracion}
</h3>


<div class="opciones">

${opciones.map((opcion,i)=>`

<label class="opcion-radio">

<input
type="radio"
name="pregunta${indice}"
value="${opcion}">

${String.fromCharCode(97+i)}) ${opcion}

</label>

`).join("")}

</div>


<button
class="verificar"
data-correcta='${escaparTexto(ejercicio.correcta)}'
data-explicacion='${escaparTexto(ejercicio.explicacion)}'
onclick="verificarPregunta(this)">

Verificar

</button>


<div 
class="resultado"
data-id="sel-${indice}"
></div>


</div>

`;

});
    

return htmlSelSimple;

} 

/*====================================================
        SECCIÓN: DRAG AND DROP - ESPACIO EN BLANCO
====================================================*/

function crearDragDropBlanco(ejerciciosDragDrop){

    let htmlDragDrop = `

<div class="instruccion-ejercicio">
Arrastra la palabra correcta para completar la oración.
</div>

`;


    ejerciciosDragDrop.forEach((ejercicio, indice)=>{


        let opciones = [
    ejercicio.correcta,
    ...ejercicio.opciones
                        ];


        // Mezclar botones

        for(let i = opciones.length - 1; i > 0; i--){

            const j = Math.floor(Math.random() * (i + 1));

            [opciones[i], opciones[j]] =
            [opciones[j], opciones[i]];

        }



        htmlDragDrop += `


<div 
class="ejercicio-drag-drop"
data-id="drag-${indice}"
>

<h3>
${++contadorEjercicios}. ${ejercicio.textoAntes} ______ ${ejercicio.textoDespues}
</h3>

<div class="zona-oracion">


<span class="texto-arrastre">
${ejercicio.textoAntes}
</span>


<span
class="espacio-drop"
data-correcta='${ejercicio.correcta}'
data-explicacion="${ejercicio.explicacion}">

________

</span>


<span class="texto-arrastre">
${ejercicio.textoDespues}
</span>


</div>

<div class="banco-arrastre">

${opciones.map(opcion=>`


<button
class="boton-arrastrable"
draggable="true"
data-id="dragboton-${indice}-${escaparTexto(opcion)}"
>

${opcion}

</button>


`).join("")}



</div>



<button
class="evaluar-drag"
onclick="evaluarDrag(this)">
Evaluar
</button>

<div 
class="resultado"
data-id="drag-${indice}"
></div>

</div>


`;

    });


    return htmlDragDrop;

}

/*====================================================
        RELACIONAR COLUMNAS
====================================================*/

function crearEmparejarColumnas(ejerciciosRelacionar){

let htmlRelacionar = `

<div class="instruccion-ejercicio">
Arrastra cada palabra de la izquierda hasta su significado correcto.
</div>


<div class="ejercicio-relacionar"
data-id="relacionar-0"
>


<h3>
${++contadorEjercicios}. Relaciona:
</h3>


<div class="contenedor-relacionar">


<div class="columna-relacionar">


<h3>
Palabras
</h3>

`;


// COLUMNA IZQUIERDA

ejerciciosRelacionar.forEach((ejercicio, indice)=>{


htmlRelacionar += `


<div
class="elemento-relacionar izquierda-relacionar"
draggable="true"
data-id="relacion-${indice}"
data-respuesta="${escaparTexto(ejercicio.derecha)}"
>

${escaparTexto(ejercicio.izquierda)}

</div>


`;


});



htmlRelacionar += `

</div>



<div class="columna-relacionar">


<h3>
Significados
</h3>


`;


// COLUMNA DERECHA MEZCLADA

let derecha =
ejerciciosRelacionar.map(
e=>e.derecha
);



for(
let i=derecha.length-1;
i>0;
i--
){

let j =
Math.floor(
Math.random()*(i+1)
);


[derecha[i],derecha[j]]
=
[derecha[j],derecha[i]];

}



derecha.forEach((texto)=>{


htmlRelacionar += `


<div
class="elemento-relacionar derecha-relacionar"
data-valor="${escaparTexto(texto)}"
data-original="${escaparTexto(texto)}"
>

${escaparTexto(texto)}

</div>


`;

});


htmlRelacionar += `

</div>

</div>

</div>

`;



return htmlRelacionar;

}

/*====================================================
        TRADUCCIÓN
====================================================*/

function crearTraduccion(ejerciciosTraduccion){

    let htmlTraduccion = `

<div class="instruccion-ejercicio">
Traduce cada oración del español al inglés.
</div>

`;

    ejerciciosTraduccion.forEach((ejercicio, indice)=>{

        htmlTraduccion += `

<div
class="ejercicio-traduccion"
data-id="traduccion-${indice}"
>

<h3>
${++contadorEjercicios}. ${ejercicio.oracion}
</h3>

<input
type="text"
class="respuesta-traduccion"
placeholder="Escribe la traducción en inglés">

<button
class="verificar"
onclick="verificarTraduccion(this)"
data-respuesta='${escaparTexto(ejercicio.respuesta)}'
data-respuestas='${escaparTexto(JSON.stringify(ejercicio.respuestasAlternativas || []))}'
data-explicacion='${escaparTexto(ejercicio.explicacion)}'>

Verificar

</button>

<div
class="resultado"
data-id="traduccion-${indice}"
></div>

</div>

`;

    });

    return htmlTraduccion;

}

/*====================================================*
*SECCIÓN: ESTRUCTURAS GRAMATICALES*
*====================================================*/

function crearEstructuras(estructuras){

    if(
        !estructuras ||
        !estructuras.tablas ||
        !Array.isArray(estructuras.tablas) ||
        estructuras.tablas.length === 0
    ){

        console.log(
            "ESTRUCTURAS: no hay tablas para generar"
        );

        return "";
    }


    console.log(
        "ESTRUCTURAS: generando tablas:",
        estructuras.tablas.length
    );


    let htmlEstructuras = `

<div class="seccion-estructuras">

    <div class="instruccion-ejercicio">
        Construya las oraciones según la estructura que aparece en los encabezados de las tablas, usando las expresiones o palabras disponibles.
    </div>

`;


    estructuras.tablas.forEach(
        (tabla, indice) => {

            htmlEstructuras += `

        <div
            class="estructura-gramatical"
            data-estructura="${tabla.numero}"
        >

            <div class="titulo-estructura">
                Estructura ${tabla.numero}
            </div>


            <div class="tabla-estructura">

                <table>

                    <thead>

                        <tr>

            `;


            //========================================
            // ENCABEZADOS
            //========================================

            tabla.encabezados.forEach(
                encabezado => {

                    htmlEstructuras += `

                        <th>
                            ${escaparTexto(encabezado)}
                        </th>

                    `;

                }
            );


            htmlEstructuras += `

                        </tr>

                    </thead>

                    <tbody>

            `;


            //========================================
            // CELDAS DESTINO
            // Inicialmente vacías
            //========================================

            tabla.oraciones.forEach(
                (oracion, indiceOracion) => {

                    console.log(
                        "ESTRUCTURA - ORACIÓN RECIBIDA:",
                        oracion
                    );


                    htmlEstructuras += `

                        <tr>

                    `;


                    oracion.forEach(
                        (elemento, indiceElemento) => {

                           htmlEstructuras += `

    <td
        class="celda-estructural"
        data-estructura="${tabla.numero}"
        data-oracion="${indiceOracion + 1}"
        data-elemento="${indiceElemento + 1}"
        data-correcto-estructura="${tabla.numero}"
        data-correcto-oracion="${indiceOracion + 1}"
        data-correcto-elemento="${indiceElemento + 1}"
    ></td>

`;

                        }
                    );


                    htmlEstructuras += `

                        </tr>

                    `;

                }
            );


            htmlEstructuras += `

                    </tbody>

                </table>

            </div>


            <div class="elementos-estructurales">

            `;


            //========================================
            // ELEMENTOS CONSTITUYENTES
            // Cada oración ocupa una fila
            // Cada elemento es una pieza arrastrable
            //========================================

tabla.oraciones.forEach(
    (oracion, indiceOracion) => {

        htmlEstructuras += `

            <div
                class="elementos-oracion"
                data-estructura="${tabla.numero}"
                data-oracion="${indiceOracion + 1}"
            >

        `;


        //========================================
        // MEZCLAR ELEMENTOS DE ESTA ORACIÓN
        // SOLAMENTE
        //
        // La mezcla no modifica la información
        // original de estructura, oración o elemento.
        //========================================

        const elementosMezclados =
            oracion
                .map(
                    (elemento, indiceElemento) => ({
                        contenido: elemento,
                        indiceElemento: indiceElemento
                    })
                )
                .filter(
                    item =>
                        item.contenido !== null &&
                        item.contenido !== undefined &&
                        item.contenido.trim() !== ""
                );


        elementosMezclados.sort(
            () => Math.random() - 0.5
        );


        elementosMezclados.forEach(
            item => {

                const elemento = item.contenido;
                const indiceElemento = item.indiceElemento;


                console.log(
                    "ELEMENTO ESTRUCTURAL:",
                    "Estructura =", tabla.numero,
                    "| Oración =", indiceOracion + 1,
                    "| Elemento =", indiceElemento + 1,
                    "| Contenido =", elemento
                );


                htmlEstructuras += `

                <div
                    class="elemento-estructural"
                    draggable="true"
                    data-estructura="${tabla.numero}"
                    data-oracion="${indiceOracion + 1}"
                    data-elemento="${indiceElemento + 1}"
                >
                    ${escaparTexto(elemento)}
                </div>

                `;

            }
        );


        htmlEstructuras += `

            </div>

        `;

    }
);

htmlEstructuras += `

            </div>

            <button
                type="button"
                class="boton-evaluar-estructuras"
                onclick="evaluarEstructuras(this)"
                data-estructura="${tabla.numero}"
            >
                Evaluar
            </button>

        </div>

            `;

        }
    );


    htmlEstructuras += `

</div>

`;


    console.log(
        "ESTRUCTURAS: HTML generado correctamente"
    );


    return htmlEstructuras;
}

/*====================================================*
*DRAG & DROP - ESTRUCTURAS GRAMATICALES*
*====================================================*/

function activarDragDropEstructuras(){

    console.log(
        "ESTRUCTURAS: activando Drag & Drop"
    );


    const elementos =
        document.querySelectorAll(
            ".elemento-estructural"
        );


    const celdas =
        document.querySelectorAll(
            ".celda-estructural"
        );


    console.log(
        "ESTRUCTURAS: elementos arrastrables:",
        elementos.length
    );


    console.log(
        "ESTRUCTURAS: celdas destino:",
        celdas.length
    );


    elementos.forEach(
        elemento => {

            elemento.addEventListener(
                "dragstart",
                function(event){

                    event.dataTransfer.setData(
                        "text/plain",
                        this.dataset.estructura +
                        "|" +
                        this.dataset.oracion +
                        "|" +
                        this.dataset.elemento
                    );


                    this.classList.add(
                        "elemento-arrastrando"
                    );


                    console.log(
                        "ESTRUCTURAS: dragstart",
                        "Estructura =", this.dataset.estructura,
                        "| Oración =", this.dataset.oracion,
                        "| Elemento =", this.dataset.elemento
                    );

                }
            );


            elemento.addEventListener(
                "dragend",
                function(){

                    this.classList.remove(
                        "elemento-arrastrando"
                    );

                }
            );

        }
    );


    celdas.forEach(
        celda => {

            celda.addEventListener(
                "dragover",
                function(event){

                    event.preventDefault();


                    this.classList.add(
                        "celda-destino-hover"
                    );

                }
            );


            celda.addEventListener(
                "dragleave",
                function(){

                    this.classList.remove(
                        "celda-destino-hover"
                    );

                }
            );


            celda.addEventListener(
                "drop",
                function(event){

                    event.preventDefault();


                    this.classList.remove(
                        "celda-destino-hover"
                    );


                    const datos =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    if(!datos){
                        return;
                    }


                    const partes =
                        datos.split("|");


                    const estructura =
                        partes[0];


                    const oracion =
                        partes[1];


                    const elemento =
                        partes[2];


                    console.log(
                        "ESTRUCTURAS: drop",
                        "Elemento =", elemento,
                        "Estructura =", estructura,
                        "Oración =", oracion,
                        "Celda destino =",
                        this.dataset.estructura,
                        this.dataset.oracion,
                        this.dataset.elemento
                    );


//========================================
// BUSCAR ELEMENTO ARRASTRADO
//========================================

const elementoArrastrado =
    document.querySelector(
        `.elemento-estructural[data-estructura="${estructura}"][data-oracion="${oracion}"][data-elemento="${elemento}"]`
    );


if(!elementoArrastrado){

    console.warn(
        "ESTRUCTURAS: elemento arrastrado no encontrado"
    );

    return;

}


//========================================
// SI LA CELDA YA ESTÁ OCUPADA
// DEVOLVER EL ELEMENTO ANTERIOR
// A SU BANCO DE ORIGEN
//========================================

const elementoAnterior =
    this.querySelector(
        ".elemento-estructural"
    );


if(elementoAnterior){

    const estructuraAnterior =
        elementoAnterior.dataset.estructura;

    const oracionAnterior =
        elementoAnterior.dataset.oracion;


    const bancoAnterior =
        document.querySelector(
            `.elementos-oracion[data-estructura="${estructuraAnterior}"][data-oracion="${oracionAnterior}"]`
        );


    if(bancoAnterior){

        bancoAnterior.appendChild(
            elementoAnterior
        );

    }

}


//========================================
// COLOCAR EL NUEVO ELEMENTO
//========================================

this.appendChild(
    elementoArrastrado
);

                }
            );

        }
    );

}

/*====================================================*
*EVALUACIÓN - ESTRUCTURAS GRAMATICALES*
*====================================================*/

function evaluarEstructuras(boton){

    console.log(
        "========== EVALUACIÓN ESTRUCTURA =========="
    );


    //========================================
    // IDENTIFICAR ESTRUCTURA
    //========================================

    const estructura =
        boton.dataset.estructura;


    console.log(
        "ESTRUCTURA A EVALUAR:",
        estructura
    );


    //========================================
    // BUSCAR LAS CELDAS DE ESTA ESTRUCTURA
    //========================================

    const celdas =
        document.querySelectorAll(
            `.celda-estructural[data-estructura="${estructura}"]`
        );


    console.log(
        "CELDAS ENCONTRADAS:",
        celdas.length
    );


    if(celdas.length === 0){

        console.warn(
            "ESTRUCTURAS: no se encontraron celdas"
        );

        return;

    }


    //========================================
    // CONTADORES
    //========================================

    let correctas = 0;
    let incorrectas = 0;


    //========================================
    // EVALUAR CADA CELDA
    //========================================

    celdas.forEach(
        celda => {

            //====================================
            // BUSCAR ELEMENTO COLOCADO
            //====================================

            const elemento =
                celda.querySelector(
                    ".elemento-estructural"
                );


            //====================================
            // CELDA VACÍA
            //====================================

            if(!elemento){

                celda.classList.add(
                    "estructura-incorrecta"
                );

                celda.classList.remove(
                    "estructura-correcta"
                );

                incorrectas++;

                console.log(
                    "CELDA VACÍA:",
                    "Oración =", celda.dataset.oracion,
                    "| Elemento =", celda.dataset.elemento
                );

                return;

            }


            //====================================
            // INFORMACIÓN DEL ELEMENTO COLOCADO
            //====================================

            const estructuraElemento =
                elemento.dataset.estructura;

            const oracionElemento =
                elemento.dataset.oracion;

            const elementoElemento =
                elemento.dataset.elemento;


            //====================================
            // INFORMACIÓN CORRECTA DE LA CELDA
            //====================================

            const estructuraCorrecta =
                celda.dataset.correctoEstructura;

            const oracionCorrecta =
                celda.dataset.correctoOracion;

            const elementoCorrecto =
                celda.dataset.correctoElemento;


            //====================================
            // COMPARAR
            //====================================

            const esCorrecto =
                estructuraElemento === estructuraCorrecta &&
                oracionElemento === oracionCorrecta &&
                elementoElemento === elementoCorrecto;


            //====================================
            // RESULTADO
            //====================================

            if(esCorrecto){

                celda.classList.remove(
                    "estructura-incorrecta"
                );

                celda.classList.add(
                    "estructura-correcta"
                );

                correctas++;

            }else{

                celda.classList.remove(
                    "estructura-correcta"
                );

                celda.classList.add(
                    "estructura-incorrecta"
                );

                incorrectas++;

            }


            console.log(
                "EVALUACIÓN CELDA:",
                "Estructura =", estructura,
                "| Oración =", celda.dataset.oracion,
                "| Elemento =", celda.dataset.elemento,
                "| Colocado =", elemento.dataset.elemento,
                "| Correcta =", esCorrecto
            );

        }
    );


    //========================================
    // RESULTADO DE LA ESTRUCTURA
    //========================================

    console.log(
        "========== RESULTADO =========="
    );

    console.log(
        "Estructura:",
        estructura
    );

    console.log(
        "Correctas:",
        correctas
    );

    console.log(
        "Incorrectas:",
        incorrectas
    );


    //========================================
    // MOSTRAR RESULTADO
    //========================================

    let resultado =
        boton.parentElement.querySelector(
            ".resultado-estructura"
        );


    if(!resultado){

        resultado =
            document.createElement(
                "div"
            );

        resultado.className =
            "resultado-estructura";


        boton.parentElement.appendChild(
            resultado
        );

    }


    resultado.textContent =
        `Correctas: ${correctas} | Incorrectas: ${incorrectas}`;

}

/*====================================================
        TRANSCRIPCIÓN
====================================================*/

function crearTranscripcion(lista){

    if(!lista || !lista.audio){
        return "";
    }


    let html = "";


    html += `

<table class="barra-gris">
<tr>
<td>
<p>
TRANSCRIPCIÓN
</p>
</td>
</tr>
</table>


<div class="audioUCMI">

<div
class="audio-data"
data-titulo="Transcripción"
data-audio="${lista.audio}">
</div>

</div>

`;


lista.oraciones.forEach((oracion, indice)=>{


html += `

<div 
class="ejercicio-transcripcion"
data-id="transcripcion-${indice}"
>


<h3>
${++contadorEjercicios}. Transcribe lo que escuchas:
</h3>


<textarea
class="respuesta-transcripcion"
rows="3"
placeholder="Escribe la oración escuchada..."
></textarea>


<button
class="verificar"
onclick="verificarTranscripcion(this)"
data-respuesta="${escaparTexto(oracion)}"
>

Verificar

</button>


<div 
class="resultado"
data-id="transcripcion-${indice}"
></div>


</div>

`;


});


return html;

}

/*====================================================
        COMPLETAR ESPACIOS
====================================================*/

function crearCompletarEspacios(ejerciciosCompletar){

    let htmlCompletar = `

<div class="instruccion-ejercicio">
Completa cada oración con la palabra correcta.
</div>

`;


    ejerciciosCompletar.forEach((ejercicio, indice)=>{


        htmlCompletar += `

<div
class="ejercicio-completar"
data-id="completar-${indice}"
>

<h3>
${++contadorEjercicios}. ${ejercicio.oracion}
</h3>


<input
type="text"
class="respuesta-completar"
placeholder="Escribe tu respuesta"
>


<button
class="verificar"
onclick="verificarCompletar(this)"
data-correcta="${escaparTexto(ejercicio.respuesta)}"
data-explicacion="${escaparTexto(ejercicio.explicacion)}"
>
Verificar
</button>


<div
class="resultado"
data-id="completar-${indice}"
></div>


</div>

`;

    });


return htmlCompletar;

}

function crearIdentificarImagenes(config){

ordenSeleccionImagenes = 1;    

console.log(
"IDENTIFICAR CONFIG:",
config
);

console.table(config.imagenes);    


let html = `

<div class="ejercicio-identificar-imagenes">

<div class="instruccion-ejercicio">
Escucha el audio y selecciona las imágenes en el orden correcto.
</div>


<div class="audioUCMI">

<div
class="audio-data"
data-titulo="Identificar imágenes"
data-audio="${config.audio}">
</div>

</div>



<div class="galeria-imagenes">

`;

console.log(
    "IMAGENES ANTES DE ASIGNAR URL:",
    config.imagenes
);

//========================================
// MEZCLAR IMÁGENES ALEATORIAMENTE
//========================================

const imagenesMezcladas =
    [...config.imagenes];

for(
    let i = imagenesMezcladas.length - 1;
    i > 0;
    i--
){

    const j =
        Math.floor(
            Math.random() * (i + 1)
        );

    [
        imagenesMezcladas[i],
        imagenesMezcladas[j]
    ] =
    [
        imagenesMezcladas[j],
        imagenesMezcladas[i]
    ];

}    

config.imagenes.forEach(imagen=>{

console.log(
    "ORACIÓN IMAGEN:",
    imagen.codigo,
    imagen.oracion
);

});    

imagenesMezcladas.forEach((imagen, indice)=>{

let urlImagen = imagen.url || "img/no-disponible.png";

console.log(
    "IMAGEN FINAL:",
    imagen.codigo,
    urlImagen
);



html += `

<div 
class="imagen-seleccionable"
data-codigo="${imagen.codigo}"
data-oracion="${escaparTexto(imagen.oracion)}"
onclick="seleccionarImagenIdentificar(this)"
>


<img 
src="${urlImagen}"
>


<div class="circulo-seleccion">
</div>


<div class="numero-seleccion">
</div>


</div>


`;

});



html += `

</div>

<button
    type="button"
    class="boton-evaluar-imagenes"
    onclick="evaluarIdentificarImagenes()"
>
    Evaluar
</button>

<div
    id="resultado-identificar-imagenes"
    class="resultado-identificar-imagenes"
>
</div>

</div>


`;



return html;


}

/*====================================================
        MOTOR PRINCIPAL
====================================================*/

const UCMIMotorEjercicios = {

    generar(config){

        const contenedor =
        document.getElementById(config.contenedor);


        if(!contenedor){

            console.error(
            "No existe el contenedor:",
            config.contenedor
            );

            return;

        }


        let htmlFinal = "";

        console.log(
            "MOTOR ORDENAR:",
            config.ordenarOracion
        );

        contadorEjercicios = 0; 
        ordenSeleccionImagenes = 1;

        console.log("mostrarSeleccionSimple =", config.mostrarSeleccionSimple);
console.log("mostrarCompletar =", config.mostrarCompletar);
console.log("mostrarDragDrop =", config.mostrarDragDrop);
console.log("mostrarOrdenarOracion =", config.mostrarOrdenarOracion);
console.log("mostrarRelacionar =", config.mostrarRelacionar);
console.log("mostrarTraduccion =", config.mostrarTraduccion);
console.log("mostrarTranscripcion =", config.mostrarTranscripcion);

console.log(
"JSON mostrarSeleccionSimple =",
JSON.stringify(config.mostrarSeleccionSimple)
);

console.log(
"mostrarIdentificarImagenes =",
config.mostrarIdentificarImagenes
);

console.log(
"identificarImagenes =",
config.identificarImagenes
);        


        //========================================
        // SECCIÓN: SELECCIÓN SIMPLE
        //========================================

if(
    config.seleccionSimple &&
    config.mostrarSeleccionSimple !== "No"
){

    htmlFinal += crearSeleccionSimple(
        config.seleccionSimple
    );

}


//========================================
// SECCIÓN: COMPLETAR ESPACIOS
//========================================

if(
    config.completarEspacios &&
    config.mostrarCompletar !== "No"
){

    htmlFinal += crearCompletarEspacios(
        config.completarEspacios
    );

}
        
//========================================
// SECCIÓN: DRAG AND DROP - ESPACIO EN BLANCO
//========================================

if(
    config.dragDropBlanco &&
    config.mostrarDragDrop !== "No"
){

    htmlFinal += crearDragDropBlanco(
        config.dragDropBlanco
    );

}

if(
    config.ordenarOracion &&
    config.mostrarOrdenarOracion !== "No"
){

    htmlFinal += crearOrdenarOracion(
        config.ordenarOracion
    );

}

      

if(
    config.emparejarColumnas &&
    config.mostrarRelacionar !== "No"
){

    htmlFinal += crearEmparejarColumnas(
        config.emparejarColumnas
    );

}        

//========================================
// SECCIÓN: TRADUCCIÓN
//========================================

if(
    config.traduccion &&
    config.mostrarTraduccion !== "No"
){

    htmlFinal += crearTraduccion(
        config.traduccion
    );

}       

//========================================
// SECCIÓN: TRANSCRIPCIÓN
//========================================

if(
    config.transcripcion &&
    config.mostrarTranscripcion !== "No"
){

    htmlFinal += crearTranscripcion(
        config.transcripcion
    );

}        

//========================================
// SECCIÓN: IDENTIFICAR IMÁGENES
//========================================

if(
    config.identificarImagenes &&
    config.mostrarIdentificarImagenes !== "No"
){

    console.log("GENERANDO IDENTIFICAR IMÁGENES");

    htmlFinal += crearIdentificarImagenes(
        config.identificarImagenes
    );

}

//========================================
// SECCIÓN: ESTRUCTURAS GRAMATICALES
//========================================

if(
config.estructuras &&
config.estructuras.tablas &&
config.estructuras.tablas.length > 0 &&
config.mostrarEstructuras !== "No"
){

    console.log(
        "GENERANDO ESTRUCTURAS GRAMATICALES"
    );

    htmlFinal += crearEstructuras(
        config.estructuras
    );

}        
        
console.log("ESTRUCTURAS: ANTES DE INSERTAR HTML");

contenedor.innerHTML = htmlFinal;

console.log("ESTRUCTURAS: DESPUÉS DE INSERTAR HTML");

console.log(
    "BOTONES ESTRUCTURAS EN DOM:",
    contenedor.querySelectorAll(".boton-evaluar-estructuras").length
);

console.log(
    "HTML BOTONES ESTRUCTURAS:",
    contenedor.querySelectorAll(".boton-evaluar-estructuras")
);        

console.log("ESTRUCTURAS: DESPUÉS DE INSERTAR HTML");

//========================================
// ACTIVAR DRAG & DROP DE ESTRUCTURAS
//========================================

console.log("========== ACTIVACIÓN ESTRUCTURAS ==========");
console.log("config.estructuras =", config.estructuras);
console.log("config.estructuras.tablas =", config.estructuras?.tablas);
console.log("cantidad tablas =", config.estructuras?.tablas?.length);
console.log("config.mostrarEstructuras =", config.mostrarEstructuras);

if(
    config.estructuras &&
    config.estructuras.tablas &&
    config.estructuras.tablas.length > 0
){

    console.log("ESTRUCTURAS: llamando activarDragDropEstructuras()");
    activarDragDropEstructuras();

}else{

    console.log("ESTRUCTURAS: NO SE ACTIVA PORQUE FALTA config.estructuras.tablas");

}

//========================================
// RECUPERAR RESULTADOS GUARDADOS
//========================================

setTimeout(()=>{

    document.querySelectorAll(
        ".resultado[data-id]"
    )
    .forEach(resultado=>{


        const id =
        resultado.dataset.id;


        const guardado =
        UCMIResultados.obtener(id);


        if(guardado){


            resultado.innerHTML =
            guardado.resultado;


            resultado.style.color =
            guardado.color;


const bloque =
resultado.closest(
".ejercicio-sel-simple, .ejercicio-completar, .ejercicio-drag-drop, .ejercicio-ordenar-oracion, .ejercicio-transcripcion, .ejercicio-traduccion"
);


            if(bloque){

        const boton =
        bloque.querySelector(
            ".verificar, .evaluar-drag, .evaluar-ordenar"
        );


                if(boton){

                    boton.disabled = true;

                    boton.style.opacity="0.5";

                    boton.style.cursor="not-allowed";

                }

            }


        }


    });


},100);


}

};

function verificarCompletar(boton){

const bloque =
boton.closest(
".ejercicio-completar"
);


const entrada =
bloque.querySelector(
".respuesta-completar"
);


const resultado =
bloque.querySelector(
".resultado"
);


const correcta =
normalizarRespuestaTraduccion(
boton.dataset.correcta
);


const usuario =
normalizarRespuestaTraduccion(
entrada.value
);


if(usuario === correcta){

resultado.innerHTML =
"✅ Correcto.<br><br><b>Explicación:</b> "
+
boton.dataset.explicacion;

resultado.style.color="green";


}else{

resultado.innerHTML =
"❌ Incorrecto.<br><br><b>Respuesta correcta:</b> "
+
boton.dataset.correcta
+
"<br><br><b>Explicación:</b> "
+
boton.dataset.explicacion;

resultado.style.color="red";

}


UCMIResultados.guardar(

bloque.dataset.id,

{

resultado:resultado.innerHTML,

color:resultado.style.color

}

);


}


    function verificarPregunta(boton){

    const bloque = boton.closest(".ejercicio-sel-simple");

    const correcta = boton.dataset.correcta;

    const explicacion = boton.dataset.explicacion;

    const seleccionada =
    bloque.querySelector(
        'input[type="radio"]:checked'
    );

    const resultado =
    bloque.querySelector(".resultado");


    if(!seleccionada){

        resultado.innerHTML =
        "⚠ Debes seleccionar una respuesta.";

        resultado.style.color="orange";

        return;

    }


if(seleccionada.value === correcta){

    resultado.innerHTML =
    "✅ Correcto.<br><br><b>Explicación:</b> "
    + explicacion;

    resultado.style.color="green";


}else{


    resultado.innerHTML =
    "❌ Incorrecto.<br><br><b>Explicación:</b> "
    + explicacion;

    resultado.style.color="red";

}


// GUARDAR RESULTADO DEL EJERCICIO

UCMIResultados.guardar(
    bloque.dataset.id,
    {
        resultado: resultado.innerHTML,
        color: resultado.style.color
    }
);


}


//========================================
// Generar ejercicios completar espacios
//========================================

function generarComparacionTraduccion(
    usuario,
    correcta
){

    const palabrasUsuario =
    usuario.split(" ");


    const palabrasCorrecta =
    correcta.split(" ");


    let filas = "";


    const cantidad =
    Math.max(
        palabrasUsuario.length,
        palabrasCorrecta.length
    );


    for(let i = 0; i < cantidad; i++){


const palabraUsuario =
palabrasUsuario[i] || "";

const palabraCorrecta =
palabrasCorrecta[i] || "";

const palabraUsuarioMostrar =
palabrasUsuarioOriginal[i] || "";

const palabraCorrectaMostrar =
palabrasCorrectaOriginal[i] || "";

if(
    !palabraUsuarioMostrar &&
    !palabraCorrectaMostrar
){
    continue;
}
        
        const coincide =
        palabraUsuario === palabraCorrecta;


        filas += `

<tr>

<td class="${coincide ? "palabra-correcta" : "palabra-error"}">

${

palabraUsuario

?

(coincide ? "🟩 " : "❌ ") + palabraUsuario

:

""

}

</td>


<td class="palabra-correcta">

${

palabraCorrecta

?

(coincide ? "🟩 " : "✅ ") + palabraCorrecta

:

""

}

</td>


</tr>

`;

    }


    return `

<table class="tabla-comparacion-traduccion">


<thead>

<tr>

<th>
Tu respuesta
</th>


<th>
Respuesta correcta
</th>

</tr>

</thead>


<tbody>

${filas}

</tbody>


</table>

`;

}

/*====================================================
 UTILIDADES PARA COMPARACIÓN DE TRADUCCIONES
====================================================*/

function obtenerPalabrasOriginales(texto){

    return String(texto ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

}

function obtenerPalabrasNormalizadas(texto){

    return normalizarRespuestaTraduccion(texto)
    .split(/\s+/)
    .filter(Boolean);

}

function expandirPalabrasConOrigen(texto){

    const originales =
    obtenerPalabrasOriginales(texto);

    const resultado = [];

    originales.forEach(original=>{

        const normalizadas =
        obtenerPalabrasNormalizadas(original);

        resultado.push({

            original,

            normalizadas

        });

    });

    return resultado;

}

function construirMapaOrden(palabras){

    const mapa = new Map();

    palabras.forEach((palabra, indice)=>{

        if(!mapa.has(palabra)){

            mapa.set(palabra, []);

        }

        mapa.get(palabra).push(indice);

    });

    return mapa;

}

function evaluarOrdenRelativo(
    palabrasUsuario,
    palabrasCorrectas
){

    const mapa =
    construirMapaOrden(palabrasCorrectas);

    const usadas =
    new Map();

    let ultimoIndice = -1;

    const resultado = [];

    palabrasUsuario.forEach(palabra=>{

        // La palabra no existe en la respuesta correcta
        if(!mapa.has(palabra)){

            resultado.push("❌");

            return;

        }

        const posiciones =
        mapa.get(palabra);

        const usadasDeEsta =
        usadas.get(palabra) || 0;

        // Ya se usaron todas las ocurrencias
        if(usadasDeEsta >= posiciones.length){

            resultado.push("❌");

            return;

        }

        const indiceEsperado =
        posiciones[usadasDeEsta];

        usadas.set(
            palabra,
            usadasDeEsta + 1
        );

        if(indiceEsperado > ultimoIndice){

            resultado.push("🟩");

            ultimoIndice = indiceEsperado;

        }else{

            resultado.push("🟨");

        }

    });

    return resultado;

}

function compararTraduccionInteligente(
    usuarioOriginal,
    correctaOriginal
){

    const usuarioMostrar =
    usuarioOriginal
    .trim()
    .split(/\s+/)
    .filter(Boolean);


    const correctaMostrar =
    correctaOriginal
    .trim()
    .split(/\s+/)
    .filter(Boolean);



    const usuario =
    normalizarRespuestaTraduccion(usuarioOriginal)
    .split(/\s+/)
    .filter(Boolean);



    const correcta =
    normalizarRespuestaTraduccion(correctaOriginal)
    .split(/\s+/)
    .filter(Boolean);



    const estados =
    new Array(usuario.length)
    .fill("❌");



    // Guardar posiciones de cada palabra correcta

    const posicionesCorrectas = {};


    correcta.forEach((palabra, indice)=>{

        if(!posicionesCorrectas[palabra]){

            posicionesCorrectas[palabra]=[];

        }

        posicionesCorrectas[palabra].push(indice);

    });



    // Guardar posiciones de palabras escritas por usuario

    const posicionesUsuario = {};


    usuario.forEach((palabra, indice)=>{

        if(!posicionesUsuario[palabra]){

            posicionesUsuario[palabra]=[];

        }

        posicionesUsuario[palabra].push(indice);

    });



    // Evaluar relación de orden

    usuario.forEach((palabra, indiceUsuario)=>{


        if(!posicionesCorrectas[palabra]){

            estados[indiceUsuario]="❌";

            return;

        }



        let mantieneOrden=false;



        posicionesCorrectas[palabra]
        .forEach(posicionCorrecta=>{


            const anteriores =
            correcta.slice(
                0,
                posicionCorrecta
            );


            const posteriores =
            correcta.slice(
                posicionCorrecta+1
            );



            let anteriorOK=true;


            anteriores.forEach(p=>{


                if(posicionesUsuario[p]){


                    if(
                        posicionesUsuario[p][0]
                        >
                        indiceUsuario
                    ){

                        anteriorOK=false;

                    }

                }

            });



            let posteriorOK=true;


            posteriores.forEach(p=>{


                if(posicionesUsuario[p]){


                    if(
                        posicionesUsuario[p][0]
                        <
                        indiceUsuario
                    ){

                        posteriorOK=false;

                    }

                }

            });



            if(
                anteriorOK &&
                posteriorOK
            ){

                mantieneOrden=true;

            }



        });



        if(mantieneOrden){

            estados[indiceUsuario]="🟩";

        }else{

            estados[indiceUsuario]="🟨";

        }


    });



    // Crear tabla visual

    let html = `

<table class="tabla-comparacion-traduccion">

<tr>

<th>
Tu respuesta
</th>

<th>
Respuesta correcta
</th>

</tr>

`;



    const filas =
    Math.max(
        usuarioMostrar.length,
        correctaMostrar.length
    );



    for(let i=0;i<filas;i++){


        html += `

<tr>

<td>

${
usuarioMostrar[i]
?
(estados[i] || "❌")
+
" "
+
usuarioMostrar[i]
:
""
}

</td>


<td>

${
correctaMostrar[i]
?
"🟩 "
+
correctaMostrar[i]
:
""
}

</td>


</tr>

`;

    }



    html += "</table>";



    return {

        usuario:html,

        correcta:""

    };


}

function verificarTraduccion(boton){
console.log("ENTRÓ A verificarTraduccion");
    
    const respuestaCorrecta =
    boton.dataset.respuesta;

    const respuestasAlternativas =
    JSON.parse(
        boton.dataset.respuestas || "[]"
    );

    const explicacion =
    boton.dataset.explicacion;

    const contenedor =
    boton.parentElement;

    const entrada =
    contenedor.querySelector(
        ".respuesta-traduccion"
    );

    const resultado =
    contenedor.querySelector(
        ".resultado"
    );

    const respuestaUsuario =
    normalizarRespuestaTraduccion(
        entrada.value
    );

    const respuestasValidas = [

        respuestaCorrecta,

        ...respuestasAlternativas

    ]
    .filter(r => r && r.trim() !== "")
    .map(r =>
        normalizarRespuestaTraduccion(r)
    );

    console.log("Respuesta usuario:", respuestaUsuario);
console.log("Respuesta correcta:", respuestaCorrecta);
console.log("Alternativas:", respuestasAlternativas);
console.log("Respuestas válidas:", respuestasValidas);

console.log("USUARIO NORMALIZADO:", respuestaUsuario);

console.log(
"VALIDAS NORMALIZADAS:",
respuestasValidas
);
    
    if(respuestasValidas.includes(respuestaUsuario)){

        resultado.innerHTML =
        "✅ Correcto.<br><br><b>Explicación:</b> "
        + explicacion;

        resultado.style.color = "green";

}else{


const comparacion =
compararTraduccionInteligente(
    entrada.value,
    respuestaCorrecta
);


resultado.innerHTML =

"❌ Incorrecto.<br><br>" +

comparacion.usuario +

"<br>" +

comparacion.correcta +

"<br><b>Explicación:</b> " +

explicacion;


resultado.style.color = "red";


}

    UCMIResultados.guardar(

        contenedor.dataset.id,

        {

            resultado: resultado.innerHTML,

            color: resultado.style.color

        }

    );

}

function verificarTranscripcion(boton){

const bloque =
boton.closest(
".ejercicio-transcripcion"
);


const respuestaUsuario =
bloque.querySelector(
".respuesta-transcripcion"
)
.value
.trim();


const respuestaCorrecta =
boton.dataset.respuesta
.trim();


const resultado =
bloque.querySelector(
".resultado"
);


if(
respuestaUsuario
.replace(/\s+/g," ")
.toLowerCase()
===
respuestaCorrecta
.replace(/\s+/g," ")
.toLowerCase()
){

resultado.innerHTML =
"✅ Correcto";

resultado.style.color="green";


}else{

resultado.innerHTML =
"❌ Incorrecto.<br><br>"+
"<b>Respuesta correcta:</b> "+
respuestaCorrecta;

resultado.style.color="red";

}


UCMIResultados.guardar(
bloque.dataset.id,
{
resultado:resultado.innerHTML,
color:resultado.style.color
}
);


}

function evaluarDrag(boton){


const bloque =
boton.closest(
".ejercicio-drag-drop"
);


const espacio =
bloque.querySelector(
".espacio-drop"
);


const resultado =
bloque.querySelector(
".resultado"
);



const respuestaCorrecta =
espacio.dataset.correcta;



const botonColocado =
espacio.querySelector(
    ".boton-arrastrable"
);


const respuestaUsuario =
botonColocado
? botonColocado.textContent.trim()
: "";

if(respuestaUsuario === respuestaCorrecta){


resultado.innerHTML =
"✅ Correcto";


resultado.style.color =
"green";


}else{


resultado.innerHTML =
"❌ Incorrecto.<br><br>"
+
"<b>Respuesta correcta:</b> "
+
respuestaCorrecta;


resultado.style.color =
"red";

}



// Guardar resultado

UCMIResultados.guardar(

bloque.dataset.id,

{

resultado:
resultado.innerHTML,

color:
resultado.style.color

}

);


}

/*====================================================
        ORDENAR ORACIÓN - PALABRA A PALABRA
====================================================*/

function crearOrdenarOracion(ejerciciosOrdenar){

    let htmlOrdenar = `

<div class="instruccion-ejercicio">
Arrastra las palabras para formar la oración correcta.
</div>

`;


    ejerciciosOrdenar.forEach((ejercicio, indice)=>{


        // Separar oración en palabras

        let palabras = ejercicio.oracion.match(/\S+/g);


        // Crear copia mezclada

        let palabrasMezcladas = [...palabras];


        for(let i = palabrasMezcladas.length - 1; i > 0; i--){

            const j = Math.floor(
                Math.random() * (i + 1)
            );


            [
                palabrasMezcladas[i],
                palabrasMezcladas[j]
            ] =
            [
                palabrasMezcladas[j],
                palabrasMezcladas[i]
            ];

        }



        htmlOrdenar += `

<div 
class="ejercicio-ordenar-oracion"
data-id="ordenar-${indice}"
>

<h3>
${++contadorEjercicios}. Ordena la oración:
</h3>

<div class="banco-palabras-oracion">
${
palabrasMezcladas.map(palabra=>`

<button
class="palabra-arrastrable"
draggable="true"
data-id="boton-${contadorEjercicios}-${escaparTexto(palabra)}"
>

${palabra}
</button>
`).join("")
}
</div>

<div class="zona-destino-oracion"
data-respuesta='${escaparTexto(ejercicio.oracion)}'
>
Arrastra aquí las palabras
</div>


<button 
class="evaluar-ordenar"
onclick="evaluarOrdenar(this)"
>
Evaluar
</button>


<div 
class="resultado"
data-id="ordenar-${indice}"
></div>


`;
    });
    console.log(
    "HTML ORDENAR GENERADO CORRECTAMENTE"
);

return htmlOrdenar;
}

/*====================================================
        EVENTOS DRAG AND DROP
====================================================*/


/*====================================================
        EVENTO DRAGSTART
====================================================*/

/*====================================================
        EVENTO DRAGSTART
====================================================*/

document.addEventListener(
"dragstart",
function(event){

if(
    event.target.classList.contains("palabra-arrastrable")
    ||
    event.target.classList.contains("boton-arrastrable")
    ||
    event.target.classList.contains("izquierda-relacionar")
    ||
    event.target.classList.contains("relacion-ocupada")
){

        let palabra =
        event.target.textContent.trim();


        let idBoton =
        event.target.dataset.id;


        if(!idBoton){

            idBoton =
            "boton-" + Date.now();


            event.target.dataset.id =
            idBoton;

        }


        event.dataTransfer.setData(
            "respuesta",
            palabra
        );


        event.dataTransfer.setData(
            "boton",
            idBoton
        );


        let tipo = "ordenar";


if(
event.target.classList.contains("boton-arrastrable")
){
    tipo = "drag-blanco";
}


if(
    event.target.classList.contains("izquierda-relacionar")
    ||
    event.target.classList.contains("relacion-ocupada")
){
    tipo = "relacionar";
}


event.dataTransfer.setData(
    "tipo",
    tipo
);
    }

});

        
window.UCMIMotorEjercicios = UCMIMotorEjercicios;
window.UCMIRestaurarEjercicios = UCMIRestaurarEjercicios;

function evaluarOrdenar(boton){

const bloque =
boton.closest(
".ejercicio-ordenar-oracion"
);

const zona =
bloque.querySelector(
".zona-destino-oracion"
);

const respuestaCorrecta =
zona.dataset.respuesta.trim();

const palabrasUsuario =
[...zona.querySelectorAll(
".palabra-arrastrable"
)]
.map(boton =>
boton.textContent.trim()
)
.join(" ")
.trim();

const resultado =
bloque.querySelector(
".resultado"
);

const respuestaUsuarioNormalizada =
palabrasUsuario
.trim()
.replace(/\s+/g," ")
.normalize();

const respuestaCorrectaNormalizada =
respuestaCorrecta
.trim()
.replace(/\s+/g," ")
.normalize();

if(
respuestaUsuarioNormalizada ===
respuestaCorrectaNormalizada
){

resultado.innerHTML =
"✅ Correcto";

resultado.style.color =
"green";

}else{

resultado.innerHTML =
"❌ Incorrecto." +
" Respuesta correcta: " +
respuestaCorrecta;

resultado.style.color =
"red";

}

// GUARDAR RESULTADO

UCMIResultados.guardar(
bloque.dataset.id,
{
resultado: resultado.innerHTML,
color: resultado.style.color
}
);

}

let ordenSeleccionImagenes = 1;

function seleccionarImagenIdentificar(elemento){

    console.log("IMAGEN TOCADA:", elemento);

    const circulo =
        elemento.querySelector(".circulo-seleccion");

    console.log("CÍRCULO ENCONTRADO:", circulo);

    if(!circulo){
        console.error(
            "NO SE ENCONTRÓ .circulo-seleccion"
        );
        return;
    }

    if(circulo.textContent.trim() !== ""){
        return;
    }

    circulo.textContent =
        ordenSeleccionImagenes;

    elemento.classList.add(
        "imagen-seleccionada"
    );

    console.log(
        "NÚMERO ASIGNADO:",
        ordenSeleccionImagenes
    );

    ordenSeleccionImagenes++;

}

function evaluarIdentificarImagenes(){

    console.log(
        "EVALUANDO IDENTIFICAR IMÁGENES"
    );


    const ejercicio =
        document.querySelector(
            ".ejercicio-identificar-imagenes"
        );


    if(!ejercicio){

        console.error(
            "NO SE ENCONTRÓ EL EJERCICIO"
        );

        return;

    }


    const resultado =
        ejercicio.querySelector(
            "#resultado-identificar-imagenes"
        );


    const botonEvaluar =
        ejercicio.querySelector(
            ".boton-evaluar-imagenes"
        );


    const imagenes =
        [
            ...ejercicio.querySelectorAll(
                ".imagen-seleccionable"
            )
        ];


    //========================================
    // VERIFICAR QUE TODAS FUERON SELECCIONADAS
    //========================================

    const seleccionadas =
        imagenes.filter(imagen => {

            const circulo =
                imagen.querySelector(
                    ".circulo-seleccion"
                );

            return (
                circulo &&
                circulo.textContent.trim() !== ""
            );

        });


    if(
        seleccionadas.length !==
        imagenes.length
    ){

        resultado.innerHTML =
            "⚠️ Debes seleccionar todas las imágenes antes de evaluar.";

        resultado.style.color =
            "orange";

        return;

    }


    //========================================
    // ORDEN CORRECTO
    //========================================

    const ordenCorrecto =
        [...imagenes]
        .sort((a,b)=>{

            const codigoA =
                a.dataset.codigo;

            const codigoB =
                b.dataset.codigo;


            const numeroA =
                parseInt(
                    codigoA.match(/I(\d+)$/)[1]
                );

            const numeroB =
                parseInt(
                    codigoB.match(/I(\d+)$/)[1]
                );


            return numeroA - numeroB;

        });


    //========================================
    // ORDEN SELECCIONADO POR EL ESTUDIANTE
    //========================================

    const ordenUsuario =
        [...seleccionadas]
        .sort((a,b)=>{

            const numeroA =
                parseInt(
                    a.querySelector(
                        ".circulo-seleccion"
                    ).textContent
                );

            const numeroB =
                parseInt(
                    b.querySelector(
                        ".circulo-seleccion"
                    ).textContent
                );


            return numeroA - numeroB;

        });


    console.log(
        "ORDEN CORRECTO:",
        ordenCorrecto.map(
            imagen => imagen.dataset.codigo
        )
    );


    console.log(
        "ORDEN USUARIO:",
        ordenUsuario.map(
            imagen => imagen.dataset.codigo
        )
    );


//========================================
// COMPARAR
//========================================

let cantidadErrores = 0;

let htmlResultado = "";


ordenUsuario.forEach(
    (imagenUsuario, indice) => {


        const imagenCorrecta =
            ordenCorrecto[indice];


        const codigoUsuario =
            imagenUsuario.dataset.codigo;


        const codigoCorrecto =
            imagenCorrecta.dataset.codigo;


        const numero =
            indice + 1;


        const oracionUsuario =
            imagenUsuario.dataset.oracion;


        const oracionCorrecta =
            imagenCorrecta.dataset.oracion;


        //========================================
        // RESPUESTA CORRECTA
        //========================================

        if(
            codigoUsuario ===
            codigoCorrecto
        ){

            htmlResultado += `

            <div class="resultado-imagen-correcta">

                🟩 <b>${numero}.</b>
                ${escaparTexto(oracionCorrecta)}

            </div>

            `;


        }


        //========================================
        // RESPUESTA INCORRECTA
        //========================================

        else{

            cantidadErrores++;


            htmlResultado += `

            <div class="resultado-imagen-error">

                ❌ <b>${numero}.</b>

                <br>

                <b>Tu imagen:</b>
                ${escaparTexto(oracionUsuario)}

                <br>

                <b>Correcta:</b>
                ${escaparTexto(oracionCorrecta)}

            </div>

            `;

        }

    }
);

    //========================================
    // RESULTADO FINAL
    //========================================

    if(cantidadErrores === 0){

        resultado.innerHTML = `

            <div class="resultado-imagen-excelente">

                ✅ ¡Excelente!
                Todas las imágenes están
                en el orden correcto.

            </div>

        `;

        resultado.style.color =
            "green";


    }else{

        resultado.innerHTML = `

            <div class="resultado-imagen-resumen">

                ❌ Hay ${cantidadErrores}
                ${
                    cantidadErrores === 1
                    ? "error"
                    : "errores"
                } en el orden.

            </div>

            <div class="lista-resultados-imagenes">

                ${htmlResultado}

            </div>

        `;

        resultado.style.color =
            "red";

    }


    //========================================
    // DESHABILITAR EVALUACIÓN
    //========================================

    if(botonEvaluar){

        botonEvaluar.disabled =
            true;

        botonEvaluar.style.opacity =
            "0.5";

        botonEvaluar.style.cursor =
            "not-allowed";

    }


}

document.addEventListener(
"dragover",
function(event){

    if(
        event.target.classList.contains("espacio-drop")
        ||
        event.target.classList.contains("zona-destino-oracion")
        ||
        event.target.classList.contains("banco-palabras-oracion")
        ||
        event.target.classList.contains("derecha-relacionar")
        ||
        event.target.classList.contains("derecha-relacionar")
    ){

        event.preventDefault();

    }

});

document.addEventListener(
"drop",
function(event){

    if(
    event.target.classList.contains("espacio-drop")
    ||
    event.target.classList.contains("zona-destino-oracion")
    ||
    event.target.classList.contains("banco-palabras-oracion")
    ||
    event.target.classList.contains("derecha-relacionar")
){

        event.preventDefault();


        const idBoton =
        event.dataTransfer.getData(
            "boton"
        );


        const botonArrastrado =
        document.querySelector(
            `[data-id="${idBoton}"]`
        );


        if(!botonArrastrado){
            return;
        }


        const origen =
        botonArrastrado.parentElement;


        const destino =
        event.target;


// Caso relacionar columnas

if(destino.classList.contains("derecha-relacionar")){

    // Si la casilla ya tiene una palabra, devolverla a su casilla original
    const palabraExistente =
    destino.querySelector(".relacion-ocupada");

    if(palabraExistente){

        const significadoOriginal =
        palabraExistente.dataset.respuesta;

        const casillaOriginal =
        [...document.querySelectorAll(".derecha-relacionar")]
        .find(c=>c.dataset.valor===significadoOriginal);

        if(casillaOriginal){

            casillaOriginal.innerHTML =
            casillaOriginal.dataset.original;

            casillaOriginal.style.background="";
            casillaOriginal.style.border="";

        }

    }

    // Restaurar el texto del lugar desde donde salió la palabra
    const casillaAnterior =
    botonArrastrado.parentElement;

    if(
        casillaAnterior &&
        casillaAnterior.classList.contains("derecha-relacionar")
    ){

        casillaAnterior.innerHTML =
        casillaAnterior.dataset.original;

        casillaAnterior.style.background="";
        casillaAnterior.style.border="";
    }

    // Colocar la nueva palabra
    destino.innerHTML="";

    destino.appendChild(botonArrastrado);

    botonArrastrado.classList.add("relacion-ocupada");

    const correctaRelacion =
    botonArrastrado.dataset.respuesta;

    const colocadaRelacion =
    destino.dataset.valor;

    if(correctaRelacion===colocadaRelacion){

        destino.style.background="lightgreen";
        destino.style.border="2px solid green";

    }else{

        destino.style.background="#ffcccc";
        destino.style.border="2px solid red";

    }

    return;

}
        
// Caso drag blanco
if(
    destino.classList.contains("espacio-drop")
){

    destino.innerHTML = "";

    destino.appendChild(
        botonArrastrado
    );

    botonArrastrado.classList.add("relacion-ocupada");

    botonArrastrado.classList.add(
        "colocado-drop"
    );

    return;

}


        // Quitar texto inicial de la caja

        if(
            destino.classList.contains(
                "zona-destino-oracion"
            )
        ){

            if(
                destino.textContent.includes(
                    "Arrastra aquí las palabras"
                )
            ){

                destino.textContent = "";

            }

        }



        // Mover el mismo botón, no crear copias

        destino.appendChild(
            botonArrastrado
        );


    }

});
