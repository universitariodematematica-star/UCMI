const UCMIBlogger = {

    panel:null,

    imagenes:[],

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

    this.extraerImagenes();

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

   extraerImagenes(){

    const codigo =
    document.getElementById(
        "codigoBlogger"
    ).value;


    const patron =
    /https:\/\/blogger\.googleusercontent\.com\/[^"]+/gi;


    const encontrados =
    codigo.match(patron);


    if(!encontrados){

        this.imagenes=[];

        document.getElementById(
            "estadoBlogger"
        ).innerHTML =
        "No se encontraron imágenes";

        return;

    }


    this.imagenes =
    [...new Set(encontrados)];


    document.getElementById(
        "estadoBlogger"
    ).innerHTML =

    "✅ Imágenes encontradas: "
    +
    this.imagenes.length;


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
