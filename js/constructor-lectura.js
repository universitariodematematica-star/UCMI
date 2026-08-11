/*=====================================================
INICIO - FUNCIONES AUXILIARES DE LECTURA
=====================================================*/    

function leerCelda(celda){

    let valor = celda.value;

    if (valor === null || valor === undefined){
        return "";
    }

    if (typeof valor !== "object"){
        return String(valor);
    }

    if ("result" in valor){
        if (valor.result === null || valor.result === undefined){
            return "";
        }
        return String(valor.result);
    }

    if (valor.richText){
        return valor.richText.map(x => x.text || "").join("");
    }

    if ("text" in valor){
        return String(valor.text || "");
    }

    if ("hyperlink" in valor){
        return String(valor.hyperlink || "");
    }

    if (valor instanceof Date){
        return valor.toISOString();
    }

    return "";
}

/*=====================================================
FIN - FUNCIONES AUXILIARES DE LECTURA
=====================================================*/    

let estructurasGlobal = [];


/*=====================================================
INICIO - LECTOR PRINCIPAL DEL EXCEL
=====================================================*/

async function leerExcel(event){

    const archivo = event.target.files[0];

    if(!archivo) return;


    const buffer = await archivo.arrayBuffer();


    const libro = new ExcelJS.Workbook();

    await libro.xlsx.load(buffer);

    let esperaImagenesBlogger = false;

  // Detectar si el ejercicio utiliza imágenes

const hojaImagenes =
libro.getWorksheet("Identificar-imagenes");


if (hojaImagenes){

    UCMIBlogger.ocultar();

}else{

    UCMIBlogger.ocultar();

}

    const hoja = libro.getWorksheet("Datos");
    const hojaSelSimple = libro.getWorksheet("Sel-simp-op");
    const hojaCompletar = libro.getWorksheet("Completar");
    const hojaMostrar = libro.getWorksheet("Mostrar");
    const hojaDragDrop = libro.getWorksheet("Drag-drop-blanco");
    const hojaOrdenarOracion = libro.getWorksheet("Ordenar-oracion");
    const hojaRelacionar = libro.getWorksheet("Relacionar");
    const hojaTraduccion = libro.getWorksheet("Traducción");
    const hojaTranscripcion = libro.getWorksheet("Transcripción");
    const hojaIdentificarImagenes = libro.getWorksheet("Identificar-imagenes");
    const hojaEstructuras = libro.getWorksheet("Estructuras");

if (hojaEstructuras) {

    console.log("EJECUTANDO LECTURA DE HOJA ESTRUCTURAS");

    let infoEstructural = [];
    let oracionesEstructuradas = [];

    //===========================================
    // LEER ESTRUCTURAS GRAMATICALES
    // Filas 2 a 5
    //===========================================

    for (let fila = 2; fila <= 5; fila++) {

        const tipoFila =
            leerCelda(
                hojaEstructuras.getCell("A" + fila)
            );

        if (!tipoFila) {
            continue;
        }

        let elementosFila = [];

        for (let col = 2; col <= 10; col++) {

            const letraColumna =
                String.fromCharCode(64 + col);

            const valorCelda =
                leerCelda(
                    hojaEstructuras.getCell(
                        letraColumna + fila
                    )
                );

            elementosFila.push(valorCelda);
        }

        infoEstructural.push({

            fila: fila,

            tipo: tipoFila,

            componentes: elementosFila

        });
    }


//===========================================
// LEER ORACIONES ESTRUCTURADAS
//
// Fila 7 = encabezado.
// Filas 8 a 19 = 12 oraciones.
//
// La columna A puede estar vacía en las
// filas segunda y tercera de cada estructura.
// Por eso NO se utiliza A para descartar
// una fila.
//===========================================

for (let fila = 8; fila <= 19; fila++) {

    let elementosFila = [];

    for (let col = 2; col <= 10; col++) {

        const letraColumna =
            String.fromCharCode(64 + col);

        const valorCelda =
            leerCelda(
                hojaEstructuras.getCell(
                    letraColumna + fila
                )
            );

        elementosFila.push(valorCelda);
    }

    // Solo conservar la fila si tiene
    // al menos un elemento real.
    const tieneElementos =
        elementosFila.some(
            elemento => elemento.trim() !== ""
        );

    if (!tieneElementos) {
        continue;
    }

    const tipoFila =
        leerCelda(
            hojaEstructuras.getCell("A" + fila)
        );

    oracionesEstructuradas.push({

        fila: fila,

        tipo: tipoFila,

        elementos: elementosFila

    });
}


    //===========================================
    // CONSTRUIR LAS TABLAS DE ESTRUCTURAS
    //===========================================

    let tablasEstructuras = [];

    infoEstructural.forEach(
        (estructura, indice) => {

            const componentes =
                estructura.componentes.filter(
                    componente =>
                        componente.trim() !== ""
                );


            // Las tres filas de oraciones
            // correspondientes a esta estructura

            const inicio =
                indice * 3;

            const oraciones =
                oracionesEstructuradas
                    .slice(
                        inicio,
                        inicio + 3
                    );


            tablasEstructuras.push({

                numero:
                    indice + 1,

                tipo:
                    estructura.tipo,

                encabezados:
                    componentes,

                oraciones:
                    oraciones.map(
                        oracion => {

                            return oracion.elementos
                                .slice(
                                    0,
                                    componentes.length
                                );

                        }
                    )

            });

        }
    );


    estructurasGlobal = {

        informacion:
            infoEstructural,

        oraciones:
            oracionesEstructuradas,

        tablas:
            tablasEstructuras

    };

    console.log(
    "========== VERIFICACIÓN ESTRUCTURAS =========="
);

console.log(
    "TOTAL ORACIONES LEÍDAS:",
    oracionesEstructuradas.length
);

oracionesEstructuradas.forEach(
    (oracion, indice) => {

        console.log(
            "ORACIÓN",
            indice + 1,
            "| FILA EXCEL:",
            oracion.fila,
            "| TIPO:",
            oracion.tipo,
            "| ELEMENTOS:",
            oracion.elementos
        );

    }
);

tablasEstructuras.forEach(
    tabla => {

        console.log(
            "TABLA",
            tabla.numero,
            "| ENCABEZADOS:",
            tabla.encabezados,
            "| ORACIONES:",
            tabla.oraciones.length,
            tabla.oraciones
        );

    }
);

console.log(
    "========== FIN VERIFICACIÓN ESTRUCTURAS =========="
);

}

const nivel =
leerCelda(hoja.getCell("A2"));

const unidad =
leerCelda(hoja.getCell("B2"));

const tema =
leerCelda(hoja.getCell("C2"));

const tituloIngles =
leerCelda(hoja.getCell("D2"));

const tituloEspanol =
leerCelda(hoja.getCell("E2"));
    
const introduccionGeneral = "";    
  

vocabularioGlobal = [];

subtitulosGlobal = [];    

for(let i=0;i<10;i++){

    let columna =
    8 + (i*2);


    let ingles =
    leerCelda(hoja.getCell(2,columna));
    
    let espanol =
    leerCelda(hoja.getCell(2,columna+1));;


    if (ingles && espanol) {

    const espanolCapitalizado = capitalizar(espanol);

    const prueba = capitalizar(espanol);

vocabularioGlobal.push({

    ingles: ingles,

    espanol: prueba,

    imagen:""

});

}

}
   
ejerciciosSelSimple = [];

for(let fila = 2; fila <= hojaSelSimple.rowCount; fila++){

    const pregunta =
    leerCelda(hojaSelSimple.getCell("A" + fila));


    if(!pregunta) continue;


    ejerciciosSelSimple.push({

        oracion: pregunta,

        correcta:
        leerCelda(hojaSelSimple.getCell("B" + fila)),

        incorrecta1:
        leerCelda(hojaSelSimple.getCell("C" + fila)),

        incorrecta2:
        leerCelda(hojaSelSimple.getCell("D" + fila)),

        incorrecta3:
        leerCelda(hojaSelSimple.getCell("E" + fila)),

        explicacion:
        leerCelda(hojaSelSimple.getCell("F" + fila))

    });

}

//===========================================
// Leer configuración de ejercicios a mostrar
//===========================================

configuracionMostrar = {};

for(let fila = 2; fila <= hojaMostrar.rowCount; fila++){

    const tipo =
    leerCelda(
        hojaMostrar.getCell("A"+fila)
    ).trim();


    const mostrar =
    leerCelda(
        hojaMostrar.getCell("B"+fila)
    ).trim();


    if(!tipo){
        continue;
    }


    configuracionMostrar[tipo] = mostrar;

}

  ejerciciosCompletar = [];

for(let fila = 2; fila <= hojaCompletar.rowCount; fila++){

    const pregunta =
    leerCelda(hojaCompletar.getCell("A" + fila));


    if(!pregunta) continue;


    ejerciciosCompletar.push({

        oracion: pregunta,

        respuesta:
        leerCelda(hojaCompletar.getCell("B" + fila)),

        explicacion:
        leerCelda(hojaCompletar.getCell("C" + fila))

    });

}

    //===========================================
// Leer ejercicios Drag and Drop - espacio en blanco
//===========================================

ejerciciosDragDrop = [];

for(let fila = 2; fila <= hojaDragDrop.rowCount; fila++){

    const pregunta =
    leerCelda(hojaDragDrop.getCell("A"+fila));


    if(!pregunta) continue;


    ejerciciosDragDrop.push({

    textoAntes:
    leerCelda(hojaDragDrop.getCell("A"+fila)),


    correcta:
leerCelda(hojaDragDrop.getCell("B"+fila)),

opciones:[
    leerCelda(hojaDragDrop.getCell("C"+fila)),
    leerCelda(hojaDragDrop.getCell("D"+fila)),
    leerCelda(hojaDragDrop.getCell("E"+fila)),
    leerCelda(hojaDragDrop.getCell("F"+fila))
],


    textoDespues:
    leerCelda(hojaDragDrop.getCell("G"+fila)),


    explicacion:
    leerCelda(hojaDragDrop.getCell("H"+fila)) 

});

}    

//===========================================
// Leer ejercicios Ordenar oración
//===========================================

ejerciciosOrdenarOracion = [];


for(let fila = 2; fila <= hojaOrdenarOracion.rowCount; fila++){

    const oracion =
    leerCelda(
        hojaOrdenarOracion.getCell("A"+fila)
    );


    if(!oracion) continue;


    ejerciciosOrdenarOracion.push({

        oracion: oracion,

        explicacion:
        leerCelda(
            hojaOrdenarOracion.getCell("B"+fila)
        )

    });

}

//===========================================
// Leer ejercicios Relacionar columnas
//===========================================

ejerciciosEmparejarColumnas = [];


for(let fila = 2; fila <= hojaRelacionar.rowCount; fila++){

    const izquierda =
    leerCelda(
        hojaRelacionar.getCell("A"+fila)
    );


    if(!izquierda) continue;


    ejerciciosEmparejarColumnas.push({

        izquierda: izquierda,

        derecha:
        leerCelda(
            hojaRelacionar.getCell("B"+fila)
        ),

        explicacion:
        leerCelda(
            hojaRelacionar.getCell("C"+fila)
        )

    });

}

//===========================================
// Leer ejercicios Traducción
//===========================================

ejerciciosTraduccion = [];


for(let fila = 2; fila <= hojaTraduccion.rowCount; fila++){

    const oracion =
    leerCelda(
        hojaTraduccion.getCell("A"+fila)
    );


    if(!oracion) continue;


ejerciciosTraduccion.push({

    oracion: oracion,

    respuesta:
    leerCelda(
        hojaTraduccion.getCell("B"+fila)
    ),

    respuestasAlternativas:[

        leerCelda(
            hojaTraduccion.getCell("C"+fila)
        ),

        leerCelda(
            hojaTraduccion.getCell("D"+fila)
        ),

        leerCelda(
            hojaTraduccion.getCell("E"+fila)
        ),

        leerCelda(
            hojaTraduccion.getCell("F"+fila)
        )

    ].filter(
        respuesta => respuesta !== ""
    ),

    explicacion:
    leerCelda(
        hojaTraduccion.getCell("G"+fila)
    )

});

}

/*=====================================================
TRANSCRIPCIÓN
=====================================================*/

let audioTranscripcion = "";

if(hojaTranscripcion){

    audioTranscripcion =
    leerCelda(
        hojaTranscripcion.getCell("B1")
    );

}

let oracionesTranscripcion = [];

if(hojaTranscripcion){

    for(let fila=2;fila<=51;fila++){

        let texto =
        leerCelda(
            hojaTranscripcion.getCell(fila,2)
        );

        if(texto){

            oracionesTranscripcion.push(texto);

        }

    }

}

ejerciciosTranscripcion = [];

if(audioTranscripcion || oracionesTranscripcion.length){

ejerciciosTranscripcion = {

    audio: audioTranscripcion,

    oraciones: oracionesTranscripcion

};

}

/*=====================================================
IDENTIFICAR IMÁGENES
=====================================================*/

ejercicioIdentificarImagenes = {

    audio: "",

    imagenes: []

};
    
if (hojaIdentificarImagenes) {

    ejercicioIdentificarImagenes.audio =
    leerCelda(
        hojaIdentificarImagenes.getCell("B1")
    );

const codigoBloggerExcel =
leerCelda(
    hojaIdentificarImagenes.getCell("C2")
);    

UCMIBlogger.extraerImagenes(
    codigoBloggerExcel
);    

for (
let fila = 3;
fila <= hojaIdentificarImagenes.rowCount;
fila++
){


        const oracion =
        leerCelda(
            hojaIdentificarImagenes.getCell("A" + fila)
        );

        const codigo =
        leerCelda(
            hojaIdentificarImagenes.getCell("B" + fila)
        );

        if (!oracion.trim()) continue;

        // Buscar la URL correspondiente
        const url =
ejercicioIdentificarImagenes.imagenes.push({

    codigo: codigo,

    oracion: oracion,

    url: ""

});

    }

    // Asociar URLs Blogger con códigos Excel

ejercicioIdentificarImagenes.imagenes.forEach(imagen=>{

    const encontrada =
    UCMIBlogger.imagenes.find(
        url => url.includes(imagen.codigo)
    );


    if(encontrada){

        imagen.url = encontrada;

    }

});

window.actualizarImagenesIdentificar = function(){

    ejercicioIdentificarImagenes.imagenes.forEach(imagen=>{

        const encontrada =
        UCMIBlogger.imagenes.find(
            url=>url.includes(imagen.codigo)
        );


        if(encontrada){

            imagen.url = encontrada;

        }

    });

    lanzarGeneracion();

};
}

    datosPagina = {

nivel:nivel,

unidad:unidad,

tema:tema,

tituloIngles:tituloIngles,

tituloEspanol:tituloEspanol

};

if(
    hojaIdentificarImagenes
){

}else{

    lanzarGeneracion();

}

if(!esperaImagenesBlogger){

    lanzarGeneracion();

}

function lanzarGeneracion(){

    generarCodigo(   // ← VIENE DE: js/generador-html-erg.js
        datosPagina.nivel,
        datosPagina.unidad,
        datosPagina.tema,
        datosPagina.tituloIngles,
        datosPagina.tituloEspanol,
        [],
        "",
        [],
        ejerciciosSelSimple,
        ejerciciosCompletar,
        ejerciciosDragDrop,
        ejerciciosOrdenarOracion,
        ejerciciosEmparejarColumnas,
        ejerciciosTraduccion,
        ejerciciosTranscripcion,
        ejercicioIdentificarImagenes,
        estructurasGlobal,
        configuracionMostrar
    );

}

}     

//generarCodigo();

/*=====================================================
FIN - LECTOR PRINCIPAL DEL EXCEL
=====================================================*/

/*=====================================================
INICIO - EVENTOS DEL CONSTRUCTOR
=====================================================*/

document.addEventListener(
"DOMContentLoaded",
function(){

    const inputExcel = document.getElementById("excelInput");

    console.log(
        "INPUT EXCEL:",
        inputExcel
    );

    if(!inputExcel){
        console.error(
            "NO EXISTE #excelInput"
        );
        return;
    }

    inputExcel.addEventListener(
        "change",
        leerExcel
    );

});


/*=====================================================
FIN - EVENTOS DEL CONSTRUCTOR
=====================================================*/
