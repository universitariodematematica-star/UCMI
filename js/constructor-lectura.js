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
    const hojaCompletarTextoListening = libro.getWorksheet("Completar-texto-listening");
    const hojaOrdenarParrafos = libro.getWorksheet("ordenar-parrafos");
    const hojaComprensionTexto = libro.getWorksheet("Comprension-texto");
    const hojaComprensionAuditiva = libro.getWorksheet("Comprension-auditiva");
    const hojaSustitucionContextual = libro.getWorksheet("Sustitucion-contextual");
    const hojaMineria = libro.getWorksheet("Mineria");


for(let fila = 1; fila <= hojaMineria.rowCount; fila++){

    let datosFila = [];

    for(let columna = 1; columna <= hojaMineria.columnCount; columna++){

        datosFila.push(
            leerCelda(
                hojaMineria.getCell(fila, columna)
            )
        );

    }

}

//===========================================
// MINERIA - MODELO 15
//===========================================

let ejercicioMineria = {

    palabras: [],

    numeroMinimoPalabras: 0,

    estructuras: []

};


if (hojaMineria) {

    //=======================================
    // LEER PALABRAS
    //
    // B2:B4
    //=======================================

    for (
        let fila = 2;
        fila <= 4;
        fila++
    ) {

        const palabra =
            leerCelda(
                hojaMineria.getCell("B" + fila)
            ).trim();


        if (!palabra) {
            continue;
        }


        ejercicioMineria.palabras.push(
            palabra
        );

    }


    //=======================================
    // NÚMERO MÍNIMO DE PALABRAS
    //
    // C2
    //=======================================

    const numeroMinimo =
        leerCelda(
            hojaMineria.getCell("C2")
        ).trim();


    const numeroMinimoPalabras =
        Number(numeroMinimo);


    if (
        Number.isInteger(numeroMinimoPalabras) &&
        numeroMinimoPalabras > 0
    ) {

        ejercicioMineria.numeroMinimoPalabras =
            numeroMinimoPalabras;

    }


    //=======================================
    // LEER ESTRUCTURAS
    //
    // A2:A6 = número
    // D2:D4 = estructura
    //=======================================

    for (
        let fila = 2;
        fila <= 6;
        fila++
    ) {

        const numero =
            leerCelda(
                hojaMineria.getCell("A" + fila)
            ).trim();


        const estructura =
            leerCelda(
                hojaMineria.getCell("D" + fila)
            ).trim();


        if (!numero || !estructura) {
            continue;
        }


        const numeroEstructura =
            Number(numero);


        if (!Number.isInteger(numeroEstructura)) {
            continue;
        }


        ejercicioMineria.estructuras.push({

            numero:
                numeroEstructura,

            estructura:
                estructura

        });

    }

}
 

//===========================================
// SUSTITUCIÓN CONTEXTUAL
//===========================================
//
// HOJA: "Sustitucion-contextual"
//
// B1 = Nombre
//
// C3:C12 = número de párrafo
// D3:D12 = contenido del párrafo
// E3:E12 = número inicial
// F3:F12 = número final
//
// G3:G12 = frase correcta
// H3:H12 = frase falsa 1
// I3:I12 = frase falsa 2
// J3:J12 = frase falsa 3
//
// K3:K12 = explicación gramatical
//
// E y F representan posiciones de palabras
// dentro del párrafo.
//
// Ejemplo:
// E = 3
// F = 5
//
// El segmento sustituible está formado
// por las palabras 3, 4 y 5.
//
//===========================================

let ejercicioSustitucionContextual = {

    nombre: "",

    parrafos: []

};


if (hojaSustitucionContextual) {

    //=======================================
    // NOMBRE
    //=======================================

    ejercicioSustitucionContextual.nombre =
        leerCelda(
            hojaSustitucionContextual.getCell("B1")
        ).trim();


    //=======================================
    // LEER PÁRRAFOS
    //=======================================

    for (
        let fila = 3;
        fila <= 12;
        fila++
    ) {

        const numeroParrafo =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "C" + fila
                )
            ).trim();


        const texto =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "D" + fila
                )
            ).trim();


        const inicioTexto =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "E" + fila
                )
            ).trim();


        const finTexto =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "F" + fila
                )
            ).trim();


        const correcta =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "G" + fila
                )
            ).trim();


        const falsa1 =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "H" + fila
                )
            ).trim();


        const falsa2 =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "I" + fila
                )
            ).trim();


        const falsa3 =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "J" + fila
                )
            ).trim();


        const explicacion =
            leerCelda(
                hojaSustitucionContextual.getCell(
                    "K" + fila
                )
            ).trim();


        //===================================
        // IGNORAR FILAS SIN PÁRRAFO
        //===================================

        if (!texto) {
            continue;
        }


        const inicio =
            Number(inicioTexto);


        const fin =
            Number(finTexto);


        //===================================
        // GUARDAR PÁRRAFO
        //===================================

        ejercicioSustitucionContextual.parrafos.push({

            numero:
                numeroParrafo,

            texto:
                texto,

            inicio:
                Number.isInteger(inicio)
                    ? inicio
                    : 0,

            fin:
                Number.isInteger(fin)
                    ? fin
                    : 0,

            correcta:
                correcta,

            incorrectas: [

                falsa1,

                falsa2,

                falsa3

            ].filter(
                opcion => opcion !== ""
            ),

            explicacion:
                explicacion

        });

    }

}


//===========================================
// COMPRENSIÓN AUDITIVA
//===========================================
//
// A2  = ruta del audio
// A5  = título
//
// Pregunta 1 → filas 7 a 12
// Pregunta 2 → filas 13 a 18
// Pregunta 3 → filas 19 a 24
// ...
// Pregunta 10 → filas 61 a 66
//
// C[F]     = etiqueta "Pregunta n"
// D[F]     = enunciado
// D[F+1]   = opción correcta
// D[F+2]   = opción falsa
// D[F+3]   = opción falsa
// D[F+4]   = opción falsa
//
// F = fila inicial del bloque
//===========================================

let ejercicioComprensionAuditiva = {

    audio: "",

    titulo: "",

    preguntas: []

};


if (hojaComprensionAuditiva) {

    //=======================================
    // RUTA DEL AUDIO
    //=======================================

    ejercicioComprensionAuditiva.audio =
        leerCelda(
            hojaComprensionAuditiva.getCell("A2")
        ).trim();


    //=======================================
    // TÍTULO
    //=======================================

    ejercicioComprensionAuditiva.titulo =
        leerCelda(
            hojaComprensionAuditiva.getCell("A5")
        ).trim();


    //=======================================
    // LEER PREGUNTAS
    //=======================================

    for (
        let numeroPregunta = 1;
        numeroPregunta <= 10;
        numeroPregunta++
    ) {

        const filaInicio =
            6 * (numeroPregunta - 1) + 7;


        //===================================
        // ENUNCIADO
        //===================================

        const pregunta =
            leerCelda(
                hojaComprensionAuditiva.getCell(
                    "D" + filaInicio
                )
            ).trim();


        if (!pregunta) {
            continue;
        }


        //===================================
        // OPCIÓN CORRECTA
        //===================================

        const correcta =
            leerCelda(
                hojaComprensionAuditiva.getCell(
                    "D" + (filaInicio + 1)
                )
            ).trim();


        //===================================
        // OPCIONES FALSAS
        //===================================

        const incorrectas = [];


        for (
            let i = 2;
            i <= 4;
            i++
        ) {

            const incorrecta =
                leerCelda(
                    hojaComprensionAuditiva.getCell(
                        "D" + (filaInicio + i)
                    )
                ).trim();


            if (incorrecta) {

                incorrectas.push(
                    incorrecta
                );

            }

        }


        //===================================
        // GUARDAR PREGUNTA
        //===================================

        ejercicioComprensionAuditiva.preguntas.push({

            numero:
                numeroPregunta,

            pregunta:
                pregunta,

            correcta:
                correcta,

            incorrectas:
                incorrectas

        });

    }

}


//===========================================
// DIAGNÓSTICO
//===========================================


//===========================================
// COMPRENSIÓN DE TEXTO
//===========================================
//
// HOJA: "Comprension-texto"
//
// PÁRRAFOS
//
// A2:A11 = hasta 10 párrafos.
//
// El número de párrafos depende de los datos
// existentes en el Excel.
//
// Un párrafo puede tener varias preguntas.
// Un párrafo puede no tener preguntas.
//
// Las preguntas NO se asignan aquí a párrafos.
// La distribución de preguntas es independiente.
//
// PREGUNTAS
//
// Cada pregunta ocupa 6 filas.
//
// Pregunta 1 → filas 1 a 6
// Pregunta 2 → filas 7 a 12
// Pregunta 3 → filas 13 a 18
// ...
// Pregunta 10 → filas 55 a 60
//
// D[F]     = enunciado de la pregunta
// D[F+1]   = opción correcta
// D[F+2]   = opción falsa
// D[F+3]   = opción falsa
// D[F+4]   = opción falsa
//
// F = fila inicial del bloque de la pregunta.
//
// Máximo:
// 10 párrafos
// 10 preguntas
//===========================================

let ejercicioComprensionTexto = {

    titulo: leerCelda(
        hojaComprensionTexto.getCell("A14")
    ).trim(),

    parrafos: [],

    preguntas: []

};


//===========================================
// LEER PÁRRAFOS
//===========================================

if (hojaComprensionTexto) {

    for (
        let fila = 2;
        fila <= 11;
        fila++
    ) {

        const parrafo =
            leerCelda(
                hojaComprensionTexto.getCell(
                    "A" + fila
                )
            ).trim();


        if (!parrafo) {
            continue;
        }


        ejercicioComprensionTexto.parrafos.push({

            numero:
                fila - 1,

            texto:
                parrafo

        });

    }


    //=======================================
    // LEER PREGUNTAS
    //=======================================
    //
    // Pregunta 1  → fila 1
    // Pregunta 2  → fila 7
    // Pregunta 3  → fila 13
    // ...
    // Pregunta 10 → fila 55
    //
    // Cada pregunta ocupa 6 filas.
    //
    //=======================================

    for (
        let numeroPregunta = 1;
        numeroPregunta <= 10;
        numeroPregunta++
    ) {

        const filaInicio =
            6 * (numeroPregunta - 1) + 1;


        //===================================
        // ENUNCIADO DE LA PREGUNTA
        //===================================

        const pregunta =
            leerCelda(
                hojaComprensionTexto.getCell(
                    "D" + filaInicio
                )
            ).trim();


        if (!pregunta) {
            continue;
        }


        //===================================
        // OPCIÓN CORRECTA
        //===================================

        const correcta =
            leerCelda(
                hojaComprensionTexto.getCell(
                    "D" + (filaInicio + 1)
                )
            ).trim();


        //===================================
        // OPCIONES FALSAS
        //===================================

        const incorrectas = [];


        for (
            let i = 2;
            i <= 4;
            i++
        ) {

            const incorrecta =
                leerCelda(
                    hojaComprensionTexto.getCell(
                        "D" + (filaInicio + i)
                    )
                ).trim();


            if (incorrecta) {

                incorrectas.push(
                    incorrecta
                );

            }

        }


        //===================================
        // GUARDAR PREGUNTA
        //===================================

        ejercicioComprensionTexto.preguntas.push({

            numero:
                numeroPregunta,

            pregunta:
                pregunta,

            correcta:
                correcta,

            incorrectas:
                incorrectas

        });

    }

}

  
    
//===========================================
// ORDENAR PÁRRAFOS
//===========================================

let ejerciciosOrdenarParrafos = [];

if (hojaOrdenarParrafos) {

    for (
        let fila = 2;
        fila <= hojaOrdenarParrafos.rowCount;
        fila++
    ) {

        const orden =
            leerCelda(
                hojaOrdenarParrafos.getCell("A" + fila)
            ).trim();

        const parrafo =
            leerCelda(
                hojaOrdenarParrafos.getCell("B" + fila)
            ).trim();

        // Ignorar filas sin datos
        if (!orden || !parrafo) {
            continue;
        }

        const numeroOrden =
            Number(orden);

        // Solo aceptar números enteros
        if (!Number.isInteger(numeroOrden)) {
            continue;
        }

        ejerciciosOrdenarParrafos.push({

            orden: numeroOrden,

            parrafo: parrafo

        });

    }

}


    
if (hojaEstructuras) {

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
//
// Cada estructura ocupa exactamente
// tres filas en Excel:
//
// Estructura 1 → filas 8, 9, 10
// Estructura 2 → filas 11, 12, 13
// Estructura 3 → filas 14, 15, 16
// Estructura 4 → filas 17, 18, 19
//
// Una estructura solo se genera si
// al menos una de sus tres filas
// contiene elementos.
//===========================================

//===========================================
// CONSTRUIR LAS TABLAS DE ESTRUCTURAS
//===========================================
//
// Cada estructura definida en:
//
// fila 2 → sus oraciones están en 8, 9, 10
// fila 3 → sus oraciones están en 11, 12, 13
// fila 4 → sus oraciones están en 14, 15, 16
// fila 5 → sus oraciones están en 17, 18, 19
//
// Se utiliza la FILA REAL de Excel de la
// estructura y no el índice del array.
//===========================================

let tablasEstructuras = [];

infoEstructural.forEach(
    (estructura) => {

        const componentes =
            estructura.componentes.filter(
                componente =>
                    componente.trim() !== ""
            );


        //====================================
        // DETERMINAR LAS TRES FILAS
        // SEGÚN LA FILA REAL DE LA ESTRUCTURA
        //====================================

        const filaInicial =
            8 + ((estructura.fila - 2) * 3);


        const oracionesEstructura = [];


        //====================================
        // LEER LAS TRES FILAS DIRECTAMENTE
        // DESDE EXCEL
        //====================================

        for(
            let fila = filaInicial;
            fila < filaInicial + 3;
            fila++
        ){

            let elementosFila = [];


            for(
                let col = 2;
                col <= 10;
                col++
            ){

                const letraColumna =
                    String.fromCharCode(
                        64 + col
                    );


                const valorCelda =
                    leerCelda(
                        hojaEstructuras.getCell(
                            letraColumna + fila
                        )
                    );


                elementosFila.push(
                    valorCelda
                );

            }


            //================================
            // COMPROBAR SI LA FILA TIENE
            // AL MENOS UN ELEMENTO
            //================================

            const tieneElementos =
                elementosFila.some(
                    elemento =>
                        elemento.trim() !== ""
                );


            if(!tieneElementos){
                continue;
            }


            oracionesEstructura.push(

                elementosFila.slice(
                    0,
                    componentes.length
                )

            );

        }


        //====================================
        // SI NO EXISTE NINGUNA ORACIÓN,
        // NO CREAR LA TABLA
        //====================================

        if(
            oracionesEstructura.length === 0
        ){
            return;
        }


        //====================================
        // CREAR LA TABLA
        //====================================

        tablasEstructuras.push({

            numero:
                estructura.fila - 1,

            tipo:
                estructura.tipo,

            encabezados:
                componentes,

            oraciones:
                oracionesEstructura

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


oracionesEstructuradas.forEach(
    (oracion, indice) => {

    }
);

tablasEstructuras.forEach(
    tabla => {

    }
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
// COMPLETAR TEXTO - LISTENING
//===========================================
//
// B1      = ruta del audio
// B3:B32  = párrafos
// E3:E32  = número de párrafo
// F3:O32  = posiciones de palabras a ocultar
//
// IMPORTANTE:
// Los números de F:O NO representan palabras
// que JavaScript deba buscar por contenido.
// Representan posiciones dentro del párrafo
// indicado en E.
//===========================================

let completarTextoListening = {

    audio: "",

    parrafos: [],

    ocultamientos: []

};


//===========================================
// RUTA DEL AUDIO
//===========================================

completarTextoListening.audio =
leerCelda(
    hojaMostrar.getCell("B1")
);


//===========================================
// LEER PÁRRAFOS
//===========================================

for(let fila = 3; fila <= 32; fila++){

    const parrafo =
    leerCelda(
        hojaMostrar.getCell("B" + fila)
    ).trim();


    if(!parrafo){
        continue;
    }


    completarTextoListening.parrafos.push({

        filaExcel: fila,

        texto: parrafo

    });

}


//===========================================
// LEER RELACIÓN:
// E = NÚMERO DE PÁRRAFO
// F:O = POSICIONES DE PALABRAS
//===========================================

for(let fila = 3; fila <= 32; fila++){

    const numeroParrafoTexto =
    leerCelda(
        hojaMostrar.getCell("E" + fila)
    ).trim();


    if(!numeroParrafoTexto){
        continue;
    }


    const numeroParrafo =
    Number(numeroParrafoTexto);


    if(!Number.isInteger(numeroParrafo)){
        continue;
    }


    for(let col = 6; col <= 15; col++){

        const valor =
        leerCelda(
            hojaMostrar.getCell(
                fila,
                col
            )
        ).trim();


        if(!valor){
            continue;
        }


        const numeroPalabra =
        Number(valor);


        if(!Number.isInteger(numeroPalabra)){
            continue;
        }


        completarTextoListening.ocultamientos.push({

            filaExcel: fila,

            parrafo: numeroParrafo,

            palabra: numeroPalabra

        });

    }

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

/*=====================================================*
*COMPLETAR TEXTO LISTENING*
*=====================================================*/

let ejercicioCompletarTextoListening = {

    audio: "",

    parrafos: [],

    referencias: []

};


if(hojaCompletarTextoListening){

    //========================================
    // B1 = RUTA DEL AUDIO
    //========================================

    ejercicioCompletarTextoListening.audio =
    leerCelda(
        hojaCompletarTextoListening.getCell("B1")
    );


    //========================================
    // B3:B32 = PÁRRAFOS
    //
    // E3:E32 = NÚMERO DE PÁRRAFO
    //
    // F:O = POSICIONES DE PALABRAS
    //========================================

    for(let fila = 3; fila <= 32; fila++){

        const parrafo =
        leerCelda(
            hojaCompletarTextoListening.getCell(
                "B" + fila
            )
        );


        const numeroParrafoTexto =
        leerCelda(
            hojaCompletarTextoListening.getCell(
                "E" + fila
            )
        ).trim();


        //====================================
        // LEER F:O
        //====================================

        const posicionesPalabras = [];


        for(let columna = 6; columna <= 15; columna++){

            const posicionTexto =
            leerCelda(
                hojaCompletarTextoListening.getCell(
                    fila,
                    columna
                )
            ).trim();

            if(posicionTexto !== ""){

            }

            if(posicionTexto !== ""){

                const posicion =
                parseInt(posicionTexto, 10);


                if(
                    Number.isInteger(posicion) &&
                    posicion > 0
                ){

                    posicionesPalabras.push(
                        posicion
                    );

                }

            }

        }


        //====================================
        // GUARDAR EL PÁRRAFO
        //====================================

        if(parrafo.trim() !== ""){

            ejercicioCompletarTextoListening.parrafos.push({

                fila: fila,

                texto: parrafo

            });

        }


        //====================================
        // GUARDAR LA REFERENCIA
        //
        // Solo si E tiene un número de párrafo
        // y existe al menos una posición.
        //====================================

        if(
            numeroParrafoTexto !== "" &&
            posicionesPalabras.length > 0
        ){

            const numeroParrafo =
            parseInt(
                numeroParrafoTexto,
                10
            );


            if(
                Number.isInteger(numeroParrafo) &&
                numeroParrafo > 0
            ){

                ejercicioCompletarTextoListening.referencias.push({

                    fila: fila,

                    parrafo:
                    numeroParrafo,

                    posiciones:
                    posicionesPalabras

                });

            }

        }

    }

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


Object.entries(configuracionMostrar).forEach(
    ([clave, valor]) => {


    }
);
    

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

    //========================================
    // CONTROLAR COMPLETAR TEXTO - LISTENING
    // SEGÚN LA HOJA "Mostrar"
    //========================================

    const mostrarCompletarTextoListening =
        String(
            configuracionMostrar["Completar-texto-listening"] || ""
        )
        .trim()
        .toLowerCase();


    const datosCompletarTextoListening =
        mostrarCompletarTextoListening === "sí" ||
        mostrarCompletarTextoListening === "si"
            ? ejercicioCompletarTextoListening
            : {
                audio: "",
                parrafos: [],
                referencias: []
            };


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
        datosCompletarTextoListening,
        ejerciciosOrdenarParrafos,
        ejercicioComprensionTexto,
        ejercicioComprensionAuditiva,
        ejercicioSustitucionContextual,
        ejercicioMineria,
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
