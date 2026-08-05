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


        UCMIBlogger.iniciar({
            contenedor:"#panelBlogger"
        });


    }
);
