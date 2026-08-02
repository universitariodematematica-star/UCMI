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


/*=====================================================
INICIO - LECTOR PRINCIPAL DEL EXCEL
=====================================================*/

async function leerExcel(event){

    const archivo = event.target.files[0];

    if(!archivo) return;


    const buffer = await archivo.arrayBuffer();


    const libro = new ExcelJS.Workbook();


    await libro.xlsx.load(buffer);

    console.log(
    libro.worksheets.map(
        hoja => hoja.name
    )
);


    const hoja = libro.getWorksheet("Datos");
    const hojaSelSimple = libro.getWorksheet("Sel-simp-op");
    const hojaCompletar = libro.getWorksheet("Completar");
    const hojaMostrar = libro.getWorksheet("Mostrar");
    const hojaDragDrop = libro.getWorksheet("Drag-drop-blanco");
    const hojaOrdenarOracion = libro.getWorksheet("Ordenar-oracion");
    const hojaRelacionar = libro.getWorksheet("Relacionar");
    const hojaTraduccion = libro.getWorksheet("Traducción");

    console.log("HOJAS:", libro.worksheets.map(h=>h.name));
    console.log("ORDENAR:", hojaOrdenarOracion);

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

        pregunta: pregunta,

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
    );


    const mostrar =
    leerCelda(
        hojaMostrar.getCell("B"+fila)
    );


    if(tipo){

        configuracionMostrar[tipo] = mostrar;

    }

}

  ejerciciosCompletar = [];

for(let fila = 2; fila <= hojaCompletar.rowCount; fila++){

    const pregunta =
    leerCelda(hojaCompletar.getCell("A" + fila));


    if(!pregunta) continue;


    ejerciciosCompletar.push({

        pregunta: pregunta,

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

console.log("DRAG DROP:", ejerciciosDragDrop);    

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


console.log(
"ORDENAR ORACION:",
ejerciciosOrdenarOracion
);

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


console.log(
"RELACIONAR COLUMNAS:",
ejerciciosEmparejarColumnas
);   

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


console.log(
"TRADUCCIÓN:",
ejerciciosTraduccion
);    
    
}
    
    datosPagina = {

nivel:nivel,

unidad:unidad,

tema:tema,

tituloIngles:tituloIngles,

tituloEspanol:tituloEspanol

};

generarCodigo(
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
configuracionMostrar
);

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
