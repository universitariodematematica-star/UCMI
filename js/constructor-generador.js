/*=====================================================
GENERADOR DEL CONSTRUCTOR
=====================================================*/

function generarCodigoActualizado(){   // ← VIENE DE: js/generador-html-erg.js

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
        ejerciciosTranscripcion,
        ejercicioIdentificarImagenes,
        configuracionMostrar

    );

}
