/*
=====================================================
UCMI - Encabezado Académico
=====================================================

Genera automáticamente:

• Barra negra (título)
• Barra azul (skill)

=====================================================
*/

(function () {

    function iniciar(config) {

        const contenedor = document.getElementById("ucmiEncabezado");

        if (!contenedor) return;

        contenedor.innerHTML = `

<table class="barra-negra">
    <tr>
        <td>
            <p>${config.titulo}</p>
        </td>
    </tr>
</table>

<table class="barra-azul">
    <tr>
        <td>
            <p>${config.skill.toUpperCase()}</p>
        </td>
    </tr>
</table>

`;

    }

    window.UCMIEncabezado = {

        iniciar

    };

})();
