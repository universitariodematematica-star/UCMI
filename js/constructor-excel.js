/*=====================================================
INICIO DEL GENERADOR DEL EXCEL
=====================================================*/
    
async function descargarPlantilla(){

    const libro = new ExcelJS.Workbook();

    const hojaDatos = libro.addWorksheet("Datos");
    const hojaSelSimple = libro.addWorksheet("Sel-simp-op");
    const hojaCompletar = libro.addWorksheet("Completar");
    const hojaDragDrop = libro.addWorksheet("Drag-drop-blanco");
    const hojaOrdenarOracion = libro.addWorksheet("Ordenar-oracion");
    const hojaRelacionar = libro.addWorksheet("Relacionar");
    const hojaTraduccion = libro.addWorksheet("Traducción");
    const hojaTranscripcion = libro.addWorksheet("Transcripción");
    const hojaIdentificarImagenes = libro.addWorksheet("Identificar-imagenes");
    const hojaMostrar = libro.addWorksheet("Mostrar");
    
    console.log("CREANDO HOJA MOSTRAR");


    /*=====================================================
HOJA IDENTIFICAR-IMAGENES
=====================================================*/

// CONFIGURACIÓN

hojaIdentificarImagenes.getCell("A1").value = "URL del audio";

hojaIdentificarImagenes.getCell("B1").value =
"audios/A1/Unidad_01/Tema_01/Grammar/AG.1.1.1.A1.mp3";


hojaIdentificarImagenes.getCell("C1").value =
"Código de blogger";

hojaIdentificarImagenes.getCell("C2").value =
"";
    
// TABLA

hojaIdentificarImagenes.getCell("A2").value = "Oración";
hojaIdentificarImagenes.getCell("B2").value = "Código de la imagen";

// EJEMPLOS

hojaIdentificarImagenes.getCell("A3").value =
"The dog is chasing the cat.";
hojaIdentificarImagenes.getCell("B3").value =
"A1-U1-T1-I01";

hojaIdentificarImagenes.getCell("A4").value =
"The girl is reading a book.";
hojaIdentificarImagenes.getCell("B4").value =
"A1-U1-T1-I02";

hojaIdentificarImagenes.getCell("A5").value =
"The boy is drinking water.";
hojaIdentificarImagenes.getCell("B5").value =
"A1-U1-T1-I03";
    // Encabezados en negrita

["A1","C1","A2","B2"].forEach(celda=>{

    hojaIdentificarImagenes.getCell(celda).font={

        bold:true

    };

});

// Ancho de columnas

hojaIdentificarImagenes.getColumn("A").width = 70;
hojaIdentificarImagenes.getColumn("B").width = 30;
hojaIdentificarImagenes.getColumn("C").width = 80;

    // ENCABEZADOS

    hojaDatos.getCell("A1").value = "Nivel";
    hojaDatos.getCell("B1").value = "Unidad";
    hojaDatos.getCell("C1").value = "Tema";
    hojaDatos.getCell("D1").value = "Título en inglés";
    hojaDatos.getCell("E1").value = "Título en español";


    // Ejemplo inicial

    hojaDatos.getCell("A2").value = "A1";
hojaDatos.getCell("B2").value = 1;
hojaDatos.getCell("C2").value = 1;
hojaDatos.getCell("D2").value = "Introduce yourself";
hojaDatos.getCell("E2").value = "Preséntate";


    // Ancho columnas

    hojaDatos.getColumn("A").width = 15;
    hojaDatos.getColumn("B").width = 15;
    hojaDatos.getColumn("C").width = 15;
    hojaDatos.getColumn("D").width = 35;
    hojaDatos.getColumn("E").width = 35;


    // Estilo encabezados

    for(let celda of ["A1","B1","C1","D1","E1"]){

    hojaDatos.getCell(celda).font = {
        bold:true
    };

}

  //=====================================================
// HOJA: Sel-simp-op
//=====================================================

hojaSelSimple.getCell("A1").value = "Pregunta";
hojaSelSimple.getCell("B1").value = "Respuesta correcta";
hojaSelSimple.getCell("C1").value = "Incorrecta 1";
hojaSelSimple.getCell("D1").value = "Incorrecta 2";
hojaSelSimple.getCell("E1").value = "Incorrecta 3";
hojaSelSimple.getCell("F1").value = "Explicación";

// Ejemplo

hojaSelSimple.getCell("A2").value =
"I ___ a student.";

hojaSelSimple.getCell("B2").value =
"am";

hojaSelSimple.getCell("C2").value =
"is";

hojaSelSimple.getCell("D2").value =
"are";

hojaSelSimple.getCell("E2").value =
"be";

hojaSelSimple.getCell("F2").value =
"Después del pronombre I siempre se utiliza am.";

// Anchos

hojaSelSimple.getColumn("A").width = 45;
hojaSelSimple.getColumn("B").width = 20;
hojaSelSimple.getColumn("C").width = 20;
hojaSelSimple.getColumn("D").width = 20;
hojaSelSimple.getColumn("E").width = 20;
hojaSelSimple.getColumn("F").width = 60;

// Encabezados en negrita

for(let celda of ["A1","B1","C1","D1","E1","F1"]){

    hojaSelSimple.getCell(celda).font = {
        bold:true
    };

}  

//=====================================================
// HOJA: Completar
//=====================================================

hojaCompletar.getCell("A1").value = "Pregunta";

hojaCompletar.getCell("B1").value = "Respuesta correcta";

hojaCompletar.getCell("C1").value = "Explicación";


// Ejemplo

hojaCompletar.getCell("A2").value =
"They ___ students.";


hojaCompletar.getCell("B2").value =
"are";


hojaCompletar.getCell("C2").value =
"Con el pronombre they se utiliza are.";


// Anchos

hojaCompletar.getColumn("A").width = 45;

hojaCompletar.getColumn("B").width = 25;

hojaCompletar.getColumn("C").width = 60;


// Encabezados en negrita

for(let celda of ["A1","B1","C1"]){

    hojaCompletar.getCell(celda).font = {
        bold:true
    };

}

    //=====================================================
// HOJA: Drag-drop-blanco
//=====================================================

hojaDragDrop.getCell("A1").value =
"Texto antes";

hojaDragDrop.getCell("B1").value =
"Respuesta correcta";

hojaDragDrop.getCell("C1").value =
"Opción 1";

hojaDragDrop.getCell("D1").value =
"Opción 2";

hojaDragDrop.getCell("E1").value =
"Opción 3";

hojaDragDrop.getCell("F1").value =
"Opción 4";

hojaDragDrop.getCell("G1").value =
"Texto después";

hojaDragDrop.getCell("H1").value =
"Explicación";


// Ejemplo

hojaDragDrop.getCell("A2").value =
"I ";

hojaDragDrop.getCell("B2").value =
"am";

hojaDragDrop.getCell("C2").value =
"is";

hojaDragDrop.getCell("D2").value =
"are";

hojaDragDrop.getCell("E2").value =
"be";

hojaDragDrop.getCell("F2").value =
"was";

hojaDragDrop.getCell("G2").value =
" a student.";

hojaDragDrop.getCell("H2").value =
"Con I se utiliza am.";

//=====================================================
// HOJA: Ordenar-oracion
//=====================================================

hojaOrdenarOracion.getCell("A1").value =
"Oración";


hojaOrdenarOracion.getCell("B1").value =
"Explicación";


hojaOrdenarOracion.getCell("A2").value =
"I am a student";


hojaOrdenarOracion.getCell("B2").value =
"El orden correcto es sujeto + verbo + complemento.";


hojaOrdenarOracion.getColumn("A").width = 50;

hojaOrdenarOracion.getColumn("B").width = 60;


for(let celda of ["A1","B1"]){

    hojaOrdenarOracion.getCell(celda).font={
        bold:true
    };

}    

//=====================================================
// HOJA: Relacionar
//=====================================================

hojaRelacionar.getCell("A1").value = "Izquierda";
hojaRelacionar.getCell("B1").value = "Derecha";
hojaRelacionar.getCell("C1").value = "Explicación";

// Ejemplo

hojaRelacionar.getCell("A2").value =
"Hello";

hojaRelacionar.getCell("B2").value =
"Hola";

hojaRelacionar.getCell("C2").value =
"Hello significa Hola.";

hojaRelacionar.getCell("A3").value =
"Good morning";

hojaRelacionar.getCell("B3").value =
"Buenos días";

hojaRelacionar.getCell("C3").value =
"Good morning se utiliza por la mañana.";

// Tamaño columnas

hojaRelacionar.getColumn("A").width = 40;
hojaRelacionar.getColumn("B").width = 40;
hojaRelacionar.getColumn("C").width = 60;

// Encabezados

for(let celda of ["A1","B1","C1"]){

    hojaRelacionar.getCell(celda).font = {
        bold:true
    };

}

//=====================================================
// HOJA: Traducción
//=====================================================

hojaTraduccion.getCell("A1").value =
"oracion";

hojaTraduccion.getCell("B1").value =
"respuesta";

hojaTraduccion.getCell("C1").value =
"respuesta2";

hojaTraduccion.getCell("D1").value =
"respuesta3";

hojaTraduccion.getCell("E1").value =
"respuesta4";

hojaTraduccion.getCell("F1").value =
"respuesta5";

hojaTraduccion.getCell("G1").value =
"explicacion";


// Ejemplo guía

hojaTraduccion.getCell("A2").value =
"Yo soy un estudiante.";

hojaTraduccion.getCell("B2").value =
"I am a student.";

hojaTraduccion.getCell("C2").value =
"I'm a student.";

hojaTraduccion.getCell("D2").value =
"";

hojaTraduccion.getCell("E2").value =
"";

hojaTraduccion.getCell("F2").value =
"";

hojaTraduccion.getCell("G2").value =
"Se aceptan la forma completa y la contracción cuando tienen el mismo significado.";


// Tamaño columnas

hojaTraduccion.getColumn("A").width = 45;
hojaTraduccion.getColumn("B").width = 35;
hojaTraduccion.getColumn("C").width = 35;
hojaTraduccion.getColumn("D").width = 35;
hojaTraduccion.getColumn("E").width = 35;
hojaTraduccion.getColumn("F").width = 35;
hojaTraduccion.getColumn("G").width = 60;


// Encabezados en negrita

for(let celda of [
"A1",
"B1",
"C1",
"D1",
"E1",
"F1",
"G1"
]){

    hojaTraduccion.getCell(celda).font={
        bold:true
    };

}    

//=====================================================
// HOJA: Transcripción
//=====================================================

hojaTranscripcion.getCell("A1").value =
"URL del audio";

hojaTranscripcion.getCell("B1").value =
"https://ejemplo.mp3";

hojaTranscripcion.getCell("B2").value =
"Hello. My name is John.";

hojaTranscripcion.getCell("B3").value =
"I am from Ecuador.";

hojaTranscripcion.getCell("B4").value =
"I study English every day.";    

for(let i=1;i<=50;i++){

    hojaTranscripcion.getCell(i+1,1).value =
    "Oración " + i;

}

hojaTranscripcion.getColumn("A").width = 25;
hojaTranscripcion.getColumn("B").width = 120;

hojaTranscripcion.getCell("A1").font = {
    bold:true
};

hojaTranscripcion.getCell("B1").font = {
    bold:true
};    

//=====================================================
// HOJA: Mostrar
//=====================================================

hojaMostrar.getCell("A1").value = "Tipo de ejercicio";
hojaMostrar.getCell("B1").value = "Mostrar";


hojaMostrar.getCell("A2").value =
"Selección simple";

hojaMostrar.getCell("B2").value =
"Sí";


hojaMostrar.getCell("A3").value =
"Completar espacios";

hojaMostrar.getCell("B3").value =
"No";

hojaMostrar.getCell("A4").value =
"Drag and drop blanco";

hojaMostrar.getCell("B4").value =
"Sí";

hojaMostrar.getCell("A5").value =
"Ordenar oración";

hojaMostrar.getCell("B5").value =
"Sí";

hojaMostrar.getCell("A6").value =
"Relacionar";

hojaMostrar.getCell("B6").value =
"Sí";

hojaMostrar.getCell("A7").value =
"Traducción";

hojaMostrar.getCell("B7").value =
"Sí";

hojaMostrar.getCell("A8").value =
"Transcripción";

hojaMostrar.getCell("B8").value =
"Sí";

hojaMostrar.getCell("A9").value =
"Identificar imágenes";

hojaMostrar.getCell("B9").value =
"Sí";    

// Lista desplegable Sí / No

for(let fila = 2; fila <= 9; fila++){

    hojaMostrar.getCell("B"+fila).dataValidation = {

        type: "list",

        allowBlank: false,

        formulae: [
            '"Sí,No"'
        ],

        showErrorMessage:true,

        errorTitle:"Valor incorrecto",

        error:
        "Seleccione Sí o No de la lista."

    };

}    



hojaMostrar.getColumn("A").width = 30;
hojaMostrar.getColumn("B").width = 20;



for(let celda of ["A1","B1"]){

    hojaMostrar.getCell(celda).font={
        bold:true
    };

}

    for(let celda of ["A1","B1"]){

    hojaMostrar.getCell(celda).font={
        bold:true
    };

}


// PRUEBA TEMPORAL

console.log(
    "HOJAS GENERADAS:",
    libro.worksheets.map(
        hoja => hoja.name
    )
);

console.log(
    "TOTAL HOJAS ANTES DE EXPORTAR:",
    libro.worksheets.map(h=>h.name)
);

    console.log(
    "NUMERO DE HOJAS:",
    libro.worksheets.length
);

libro.worksheets.forEach((h,i)=>{
    console.log(
        i,
        h.name,
        h.state
    );
});
    
    const archivo = await libro.xlsx.writeBuffer();


    const blob = new Blob(
        [archivo],
        {
            type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );


    const enlace = document.createElement("a");


    enlace.href =
    URL.createObjectURL(blob);


    enlace.download =
    "plantilla-ejercicios-ucmi.xlsx";


    enlace.click();

}

/*=====================================================
FIN DEL GENERADOR DEL EXCEL
=====================================================*/
