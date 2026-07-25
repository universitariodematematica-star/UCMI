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
${indice + 1}. ${ejercicio.pregunta}
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
onclick="verificarPregunta(

this,

'${ejercicio.correcta}',

'${ejercicio.explicacion}'

)">

Verificar

</button>


<div class="resultado"></div>


</div>

`;

});

return htmlSelSimple;

} 

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


        contenedor.innerHTML = htmlFinal;


    }

};


window.UCMIMotorEjercicios = UCMIMotorEjercicios;

function verificarPregunta(

    boton,

    correcta,

    explicacion

){

    const bloque = boton.parentElement;

    const seleccionada =
    bloque.querySelector(
        'input[type="radio"]:checked'
    );


    const resultado =
    bloque.querySelector(".resultado");


    if(!seleccionada){

        resultado.innerHTML =
        "⚠ Debes seleccionar una respuesta.";

        resultado.style.color = "orange";

        return;

    }


    if(seleccionada.value === correcta){

        resultado.innerHTML =
        "✅ Correcto.<br><br><b>Explicación:</b> "
        + explicacion;

        resultado.style.color = "green";

    }else{

        resultado.innerHTML =
        "❌ Incorrecto.<br><br><b>Explicación:</b> "
        + explicacion;

        resultado.style.color = "red";

    }

}

//========================================
// Generar ejercicios completar espacios
//========================================

function crearCompletarEspacios(ejerciciosCompletar){

    let htmlCompletar = "";

    ejerciciosCompletar.forEach((ejercicio, indice)=>{


        htmlCompletar += `

<div class="ejercicio-completar">

<h3>
${indice + 1}. ${ejercicio.pregunta}
</h3>


<input 
type="text"
class="respuesta-escrita"
placeholder="Escriba su respuesta">


<button
class="verificar"
onclick="verificarCompletar(

this,

'${ejercicio.respuesta}',

'${ejercicio.explicacion}'

)">

Verificar

</button>


<div class="resultado"></div>


</div>

`;

    });


    return htmlCompletar;

}

function verificarCompletar(boton,respuestaCorrecta,explicacion){

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
        "✅ Correcto<br>" + explicacion;

        resultado.style.color="green";

    }else{

        resultado.innerHTML =
        "❌ Incorrecto<br>Respuesta correcta: "
        + respuestaCorrecta
        + "<br>"
        + explicacion;

        resultado.style.color="red";

    }

}
