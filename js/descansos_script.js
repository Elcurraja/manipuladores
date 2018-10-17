$(function(){
    $.ajax({
        url: "phpajax/descansos_ajax.php",
        type: "post",
        dataType : "json",
        data: {
            accion: "exist_datos_descansos",
        },
        success: function(respuesta){
            if (respuesta.error == 1) {
                console.log(respuesta.mensaje);
            } else {
                if (respuesta.respuesta == 1) {
                    //mostrarDescansos();
                } else {
                    $("#mensaje_descansos").css("display", "block").text("No hay datos en 'descansos'");
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los descansos: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    });
    /* ----------------------------------------------------------------------------------------------------------- */

    $('#fecha_inicio').datetimepicker({
        locale: 'es',
        format: 'L'
    });

    $("#fecha_fin").datetimepicker({
        locale: 'es',
        format: 'L'
    });
});