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

    return String(texto ?? "")

    // minúsculas
    .toLowerCase()

    // elimina espacios repetidos
    .replace(/\s+/g," ")

    // elimina espacios al inicio y final
    .trim()

    // convierte apóstrofes tipográficos
    .replace(/[’`´]/g,"'")

    // elimina punto final
    .replace(/\.$/,"")

    // elimina coma final
    .replace(/,$/,"")

    // elimina signos de exclamación e interrogación finales
    .replace(/[!?]+$/,"");

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
${++contadorEjercicios}. ${ejercicio.pregunta}
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

if(
    config.traduccion &&
    config.mostrarTraduccion !== "No"
){

    htmlFinal += crearTraduccion(
        config.traduccion
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

contenedor.innerHTML = htmlFinal;


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
    ".ejercicio-sel-simple, .ejercicio-completar, .ejercicio-drag-drop, .ejercicio-ordenar-oracion"
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


function crearCompletarEspacios(ejerciciosCompletar){

    let htmlCompletar = `

<div class="instruccion-ejercicio">
Escribe la expresión que hace falta para completar la oración.
</div>

`;


    ejerciciosCompletar.forEach((ejercicio, indice)=>{


        htmlCompletar += `

<div 
class="ejercicio-completar"
data-id="completar-${indice}"
>


<h3>
${++contadorEjercicios}. ${ejercicio.pregunta}
</h3>


<input 
type="text"
class="respuesta-escrita"
placeholder="Escriba su respuesta">


<button
class="verificar"
onclick="verificarCompletar(this)"

data-respuesta='${escaparTexto(ejercicio.respuesta)}'

data-explicacion='${escaparTexto(ejercicio.explicacion)}'>

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

function verificarCompletar(boton){


const respuestaCorrecta =
boton.dataset.respuesta;


const explicacion =
boton.dataset.explicacion;


const contenedor =
boton.parentElement;


const entrada =
contenedor.querySelector(".respuesta-escrita");


const resultado =
contenedor.querySelector(".resultado");


const respuestaUsuario =
entrada.value.trim().toLowerCase();



if(respuestaUsuario === respuestaCorrecta.toLowerCase()){


resultado.innerHTML =
"✅ Correcto<br><br><b>Explicación:</b> "
+ explicacion;


resultado.style.color="green";


}else{


resultado.innerHTML =
"❌ Incorrecto<br><br>Respuesta correcta: "
+ respuestaCorrecta
+ "<br><br><b>Explicación:</b> "
+ explicacion;


resultado.style.color="red";


}


// GUARDAR RESULTADO DEL EJERCICIO

UCMIResultados.guardar(
    contenedor.dataset.id,
    {
        resultado: resultado.innerHTML,
        color: resultado.style.color
    }
);


}

/*====================================================
        VERIFICAR TRADUCCIÓN
====================================================*/

function verificarTraduccion(boton){

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

    if(respuestasValidas.includes(respuestaUsuario)){

        resultado.innerHTML =
        "✅ Correcto.<br><br><b>Explicación:</b> "
        + explicacion;

        resultado.style.color = "green";

    }else{

        resultado.innerHTML =
        "❌ Incorrecto.<br><br><b>Respuesta correcta:</b> "
        + respuestaCorrecta
        + "<br><br><b>Explicación:</b> "
        + explicacion;

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



if(
palabrasUsuario
.trim()
.replace(/\s+/g," ")
.normalize()
===
respuestaCorrecta
.trim()
.replace(/\s+/g," ")
.normalize()
){


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

// GUARDAR RESULTADO

UCMIResultados.guardar(
    bloque.dataset.id,
    {
        resultado: resultado.innerHTML,
        color: resultado.style.color
    }
);

}

console.log("MOTOR CARGADO CORRECTAMENTE");

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
