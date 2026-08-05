const UCMIBlogger = {

    panel:null,


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

    }

};


// Exponer globalmente

window.UCMIBlogger = UCMIBlogger;


console.log(
"UCMIBlogger cargado correctamente"
);
