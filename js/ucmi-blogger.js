const UCMIBlogger = {

    panel:null,

    imagenes:[],

    actualizar(){

    this.extraerImagenes();

    if(window.actualizarImagenesIdentificar){

        window.actualizarImagenesIdentificar();

    }

},

    iniciar(config={}){

        const contenedor =
        document.querySelector(
            config.contenedor || "body"
        );


        if(!contenedor){

            console.error(
                "No existe el contenedor para UCMIBlogger"
            );

            return;

        }


        // Crear panel

        this.panel = document.createElement("div");

        this.panel.id =
        "ucmiBloggerPanel";


        this.panel.innerHTML = `

<h3>
Imágenes Blogger
</h3>


<textarea
id="codigoBlogger"
placeholder="Pegue aquí el código HTML exportado desde Blogger">
</textarea>


<div
id="estadoBlogger">
</div>


`;


        contenedor.appendChild(
            this.panel
        );

        const campo =
this.panel.querySelector(
    "#codigoBlogger"
);


campo.addEventListener(
"input",
()=>{

    this.actualizar();

});


        // Oculto inicialmente

        this.ocultar();


    },


    mostrar(){

        if(this.panel){

            this.panel.style.display =
            "block";

        }

    },


    ocultar(){

        if(this.panel){

            this.panel.style.display =
            "none";

        }

    },


    visible(){

        if(!this.panel){

            return false;

        }


        return (
            this.panel.style.display !== "none"
        );

    },

extraerImagenes(codigoHTML = null){

    const codigo =
        codigoHTML !== null
            ? codigoHTML
            : (
                document.getElementById("codigoBlogger")
                ? document.getElementById("codigoBlogger").value
                : ""
            );


    const patron =
        /https:\/\/blogger\.googleusercontent\.com\/[^"'\s<>]+/gi;


    const encontrados =
        codigo.match(patron);

    console.log(
    "BLOGGER - CÓDIGO RECIBIDO:",
    codigo
);

console.log(
    "BLOGGER - URLs EXTRAÍDAS:",
    encontrados
);


    if(!encontrados){

        this.imagenes = [];

        const estado =
            document.getElementById("estadoBlogger");

        if(estado){

            estado.innerHTML =
                "No se encontraron imágenes";

        }

        return;

    }


    this.imagenes =
        [...new Set(encontrados)];


    const estado =
        document.getElementById("estadoBlogger");

    if(estado){

        estado.innerHTML =
            "✅ Imágenes encontradas: "
            +
            this.imagenes.length;

    }


    console.log(
        "Imágenes Blogger:",
        this.imagenes
    );


    if(window.actualizarImagenesIdentificar){

        window.actualizarImagenesIdentificar();

    }

} 

};


// Exponer globalmente

window.UCMIBlogger = UCMIBlogger;


console.log(
"UCMIBlogger cargado correctamente"
);
