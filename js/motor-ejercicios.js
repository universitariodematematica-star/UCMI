let contadorEjercicios = 0;

function escaparTexto(texto){

    return String(texto ?? "")
    .replace(/&/g,"&amp;")
    .replace(/'/g,"&#39;")
    .replace(/"/g,"&quot;")
    .replace(/\n/g," ");

}

/*====================================================
        SECCIÓN: SELECCIÓN SIMPLE
====================================================*/

function crearSeleccionSimple(ejerciciosSelSimple){

    let htmlSelSimple = "";

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

<div class="ejercicio-sel-simple">

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


<div class="resultado"></div>


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


<div class="ejercicio-drag-drop">


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

>

${opcion}

</button>


`).join("")}



</div>



<div class="resultado"></div>



</div>


`;

    });


    return htmlDragDrop;

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

        contadorEjercicios = 0;    


        //========================================
        // SECCIÓN: SELECCIÓN SIMPLE
        //========================================

        if(config.seleccionSimple){

            htmlFinal += crearSeleccionSimple(
                config.seleccionSimple
            );

        }


        //========================================
        // SECCIÓN: COMPLETAR ESPACIOS
        //========================================

        if(config.completarEspacios){

            htmlFinal += crearCompletarEspacios(
                config.completarEspacios
            );

        }

            //========================================
        // SECCIÓN: DRAG AND DROP - ESPACIO EN BLANCO
        //========================================

if(config.dragDropBlanco){

    htmlFinal += crearDragDropBlanco(
        config.dragDropBlanco
    );

}

if(config.ordenarOracion){

    htmlFinal += crearOrdenarOracion(
        config.ordenarOracion
    );

}        

        contenedor.innerHTML = htmlFinal;


    }

};


window.UCMIMotorEjercicios = UCMIMotorEjercicios;

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

<div class="ejercicio-completar">


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


<div class="resultado"></div>


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

        let palabras = ejercicio.oracion.split(" ");


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


<div class="ejercicio-ordenar-oracion">
<h3>
${++contadorEjercicios}. Ordena la oración:
</h3>
<div class="zona-destino-oracion"
data-respuesta='${ejercicio.oracion}'
>
</div>
<div class="banco-palabras-oracion">
${
palabrasMezcladas.map(palabra=>`
<button
class="palabra-arrastrable"
draggable="true"
>
${palabra}
</button>
`).join("")
}
</div>
<div class="resultado"></div>
</div>
`;
    });
    return htmlOrdenar;
}

/*====================================================
        EVENTOS DRAG AND DROP
====================================================*/


document.addEventListener(
"dragstart",
function(event){


    if(
    event.target.classList.contains(
        "boton-arrastrable"
    )
    ){

        event.dataTransfer.setData(
            "respuesta",
            event.target.textContent.trim()
        );

    }


});


document.addEventListener(
"dragover",
function(event){


    if(
    event.target.classList.contains(
        "espacio-drop"
    )
    ){

        event.preventDefault();

    }


});


document.addEventListener(
"drop",
function(event){


    if(
    event.target.classList.contains(
        "espacio-drop"
    )
    ){

        event.preventDefault();


        const respuesta =
        event.dataTransfer.getData(
            "respuesta"
        );


        const correcta =
        event.target.dataset.correcta;

        const explicacion =
        event.target.dataset.explicacion;    

        const bloque =
        event.target.closest(
            ".ejercicio-drag-drop"
        );


        const resultado =
        bloque.querySelector(
            ".resultado"
        );



        if(respuesta === correcta){


            event.target.innerHTML =
            respuesta;


            event.target.classList.add(
                "correcto-drag"
            );


            resultado.innerHTML =
                "✅ Correcto.<br><br><b>Explicación:</b> "
                + explicacion;


            resultado.style.color =
            "green";



        }else{


            resultado.innerHTML =
        "❌ Incorrecto.<br><br><b>Explicación:</b> "
        + explicacion;


            resultado.style.color =
            "red";


        }


    }


});
