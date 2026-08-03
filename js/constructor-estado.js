/*=====================================================
ESTADO GLOBAL DEL CONSTRUCTOR
=====================================================*/

let datosPagina = {

    nivel:"",
    unidad:"",
    tema:"",
    tituloIngles:"",
    tituloEspanol:""

};

let vocabularioGlobal = [];
let subtitulosGlobal = [];

let ejerciciosSelSimple = [];
let ejerciciosCompletar = [];
let ejerciciosDragDrop = [];
let ejerciciosOrdenarOracion = [];
let ejerciciosEmparejarColumnas = [];
let ejerciciosTraduccion = [];

let configuracionMostrar = {};

const MODOS = {

    LOCAL: "local",

    GITHUB: "github"

};

// Cambia este valor cuando quieras exportar
let modoExportacion = MODOS.GITHUB;
