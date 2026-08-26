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
const hojaEstructuras = libro.addWorksheet("Estructuras");
const hojaCompletarTextoListening = libro.addWorksheet("Completar-texto-listening");
const hojaOrdenarParrafos = libro.addWorksheet("ordenar-parrafos");
const hojaComprensionTexto = libro.addWorksheet("Comprension-texto");
const hojaComprensionAuditiva = libro.addWorksheet("Comprension-auditiva");
const hojaSustitucionContextual = libro.addWorksheet("Sustitucion-contextual");
const hojaMineria = libro.addWorksheet("Mineria");
const hojaEscrituraGuiada = libro.addWorksheet("Escritura-guiada");    
const hojaMostrar = libro.addWorksheet("Mostrar");

//=====================================================
// HOJA: Comprension-auditiva
//=====================================================

//-----------------------------------------------------
// RUTA DEL AUDIO
//-----------------------------------------------------

hojaComprensionAuditiva.getCell("A1").value =
    "Ruta del audio";

hojaComprensionAuditiva.getCell("A2").value =
    "audios/A1/Unidad_01/Tema_01/Grammar/AG.1.1.1.A1.mp3";


//-----------------------------------------------------
// TÍTULO
//-----------------------------------------------------

hojaComprensionAuditiva.getCell("A4").value =
    "Título";

hojaComprensionAuditiva.getCell("A5").value =
    "Nombre del título";


//-----------------------------------------------------
// PREGUNTAS Y OPCIONES
//-----------------------------------------------------

for(let n = 1; n <= 10; n++){

    const filaInicio =
        6 * (n - 1) + 7;


    //-------------------------------------------------
    // PREGUNTA
    //-------------------------------------------------

    hojaComprensionAuditiva.getCell(
        filaInicio,
        3
    ).value =
        "Pregunta " + n;


    //-------------------------------------------------
    // ENUNCIADO DE LA PREGUNTA
    //-------------------------------------------------

    hojaComprensionAuditiva.getCell(
        filaInicio,
        4
    ).value =
        n === 1
        ? "Enunciado primera pregunta"
        : "";


    //-------------------------------------------------
    // OPCIÓN CORRECTA
    //-------------------------------------------------

    hojaComprensionAuditiva.getCell(
        filaInicio + 1,
        3
    ).value =
        "Opción correcta";

    hojaComprensionAuditiva.getCell(
        filaInicio + 1,
        4
    ).value =
        n === 1
        ? "Enunciado opción correcta"
        : "";


    //-------------------------------------------------
    // OPCIONES FALSAS
    //-------------------------------------------------

    for(let i = 2; i <= 4; i++){

        hojaComprensionAuditiva.getCell(
            filaInicio + i,
            3
        ).value =
            "Opción falsa";


        hojaComprensionAuditiva.getCell(
            filaInicio + i,
            4
        ).value =
            n === 1
            ? "Enunciado opción falsa"
            : "";

    }

}


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaComprensionAuditiva.getColumn("A").width = 25;

hojaComprensionAuditiva.getColumn("B").width = 5;

hojaComprensionAuditiva.getColumn("C").width = 25;

hojaComprensionAuditiva.getColumn("D").width = 80;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for(let celda of ["A1","A4"]){

    hojaComprensionAuditiva.getCell(celda).font = {
        bold:true
    };

}


for(let n = 1; n <= 10; n++){

    const filaInicio =
        6 * (n - 1) + 7;


    hojaComprensionAuditiva.getCell(
        filaInicio,
        3
    ).font = {
        bold:true
    };

}    

//=====================================================
// HOJA: Comprension-texto
//=====================================================

//-----------------------------------------------------
// TEXTO
//-----------------------------------------------------

hojaComprensionTexto.getCell("A1").value =
    "Texto";


//-----------------------------------------------------
// PÁRRAFOS
//-----------------------------------------------------

for(let fila = 2; fila <= 11; fila++){

    hojaComprensionTexto.getCell(fila, 1).value =
        "Párrafo " + (fila - 1);

}


//-----------------------------------------------------
// TÍTULO
//-----------------------------------------------------

hojaComprensionTexto.getCell("A13").value =
    "Título";

hojaComprensionTexto.getCell("A14").value =
    "Nombre del título";


//-----------------------------------------------------
// PREGUNTAS Y OPCIONES
//-----------------------------------------------------

for(let n = 1; n <= 10; n++){

    const filaInicio =
        6 * (n - 1) + 1;


    //-------------------------------------------------
    // PREGUNTA
    //-------------------------------------------------

    hojaComprensionTexto.getCell(
        filaInicio,
        3
    ).value =
        "Pregunta " + n;


    //-------------------------------------------------
    // ENUNCIADO DE LA PREGUNTA
    //-------------------------------------------------

    hojaComprensionTexto.getCell(
        filaInicio,
        4
    ).value =
        n === 1
        ? "Enunciado primera pregunta"
        : "";


    //-------------------------------------------------
    // OPCIÓN CORRECTA
    //-------------------------------------------------

    hojaComprensionTexto.getCell(
        filaInicio + 1,
        3
    ).value =
        "Opción correcta";

    hojaComprensionTexto.getCell(
        filaInicio + 1,
        4
    ).value =
        n === 1
        ? "Enunciado opción correcta"
        : "";


    //-------------------------------------------------
    // OPCIONES FALSAS
    //-------------------------------------------------

    for(let i = 2; i <= 4; i++){

        hojaComprensionTexto.getCell(
            filaInicio + i,
            3
        ).value =
            "Opción falsa";


        hojaComprensionTexto.getCell(
            filaInicio + i,
            4
        ).value =
            n === 1
            ? "Enunciado opción falsa"
            : "";

    }

}


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaComprensionTexto.getColumn("A").width = 100;

hojaComprensionTexto.getColumn("B").width = 5;

hojaComprensionTexto.getColumn("C").width = 25;

hojaComprensionTexto.getColumn("D").width = 80;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

hojaComprensionTexto.getCell("A1").font = {
    bold:true
};

hojaComprensionTexto.getCell("A13").font = {
    bold:true
};


for(let n = 1; n <= 10; n++){

    const filaInicio =
        6 * (n - 1) + 1;


    hojaComprensionTexto.getCell(
        filaInicio,
        3
    ).font = {
        bold:true
    };

}    

    //=====================================================
// HOJA: ordenar-parrafos
//=====================================================

//-----------------------------------------------------
// ENCABEZADOS
//-----------------------------------------------------

hojaOrdenarParrafos.getCell("A1").value =
    "Orden correcto";

hojaOrdenarParrafos.getCell("B1").value =
    "Párrafo correspondiente al orden";


//-----------------------------------------------------
// EJEMPLO
//-----------------------------------------------------

hojaOrdenarParrafos.getCell("A2").value =
    1;

hojaOrdenarParrafos.getCell("B2").value =
    "Este es el primer párrafo del texto.";


hojaOrdenarParrafos.getCell("A3").value =
    2;

hojaOrdenarParrafos.getCell("B3").value =
    "Este es el segundo párrafo del texto.";


hojaOrdenarParrafos.getCell("A4").value =
    3;

hojaOrdenarParrafos.getCell("B4").value =
    "Este es el tercer párrafo del texto.";


//-----------------------------------------------------
// FILA DE ORIENTACIÓN
//-----------------------------------------------------

hojaOrdenarParrafos.getCell("A5").value =
    "Puedes colocar más números";

hojaOrdenarParrafos.getCell("B5").value =
    "Puedes colocar más párrafos";


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaOrdenarParrafos.getColumn("A").width = 22;

hojaOrdenarParrafos.getColumn("B").width = 100;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for(let celda of ["A1","B1"]){

    hojaOrdenarParrafos.getCell(celda).font = {
        bold:true
    };

}


//-----------------------------------------------------
// ORIENTACIÓN EN GRIS
//-----------------------------------------------------

hojaOrdenarParrafos.getCell("A5").font = {
    color:{
        argb:"FF808080"
    }
};

hojaOrdenarParrafos.getCell("B5").font = {
    color:{
        argb:"FF808080"
    }
};

    //=====================================================
// HOJA: Mineria
//=====================================================

//-----------------------------------------------------
// ENCABEZADOS
//-----------------------------------------------------

hojaMineria.getCell("A1").value =
    "N°";

hojaMineria.getCell("B1").value =
    "Estructura";


//-----------------------------------------------------
// NÚMEROS
//-----------------------------------------------------

for(let fila = 2; fila <= 11; fila++){

    hojaMineria.getCell(fila, 1).value =
        fila - 1;

}


//-----------------------------------------------------
// ESTRUCTURAS DE EJEMPLO
//-----------------------------------------------------

hojaMineria.getCell("B2").value =
    "Sujeto + will + forma base + complemento";

hojaMineria.getCell("B3").value =
    "Estructura 2";

hojaMineria.getCell("B4").value =
    "Estructura 3";


//-----------------------------------------------------
// B5:B11 PERMANECEN VACÍAS
//-----------------------------------------------------


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaMineria.getColumn("A").width = 10;

hojaMineria.getColumn("B").width = 60;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for(let celda of ["A1","B1"]){

    hojaMineria.getCell(celda).font = {
        bold:true
    };

}
   
    console.log("CREANDO HOJA MOSTRAR");
    console.log("CREANDO HOJA ESTRUCTURAS");
    console.log("CREANDO HOJA SUSTITUCION-CONTEXTUAL");

    //=====================================================
// HOJA: Completar-texto-listening
//=====================================================

//-----------------------------------------------------
// CONFIGURACIÓN GENERAL
//-----------------------------------------------------

hojaCompletarTextoListening.getCell("A1").value =
    "ruta audio";

hojaCompletarTextoListening.getCell("B1").value =
    "audios/A1/Unidad_01/Tema_01/Grammar/AG.1.1.1.A1.mp3";

hojaCompletarTextoListening.getCell("A3").value =
    "texto";

hojaCompletarTextoListening.getCell("D3").value =
    "faltantes";


//-----------------------------------------------------
// URL DEL AUDIO
//-----------------------------------------------------

hojaCompletarTextoListening.getCell("B1").font = {
    color: {
        argb: "FF808080"
    }
};


//-----------------------------------------------------
// PÁRRAFOS
//-----------------------------------------------------

for (let fila = 3; fila <= 32; fila++) {

    hojaCompletarTextoListening.getCell(fila, 2).value =
        "PÁRRAFO " + (fila - 2);

    hojaCompletarTextoListening.getCell(fila, 2).font = {
        color: {
            argb: "FF808080"
        }
    };

}


//-----------------------------------------------------
// BORDES B1:B32
//-----------------------------------------------------

for (let fila = 1; fila <= 32; fila++) {

    hojaCompletarTextoListening.getCell(fila, 2).border = {
        top: {
            style: "thin"
        },
        left: {
            style: "thin"
        },
        bottom: {
            style: "thin"
        },
        right: {
            style: "thin"
        }
    };

}


//-----------------------------------------------------
// NÚMERO DE PÁRRAFO
//-----------------------------------------------------

hojaCompletarTextoListening.getCell("E2").value =
    "número párrafo";

hojaCompletarTextoListening.getCell("E2").note = {
    texts: [
        {
            text: "Los números debajo tienen que ser números enteros."
        }
    ]
};


//-----------------------------------------------------
// BORDES E3:E32
//-----------------------------------------------------

for (let fila = 3; fila <= 32; fila++) {

    hojaCompletarTextoListening.getCell(fila, 5).border = {
        top: {
            style: "thin"
        },
        left: {
            style: "thin"
        },
        bottom: {
            style: "thin"
        },
        right: {
            style: "thin"
        }
    };

}


//-----------------------------------------------------
// PALABRAS FALTANTES
//-----------------------------------------------------

for (let columna = 6; columna <= 15; columna++) {

    hojaCompletarTextoListening.getCell(2, columna).value =
        "palabra " + (columna - 5);

}

//-----------------------------------------------------
// EJEMPLO DE NÚMEROS DE PALABRAS FALTANTES
//-----------------------------------------------------

hojaCompletarTextoListening.getCell("F3").value = 1;
hojaCompletarTextoListening.getCell("G3").value = 2;
hojaCompletarTextoListening.getCell("H3").value = 3;    


//-----------------------------------------------------
// COMENTARIO EN F2
//-----------------------------------------------------

hojaCompletarTextoListening.getCell("F2").note = {
    texts: [
        {
            text:
            "Palabra 1, palabra 2, palabra 3, tienen que ser números enteros positivos."
        }
    ]
};


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaCompletarTextoListening.getColumn("A").width = 20;
hojaCompletarTextoListening.getColumn("B").width = 50;
hojaCompletarTextoListening.getColumn("C").width = 5;
hojaCompletarTextoListening.getColumn("D").width = 15;
hojaCompletarTextoListening.getColumn("E").width = 18;

for (let columna of [
    "F","G","H","I","J",
    "K","L","M","N","O"
]) {

    hojaCompletarTextoListening.getColumn(columna).width = 14;

}


//-----------------------------------------------------
// ENCABEZADOS
//-----------------------------------------------------

for (let celda of [
    "A1",
    "A3",
    "D3",
    "E2",
    "F2",
    "G2",
    "H2",
    "I2",
    "J2",
    "K2",
    "L2",
    "M2",
    "N2",
    "O2"
]) {

    hojaCompletarTextoListening.getCell(celda).font = {
        bold: true
    };

}


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
// HOJA: Sustitucion-contextual
//=====================================================

//-----------------------------------------------------
// ENCABEZADOS SUPERIORES
//-----------------------------------------------------

hojaSustitucionContextual.getCell("A1").value =
    "Título";

hojaSustitucionContextual.getCell("B1").value =
    "Nombre";

hojaSustitucionContextual.mergeCells("E1:F1");

hojaSustitucionContextual.getCell("E1").value =
    "Elementos sustituibles";

hojaSustitucionContextual.getCell("G1").value =
    "Frase correcta";

hojaSustitucionContextual.getCell("H1").value =
    "Frase falsa 1";

hojaSustitucionContextual.getCell("I1").value =
    "Frase falsa 2";

hojaSustitucionContextual.getCell("J1").value =
    "Frase falsa 3";


//-----------------------------------------------------
// SEGUNDA FILA
//-----------------------------------------------------

hojaSustitucionContextual.getCell("D2").value =
    "Inicio";

hojaSustitucionContextual.getCell("E2").value =
    "Fin";

hojaSustitucionContextual.getCell("K2").value =
    "Justificación contextual";


//-----------------------------------------------------
// PÁRRAFOS
//-----------------------------------------------------

for(let fila = 3; fila <= 12; fila++){

    hojaSustitucionContextual.getCell(
        fila,
        3
    ).value =
        "Párrafo " + (fila - 2);

}


//-----------------------------------------------------
// EJEMPLO DEL PRIMER PÁRRAFO
//-----------------------------------------------------

hojaSustitucionContextual.getCell("D3").value =
    "She went to the supermarket because she needed some food for dinner.";

hojaSustitucionContextual.getCell("E3").value =
    5;

hojaSustitucionContextual.getCell("F3").value =
    10;

hojaSustitucionContextual.getCell("G3").value =
    "supermarket because she needed some food";

hojaSustitucionContextual.getCell("H3").value =
    "supermarket because she wanted something to eat";

hojaSustitucionContextual.getCell("I3").value =
    "park because she wanted to relax";

hojaSustitucionContextual.getCell("J3").value =
    "restaurant because she had already eaten";

hojaSustitucionContextual.getCell("K3").value =
    "La frase correcta puede sustituir al segmento original porque mantiene la idea esencial del contexto.";

//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaSustitucionContextual.getColumn("A").width = 20;
hojaSustitucionContextual.getColumn("B").width = 25;
hojaSustitucionContextual.getColumn("C").width = 18;
hojaSustitucionContextual.getColumn("D").width = 70;
hojaSustitucionContextual.getColumn("E").width = 12;
hojaSustitucionContextual.getColumn("F").width = 12;
hojaSustitucionContextual.getColumn("G").width = 45;
hojaSustitucionContextual.getColumn("H").width = 45;
hojaSustitucionContextual.getColumn("I").width = 45;
hojaSustitucionContextual.getColumn("J").width = 45;
hojaSustitucionContextual.getColumn("K").width = 60;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for(let celda of [
    "A1",
    "B1",
    "E1",
    "G1",
    "H1",
    "I1",
    "J1",
    "D2",
    "E2",
    "K2"
]){

    hojaSustitucionContextual.getCell(celda).font = {
        bold:true
    };

}


//-----------------------------------------------------
// ALINEACIÓN DE E1:F1
//-----------------------------------------------------

hojaSustitucionContextual.getCell("E1").alignment = {
    horizontal: "center",
    vertical: "middle"
};


//-----------------------------------------------------
// BORDE DE B1
//-----------------------------------------------------

hojaSustitucionContextual.getCell("B1").border = {
    top: {
        style: "thin"
    },
    left: {
        style: "thin"
    },
    bottom: {
        style: "thin"
    },
    right: {
        style: "thin"
    }
};


//-----------------------------------------------------
// TODOS LOS BORDES C3:K12
//-----------------------------------------------------

for(let fila = 3; fila <= 12; fila++){

    for(let columna = 3; columna <= 11; columna++){

        hojaSustitucionContextual.getCell(
            fila,
            columna
        ).border = {
            top: {
                style: "thin"
            },
            left: {
                style: "thin"
            },
            bottom: {
                style: "thin"
            },
            right: {
                style: "thin"
            }
        };

    }

}


//-----------------------------------------------------
// PÁRRAFOS EN NEGRITA
//-----------------------------------------------------

for(let fila = 3; fila <= 12; fila++){

    hojaSustitucionContextual.getCell(
        fila,
        3
    ).font = {
        bold:true
    };

}

//=====================================================
// HOJA: Escritura-guiada
//=====================================================

//-----------------------------------------------------
// ENCABEZADOS
//-----------------------------------------------------

hojaEscrituraGuiada.getCell("A1").value =
    "N°";

hojaEscrituraGuiada.getCell("B1").value =
    "Palabra";


//-----------------------------------------------------
// NÚMEROS
//-----------------------------------------------------

for(let fila = 2; fila <= 6; fila++){

    hojaEscrituraGuiada.getCell(fila, 1).value =
        fila - 1;

}


//-----------------------------------------------------
// PALABRAS DE EJEMPLO
//-----------------------------------------------------

for(let fila = 2; fila <= 6; fila++){

    hojaEscrituraGuiada.getCell(fila, 2).value =
        "Palabra " + (fila - 1);

}


//-----------------------------------------------------
// CONTINUACIÓN
//-----------------------------------------------------

hojaEscrituraGuiada.getCell("A7").value =
    "...";

hojaEscrituraGuiada.getCell("B7").value =
    "...";


//-----------------------------------------------------
// COMENTARIO EN A2
//-----------------------------------------------------

hojaEscrituraGuiada.getCell("A2").note = {
    texts: [
        {
            text:
                "Si quieres escribir más palabras, continúa la numeración hasta la cantidad de palabras que quieres que aparezcan en el texto."
        }
    ]
};


//-----------------------------------------------------
// COMENTARIO EN B2
//-----------------------------------------------------

hojaEscrituraGuiada.getCell("B2").note = {
    texts: [
        {
            text:
                "Escribe aquí las palabras que quieres que el estudiante utilice en su escrito."
        }
    ]
};


//-----------------------------------------------------
// ANCHOS DE COLUMNAS
//-----------------------------------------------------

hojaEscrituraGuiada.getColumn("A").width = 10;

hojaEscrituraGuiada.getColumn("B").width = 40;


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for(let celda of ["A1","B1"]){

    hojaEscrituraGuiada.getCell(celda).font = {
        bold:true
    };

}    


//=====================================================
// HOJA: Mostrar
//=====================================================

hojaMostrar.getCell("A1").value = "Tipo de ejercicio";
hojaMostrar.getCell("B1").value = "Mostrar";

hojaMostrar.getCell("C1").value =
    "Número mínimo de palabras";

hojaMostrar.getCell("C2").value =
    1;

hojaMostrar.getCell("C2").border = {
    top: {
        style: "thin"
    },
    left: {
        style: "thin"
    },
    bottom: {
        style: "thin"
    },
    right: {
        style: "thin"
    }
};    


hojaMostrar.getCell("A2").value =
"Selección simple";

hojaMostrar.getCell("B2").value =
"Sí";


hojaMostrar.getCell("A3").value =
"Completar espacios";

hojaMostrar.getCell("B3").value =
"Sí";

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

hojaMostrar.getCell("A10").value =
"Estructuras";

hojaMostrar.getCell("B10").value =
"Sí";

hojaMostrar.getCell("A11").value =
"Completar-texto-listening";

hojaMostrar.getCell("B11").value =
"Sí";


hojaMostrar.getCell("A12").value =
"Ordenar párrafos";

hojaMostrar.getCell("B12").value =
"Sí";

hojaMostrar.getCell("A13").value =
"Comprensión de texto";

hojaMostrar.getCell("B13").value =
"Sí";

hojaMostrar.getCell("A14").value =
"Comprensión auditiva";

hojaMostrar.getCell("B14").value =
"Sí";


hojaMostrar.getCell("A15").value =
"Sustitución contextual";

hojaMostrar.getCell("B15").value =
"Sí";


hojaMostrar.getCell("A16").value =
"Mineria";

hojaMostrar.getCell("B16").value =
"Sí";

hojaMostrar.getCell("A17").value =
"Escritura guiada";

hojaMostrar.getCell("B17").value =
"Sí";    


// Lista desplegable Sí / No

for(let fila = 2; fila <= 17; fila++){
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

//=====================================================
// HOJA: Estructuras
//=====================================================

//-----------------------------------------------------
// FILA 1 — INFORMACIÓN ESTRUCTURAL
//-----------------------------------------------------

hojaEstructuras.getCell("A1").value =
    "Información estructural";

hojaEstructuras.getCell("B1").value = "E1";
hojaEstructuras.getCell("C1").value = "E2";
hojaEstructuras.getCell("D1").value = "E3";
hojaEstructuras.getCell("E1").value = "E4";
hojaEstructuras.getCell("F1").value = "E5";
hojaEstructuras.getCell("G1").value = "E6";
hojaEstructuras.getCell("H1").value = "E7";
hojaEstructuras.getCell("I1").value = "E8";
hojaEstructuras.getCell("J1").value = "E9";


//-----------------------------------------------------
// FILA 2 — ESTRUCTURA 1
//-----------------------------------------------------

hojaEstructuras.getCell("A2").value =
    "Estructura 1";

hojaEstructuras.getCell("B2").value =
    "Sujeto";

hojaEstructuras.getCell("C2").value =
    "Verbo";

hojaEstructuras.getCell("D2").value =
    "Complemento";


// E4-E9 permanecen vacías


//-----------------------------------------------------
// FILA 3 — ESTRUCTURA 2
//-----------------------------------------------------

hojaEstructuras.getCell("A3").value =
    "Estructura 2";

hojaEstructuras.getCell("B3").value =
    "Sujeto";

hojaEstructuras.getCell("C3").value =
    "will";

hojaEstructuras.getCell("D3").value =
    "Base";

hojaEstructuras.getCell("E3").value =
    "Complemento";


// E5-E9 permanecen vacías


//-----------------------------------------------------
// FILA 4 — ESTRUCTURA 3
//-----------------------------------------------------

hojaEstructuras.getCell("A4").value =
    "Estructura 3";

hojaEstructuras.getCell("B4").value =
    "Sujeto";

hojaEstructuras.getCell("C4").value =
    "have/has";

hojaEstructuras.getCell("D4").value =
    "been";

hojaEstructuras.getCell("E4").value =
    "ing";

hojaEstructuras.getCell("F4").value =
    "Complemento";


// E6-E9 permanecen vacías


//-----------------------------------------------------
// FILA 5 — ESTRUCTURA 4
//-----------------------------------------------------

hojaEstructuras.getCell("A5").value =
    "Estructura 4";

hojaEstructuras.getCell("B5").value =
    "Sujeto";

hojaEstructuras.getCell("C5").value =
    "will";

hojaEstructuras.getCell("D5").value =
    "have/has";

hojaEstructuras.getCell("E5").value =
    "been";

hojaEstructuras.getCell("F5").value =
    "ing";

hojaEstructuras.getCell("G5").value =
    "Complemento";


// E7-E9 permanecen vacías


//-----------------------------------------------------
// FILA 6 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A6:J6 permanece completamente vacía.


//-----------------------------------------------------
// FILA 7 — ORACIONES ESTRUCTURADAS
//-----------------------------------------------------

hojaEstructuras.getCell("A7").value =
    "Oraciones estructuradas";

hojaEstructuras.getCell("B7").value = "E1";
hojaEstructuras.getCell("C7").value = "E2";
hojaEstructuras.getCell("D7").value = "E3";
hojaEstructuras.getCell("E7").value = "E4";
hojaEstructuras.getCell("F7").value = "E5";
hojaEstructuras.getCell("G7").value = "E6";
hojaEstructuras.getCell("H7").value = "E7";
hojaEstructuras.getCell("I7").value = "E8";
hojaEstructuras.getCell("J7").value = "E9";


//-----------------------------------------------------
// FILA 8 — ESTRUCTURA 1
//-----------------------------------------------------

hojaEstructuras.getCell("A8").value =
    "Estructura 1";

hojaEstructuras.getCell("B8").value =
    "She";

hojaEstructuras.getCell("C8").value =
    "is";

hojaEstructuras.getCell("D8").value =
    "a doctor";


// E4-E9 permanecen vacías


//-----------------------------------------------------
// FILA 9 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A9:J9 permanece completamente vacía.


//-----------------------------------------------------
// FILA 10 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A10:J10 permanece completamente vacía.


//-----------------------------------------------------
// FILA 11 — ESTRUCTURA 2
//-----------------------------------------------------

hojaEstructuras.getCell("A11").value =
    "Estructura 2";

hojaEstructuras.getCell("B11").value =
    "He";

hojaEstructuras.getCell("C11").value =
    "will";

hojaEstructuras.getCell("D11").value =
    "come";

hojaEstructuras.getCell("E11").value =
    "by then";


// E5-E9 permanecen vacías


//-----------------------------------------------------
// FILA 12 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A12:J12 permanece completamente vacía.


//-----------------------------------------------------
// FILA 13 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A13:J13 permanece completamente vacía.


//-----------------------------------------------------
// FILA 14 — ESTRUCTURA 3
//-----------------------------------------------------

hojaEstructuras.getCell("A14").value =
    "Estructura 3";

hojaEstructuras.getCell("B14").value =
    "I";

hojaEstructuras.getCell("C14").value =
    "have";

hojaEstructuras.getCell("D14").value =
    "been";

hojaEstructuras.getCell("E14").value =
    "waiting";

hojaEstructuras.getCell("F14").value =
    "for you";


// E6-E9 permanecen vacías


//-----------------------------------------------------
// FILA 15 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A15:J15 permanece completamente vacía.


//-----------------------------------------------------
// FILA 16 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A16:J16 permanece completamente vacía.


//-----------------------------------------------------
// FILA 17 — ESTRUCTURA 4
//-----------------------------------------------------

hojaEstructuras.getCell("A17").value =
    "Estructura 4";

hojaEstructuras.getCell("B17").value =
    "You";

hojaEstructuras.getCell("C17").value =
    "will";

hojaEstructuras.getCell("D17").value =
    "have";

hojaEstructuras.getCell("E17").value =
    "been";

hojaEstructuras.getCell("F17").value =
    "running";

hojaEstructuras.getCell("G17").value =
    "for hours";


// E7-E9 permanecen vacías


//-----------------------------------------------------
// FILA 18 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A18:J18 permanece completamente vacía.


//-----------------------------------------------------
// FILA 19 — COMPLETAMENTE RESERVADA
//-----------------------------------------------------

// A19:J19 permanece completamente vacía.


//-----------------------------------------------------
// ANCHO DE COLUMNAS
//-----------------------------------------------------

hojaEstructuras.getColumn("A").width = 20;

for (let columna of ["B","C","D","E","F","G","H","I","J"]) {

    hojaEstructuras.getColumn(columna).width = 18;

}


//-----------------------------------------------------
// ENCABEZADOS EN NEGRITA
//-----------------------------------------------------

for (let celda of [
    "A1","B1","C1","D1","E1","F1","G1","H1","I1","J1",
    "A7","B7","C7","D7","E7","F7","G7","H7","I7","J7"
]) {

    hojaEstructuras.getCell(celda).font = {
        bold: true
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
