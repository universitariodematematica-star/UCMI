/*=====================================================
    GENERADOR HTML ERG
    Construye la página final de ejercicios resueltos
=====================================================*/

function generarCodigo(

nivel="",
unidad="",
tema="",
tituloIngles="",
tituloEspanol="",
vocabulario=[],
introduccionGeneral="",
subtitulos=[],
ejerciciosSelSimple=[],
ejerciciosCompletar=[],
ejerciciosDragDrop=[],
ejerciciosOrdenarOracion=[],
ejerciciosEmparejarColumnas=[],
ejerciciosTraduccion=[],
ejerciciosTranscripcion=[],
ejercicioIdentificarImagenes=[],
estructurasGlobal={},
ejercicioCompletarTextoListening={},
ejerciciosOrdenarParrafos=[],
ejercicioComprensionTexto={},
ejercicioComprensionAuditiva={},
ejercicioSustitucionContextual={},
ejercicioMineria={},    
configuracionMostrar={}
){

        console.log(
        "MODELO 15 - MINERIA EN GENERADOR:",
        ejercicioMineria
    );
    
    Object.keys(localStorage)
    .forEach(key=>{

        if(key.startsWith("ucmi_resultado_")){

            localStorage.removeItem(key);

        }

    });

const prefijo = "ERG";

const codigoContenido =
`${prefijo}.${unidad}.${tema}.${nivel}`;

let rutaCSS = "";
let rutaJS = "";

if(modoExportacion === MODOS.LOCAL){

    rutaCSS = "css/";
    rutaJS = "js/";

}else{

    rutaCSS = "https://universitariodematematica-star.github.io/UCMI/css/";
    rutaJS = "https://universitariodematematica-star.github.io/UCMI/js/";

}    

const codigoEjerciciosResueltos =
`${prefijo}.${unidad}.${tema}.${nivel}`;

const codigoEjerciciosPropuestos =
`EPG.${unidad}.${tema}.${nivel}`;

const mostrarCompletarTextoListening =
configuracionMostrar["Completar texto listening"] || "No";    
    
const codigo = `<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ERG Constructor - UCMI</title>

<link rel="stylesheet" href="${rutaCSS}ucmi-estilos.css">

<link rel="stylesheet" href="${rutaCSS}pizarra.css">

<link rel="stylesheet" href="${rutaCSS}reproductor.css">

<style>


.audioUCMI{
margin-top:25px;
}

.opcion-radio{
display:block;
margin:8px 0;
font-size:1.1em;
cursor:pointer;
line-height:1.4;
}

.opcion-radio input{
transform:scale(1.35);
margin-right:14px;
cursor:pointer;
}

.verificar{
display:block;
margin:35px 0 0 0;
padding:14px 42px;
background:linear-gradient(to left,#6A1B9A,#3949AB);
color:white;
font-size:1.1em;
font-weight:bold;
border:none;
border-radius:14px;
cursor:pointer;
box-shadow:0 8px 18px rgba(0,0,0,.35);
transition:.25s;
}

.verificar:hover{
background:linear-gradient(to left,#7B1FA2,#3F51B5);
transform:translateY(-3px);
box-shadow:0 12px 22px rgba(0,0,0,.45);
}

.resultado{
margin-top:25px;
font-size:20px;
line-height:1.6;
}

.instruccion-ejercicio{
width:92%;
margin:0 auto 35px auto;
padding:18px 22px;
background:#eef6ff;
border-left:8px solid #3949AB;
border-radius:14px;
box-shadow:0 6px 14px rgba(0,0,0,.15);
font-size:1.2em;
line-height:1.6;
color:#071426;
font-weight:bold;
}

/*====================================================
        DRAG AND DROP
====================================================*/


.espacio-drop{
display:inline-block;
min-width:100px;
padding:8px 15px;
border:2px dashed #3949AB;
border-radius:10px;
background:#eef6ff;
text-align:center;
margin:0 8px;
font-weight:bold;
}

.boton-arrastrable{
width:auto;
margin:8px;
padding:10px 20px;
background:#FFD700;
border-radius:10px;
cursor:grab;
font-weight:bold;
}

.correcto-drag{
background:#c8f7c5;
border:2px solid green;
}

.zona-destino-oracion{
    width:90%;
    min-height:80px;
    margin:25px auto;
    padding:20px;
    border:3px dashed #071426;
    border-radius:20px;
    background:#f5f8ff;
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:center;
    justify-content:center;
    font-size:18px;
    color:#555;
    transition:.3s;
}

.palabra-arrastrable{
    background:#1565c0;
    color:white;
    border:none;
    padding:12px 20px;
    margin:5px;
    border-radius:15px;
    font-size:17px;
    font-weight:bold;
    cursor:grab;
    transition:.3s;
    box-shadow:0 5px 12px rgba(0,0,0,.2);
}


.palabra-arrastrable:hover{
    background:#ec407a;
    transform:translateY(-3px);
}


.palabra-arrastrable:active{
    cursor:grabbing;
}

.contenedor-relacionar{

display:flex;
justify-content:center;
gap:80px;
margin:40px auto;

}


.columna-relacionar{

width:300px;

}


.columna-relacionar h3{

text-align:center;
color:#071426;

}


.elemento-relacionar{

padding:15px;
margin:15px;

background:white;

color:#071426;

border-radius:15px;

text-align:center;

font-weight:bold;

box-shadow:0 5px 15px rgba(0,0,0,.2);

cursor:grab;

transition:.3s;

}


.elemento-relacionar:hover{

transform:translateY(-3px);

}


.derecha-relacionar{

border:3px dashed #3949AB;

}


.relacion-correcta{

background:#c8f7c5 !important;

border:3px solid green;

}


.relacion-incorrecta{

background:#ffcdd2 !important;

border:3px solid red;

}

.banco-palabras-oracion{
    width:90%;
    margin:30px auto;
    padding:20px;
    border-radius:20px;
    background:white;
    box-shadow:0 8px 20px rgba(0,0,0,.15);
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:10px;
}

.evaluar-ordenar{
    display:block;
    margin:25px auto;
    padding:14px 35px;
    border:none;
    border-radius:18px;
    background:linear-gradient(
        135deg,
        #283593,
        #5c6bc0
    );
    color:white;
    font-size:18px;
    font-weight:bold;
    cursor:pointer;
}

.evaluar-drag{
    display:block;
    margin:30px auto;
    padding:14px 40px;
    background:#3949AB;
    color:white;
    font-size:18px;
    font-weight:bold;
    border:none;
    border-radius:18px;
    cursor:pointer;
    box-shadow:0 8px 18px rgba(0,0,0,.35);
    transition:.25s;
}


.evaluar-drag:hover{
    background:#303F9F;
    transform:translateY(-3px);
    box-shadow:0 12px 25px rgba(0,0,0,.45);
}

.boton-reiniciar-ucmi{
    display:block;
    width:260px;
    margin:35px auto;
    padding:16px 30px;
    background:linear-gradient(
        135deg,
        #071426,
        #1b3a63
    );

    color:#FFD700;
    border:2px solid #FFD700;
    border-radius:18px;
    font-size:18px;
    font-weight:bold;
    letter-spacing:1px;
    cursor:pointer;
    box-shadow:
    0 8px 18px rgba(0,0,0,.35);
    transition:.3s ease;
}


.boton-reiniciar-ucmi:hover{
    transform:translateY(-4px);
    background:linear-gradient(
        135deg,
        #10294a,
        #071426
    );
    box-shadow:
    0 14px 25px rgba(0,0,0,.45);
}


.boton-reiniciar-ucmi:active{
    transform:scale(.96);
}

.tabla-comparacion-traduccion{

width:90%;
margin:20px auto;
border-collapse:collapse;
font-size:18px;

}


.tabla-comparacion-traduccion th{

background:#071426;
color:#FFD700;
padding:12px;
border:2px solid #ddd;

}


.tabla-comparacion-traduccion td{

padding:10px;
border:1px solid #ddd;
text-align:center;
font-weight:bold;

}


.correcto-comparacion{

background:#e8f5e9;
color:green;

}


.error-comparacion{

background:#ffebee;
color:red;

}

.tabla-comparacion-traduccion{

width:95%;
margin:20px auto;
border-collapse:collapse;
font-size:18px;

}


.tabla-comparacion-traduccion th{

background:#071426;
color:#FFD700;
padding:10px;

}


.tabla-comparacion-traduccion td{

border:1px solid #ccc;
padding:10px;
text-align:center;
font-weight:bold;

}


.comparacion-ok{

background:#c8f7c5;

}


.comparacion-error{

background:#ffcdd2;
color:#b71c1c;

}


.comparacion-correcta{

background:#c8f7c5;
color:green;

}

.tabla-comparacion-traduccion th {

    background-color: indigo;
    color: white;
    border: 1px solid #444;

}


.tabla-comparacion-traduccion th:first-child {

    border-top-left-radius: 12px;

}


.tabla-comparacion-traduccion th:last-child {

    border-top-right-radius: 12px;

}


.tabla-comparacion-traduccion {

    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;

}

</style>

</head>

<body data-codigo-contenido="${codigoContenido}">

<div id="navegacionUCMI" class="navegacion-ucmi">

<a 
class="boton-interactivo"
href="temario.html?nivel=${escaparHTML(nivel)}">
VOLVER AL TEMARIO
</a>


<a 
class="boton-interactivo"
href="listening.html?nivel=${escaparHTML(nivel)}&unidad=${escaparHTML(unidad)}&tema=${escaparHTML(tema)}">
SEGUIR A LISTENING
</a>


<a 
class="boton-interactivo"
href="skills.html?nivel=${escaparHTML(nivel)}&unidad=${escaparHTML(unidad)}&tema=${escaparHTML(tema)}">
VOLVER A SKILLS
</a>

</div>

<div id="ucmiEncabezado"></div>

<div id="contenidoUCMI">


<table class="barra-rosada">

<tr>

<td>

<p>
${escaparHTML(tituloEspanol)}
</p>

</td>

</tr>

</table>

<table class="barra-turquesa">
<tr>
<td>
<p>
Ejercicios resueltos ${codigoEjerciciosResueltos}
</p>
</td>
</tr>
</table>

<div style="height:25px;"></div>

<div style="height:20px;"></div>

<button 
class="boton-reiniciar-ucmi"
onclick="UCMIRestaurarEjercicios.reiniciar()">

↻ Reiniciar ejercicios

</button>


<div id="zona-ejercicios"></div>
<div style="height:35px;"></div>


</div>


</div>

<canvas id="drawingCanvas"></canvas>

<script src="${rutaJS}pizarra.js"><\/script>
<script src="${rutaJS}navegacion.js"><\/script>
<script src="${rutaJS}encabezado.js"><\/script>
<script src="${rutaJS}reproductor.js"><\/script>
<script src="${rutaJS}motor-ejercicios.js"><\/script>
<script src="${rutaJS}motor-estructuras.js"><\/script>
<script src="${rutaJS}motor-completar-listening.js"><\/script>
<script src="${rutaJS}motor-ordenar-parrafos.js"><\/script>
<script src="${rutaJS}motor-comprension-texto.js"><\/script>
<script src="${rutaJS}motor-comprension-auditiva.js"><\/script>
<script src="${rutaJS}motor-sustitucion-contextual.js"><\/script>
<script src="${rutaJS}motor-mineria.js"><\/script>

<script>


UCMIPizarra.iniciar();

UCMINavegacion.iniciar("grammar");

UCMIEncabezado.iniciar({
    titulo:"${escaparHTML(tituloIngles)}",
    skill:"Grammar"
});

const ejercicioCompletarTextoListening =
${JSON.stringify(ejercicioCompletarTextoListening)};

const ejercicioComprensionAuditiva =
${JSON.stringify(ejercicioComprensionAuditiva)};

const ejercicioSustitucionContextual =
${JSON.stringify(ejercicioSustitucionContextual)};

UCMIMotorEjercicios.generar({

    contenedor:"zona-ejercicios",

    seleccionSimple:
    ${JSON.stringify(ejerciciosSelSimple)},


    completarEspacios:
    ${JSON.stringify(ejerciciosCompletar)},


    dragDropBlanco:
    ${JSON.stringify(ejerciciosDragDrop)},


    ordenarOracion:
    ${JSON.stringify(ejerciciosOrdenarOracion)},

    emparejarColumnas:
    ${JSON.stringify(ejerciciosEmparejarColumnas)},

    traduccion:
    ${JSON.stringify(ejerciciosTraduccion)},
    
    transcripcion:
    ${JSON.stringify(ejerciciosTranscripcion)},
    
    identificarImagenes:
    ${JSON.stringify(ejercicioIdentificarImagenes)},
    
    estructuras:
    ${JSON.stringify(estructurasGlobal)},
    
    completarTextoListening:
    ${JSON.stringify(ejercicioCompletarTextoListening)},
    
    ordenarParrafos:
    ${JSON.stringify(ejerciciosOrdenarParrafos)},

mostrarSeleccionSimple:
"${configuracionMostrar["Selección simple"] || "No"}",

mostrarCompletar:
"${configuracionMostrar["Completar espacios"] || "No"}",

mostrarDragDrop:
"${configuracionMostrar["Drag and drop blanco"] || "No"}",

mostrarOrdenarOracion:
"${configuracionMostrar["Ordenar oración"] || "No"}",

mostrarRelacionar:
"${configuracionMostrar["Relacionar"] || "No"}",

mostrarTraduccion:
"${configuracionMostrar["Traducción"] || "No"}",

mostrarTranscripcion:
"${configuracionMostrar["Transcripción"] || "No"}",

mostrarIdentificarImagenes:
"${configuracionMostrar["Identificar imágenes"] || "No"}",

mostrarEstructuras:
"${configuracionMostrar["Estructuras"] || "No"}"

});


if(
    "${configuracionMostrar["Completar-texto-listening"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Completar-texto-listening"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorCompletarListening.generar({

        contenedor:"zona-ejercicios",

        completarTextoListening:
        ejercicioCompletarTextoListening

    });

}


if(
    "${configuracionMostrar["Ordenar párrafos"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Ordenar párrafos"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorOrdenarParrafos.generar({

        contenedor:"zona-ejercicios",

        ordenarParrafos:
        ${JSON.stringify(ejerciciosOrdenarParrafos)}

    });

}

if(
    "${configuracionMostrar["Comprensión de texto"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Comprensión de texto"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorComprensionTexto.generar({

        contenedor:"zona-ejercicios",

        comprensionTexto:
        ${JSON.stringify(ejercicioComprensionTexto)}

    });

}

if(
    "${configuracionMostrar["Comprensión auditiva"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Comprensión auditiva"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorComprensionAuditiva.generar({

        contenedor:"zona-ejercicios",

        comprensionAuditiva:
        ejercicioComprensionAuditiva

    });

}

if(
    "${configuracionMostrar["Sustitución contextual"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Sustitución contextual"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorSustitucionContextual.generar({

        contenedor:"zona-ejercicios",

        sustitucionContextual:
        ${JSON.stringify(ejercicioSustitucionContextual)}

    });

}


if(
    "${configuracionMostrar["Mineria"] || "No"}"
    .trim()
    .toLowerCase() === "sí"
    ||
    "${configuracionMostrar["Mineria"] || "No"}"
    .trim()
    .toLowerCase() === "si"
){

    UCMIMotorMineria.generar({

        contenedor:"zona-ejercicios",

        mineria:
        ${JSON.stringify(ejercicioMineria)}

    });

}

document.querySelectorAll(".audioUCMI").forEach(contenedor=>{

    const datos = contenedor.querySelector(".audio-data");

    if(datos){

        UCMIAudio.crear(contenedor,{

            titulo: datos.dataset.titulo,

            archivo: datos.dataset.audio

        });

    }

});

<\/script>

</body>

</html>`;

document.getElementById("codigo").textContent = codigo;  

document.getElementById("preview").srcdoc = "";
setTimeout(()=>{
    document.getElementById("preview").srcdoc = codigo;
},100);

}

window.generarCodigo = generarCodigo;

/*=====================================================
    GENERADOR HTML ERG
    Construye la página final de ejercicios resueltos
=====================================================*/
