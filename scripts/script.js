$(function(){
    $("#mostrar").on("click", function(){
        $.ajax({
            url:"phpajax/obtener_resumenranking.php",
            type: "post",
            data: {
                host: datos.servidor,
                usuario: datos.usuario,
                pass: datos.pass,
                bd: datos.bd
            },
            success: function (respuesta) {
                $("#tabla").empty().html(respuesta);
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
            }
        });
    });
});