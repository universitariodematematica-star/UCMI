/*=====================================================
EVENTOS DEL CONSTRUCTOR
=====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        document
        .getElementById("excelInput")
        .addEventListener(
            "change",
            leerExcel
        );


if(window.UCMIBlogger){

    UCMIBlogger.iniciar({
        contenedor:"#panelBlogger"
    });

}


    }
);
