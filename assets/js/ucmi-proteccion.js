/*
    =====================================================
    UCMI - Sistema de Protección Académica
    Archivo común preparado para Firebase Authentication
    =====================================================

    Estado actual:
    - Arquitectura preparada.
    - Sin bloqueo de páginas.
    - Sin cookies Blogger.
    - Sin validación todavía.

    Futuro:
    - Firebase Auth.
    - Firestore usuarios/{uid}.
    - Roles UCMI.
    - Permisos por academia, docente y estudiante.
*/


(function () {


    /*
        Configuración inicial

        Más adelante aquí podremos definir:
        - rutas públicas
        - rutas protegidas
        - roles permitidos
    */


    const UCMIProteccion = {


        iniciar: function () {


            console.log(
                "UCMI Protección preparada."
            );


            /*
                Futuro:

                1. Detectar usuario Firebase:

                firebase.auth().onAuthStateChanged()


                2. Consultar:

                usuarios/{uid}


                3. Verificar:

                perfil
                academiaId
                permisos

            */


        },



        usuarioActual: function () {


            /*
                Reservado para devolver
                el usuario autenticado
                cuando Firebase esté conectado.
            */


            return null;


        },



        tienePermiso: function () {


            /*
                Reservado para futuras
                comprobaciones de permisos.
            */


            return false;


        }



    };



    window.UCMIProteccion = UCMIProteccion;



})();
