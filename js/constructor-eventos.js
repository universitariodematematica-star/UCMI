/*=====================================================
EVENTOS DEL CONSTRUCTOR
=====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
            "INPUT EXCEL:",
            document.getElementById("excelInput")
        );

        document
        .getElementById("excelInput")
        .addEventListener(
            "change",
            leerExcel
        );

    }
);
