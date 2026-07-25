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

        const ejercicios =
        config.ejercicios;


        const contenedor =
        document.getElementById(config.contenedor);


        if(!contenedor){

            console.error(
            "No existe el contenedor:",
            config.contenedor
            );

            return;

        }


        contenedor.innerHTML =
        crearSeleccionSimple(ejercicios);

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
