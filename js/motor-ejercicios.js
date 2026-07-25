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

    async cargar(config){

        const codigo = config.codigo;
        const contenedor = document.getElementById(config.contenedor);

        if(!contenedor){
            console.error("No existe el contenedor:", config.contenedor);
            return;
        }

        try{

            // Archivo que contiene los ejercicios
            const respuesta = await fetch(
                `ejercicios/${codigo}.json`
            );

            if(!respuesta.ok){
                throw new Error("No existe el archivo.");
            }

            const datos = await respuesta.json();

            contenedor.innerHTML =
                crearSeleccionSimple(datos);

        }catch(error){

            contenedor.innerHTML = `
            <div style="
                background:#ffecec;
                color:#900;
                padding:20px;
                border-radius:12px;
            ">
                No fue posible cargar los ejercicios:
                <br><br>
                <b>${codigo}</b>
            </div>
            `;

            console.error(error);

        }

    }

};
