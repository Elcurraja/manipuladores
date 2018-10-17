$(function(){
    $.ajax({
        url: "php/descansos_ajax.php",
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
                    mostrarDescansos();
                    $("#mostrar_descansos").css("display", "table");
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

    /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA EL INPUT "FECHA INICIO"
       https://tempusdominus.github.io/bootstrap-4/Usage/#date-only */
    $('#fecha_inicio').datetimepicker({
        locale: 'es',
        format: 'L'
    });

    /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA EL INPUT "FECHA FIN"
       https://tempusdominus.github.io/bootstrap-4/Usage/#date-only */
    $("#fecha_fin").datetimepicker({
        locale: 'es',
        format: 'L'
    });

    /* EVENTO PARA COMPROBAR SI TODOS LOS INPUTS DEL MODAL AÑADIR DESCANSO CONTIENEN UN DATO
       EL SELECTOR APUNTA A LOS DOS INPUTS DE FECHA Y LOS DOS PRIMEROS EVENTOS SON DE TEMPUS DOMINUS
       https://tempusdominus.github.io/bootstrap-4/Events/#hidedatetimepicker */
       $("#fecha_inicio, #fecha_fin").on("hide.datetimepicker show.datetimepicker focusin focusout", function(){
        if ($("#idmanipulador").val() && $("#tipo_descanso").val() && $("#fecha_inicio").datetimepicker('date') && $("#fecha_fin").datetimepicker('date')) {
            $("#guardar_nuevo_descanso_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
        }
    });
    // EVENTO CAPTURADO DESDE UN LANZAMIENTO MANUAL EN EL CODIGO JAVASCRIPT DEL DOCUMENTO PHP
    $("#idmanipulador").change(function(){
        if ($(this).val() && $("#tipo_descanso").val() && $("#fecha_inicio").datetimepicker('date') && $("#fecha_fin").datetimepicker('date')) {
            $("#guardar_nuevo_descanso_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
        }
    });

    /* EVENTO PARA COMPROBAR SI TODOS LOS INPUTS DEL MODAL AÑADIR DESCANSO CONTIENEN UN DATO
       SE COMPRUEBA CADA VEZ QUE SE ESCRIBE ALGO EN EL CAMPO "Tipo de descanso" */
       $("#tipo_descanso").on("keyup blur focus", function(){
        if ($("#idmanipulador").val() && $(this).val() && $("#fecha_inicio").datetimepicker('date') && $("#fecha_fin").datetimepicker('date')) {
            $("#guardar_nuevo_descanso_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
        }
    });

    $("#modal_anyadir_descanso").on("hide.bs.modal", function () {
        $("#mensaje_anyadir_descanso").empty();
        $("#idmanipulador").val("");
        $('#fecha_inicio').datetimepicker("clear");
        $('#fecha_fin').datetimepicker("clear");
        $("#tipo_descanso").val("");
    });

    $("#guardar_nuevo_descanso_btn").click(function () {
        if (!$("#idmanipulador").val() || !$("#tipo_descanso").val() || !$("#fecha_inicio").datetimepicker('date') || !$("#fecha_fin").datetimepicker('date')) {
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
        } else {
            anyadirDescanso();
        }
    });

    /* GUARDAR CAMBIOS
       COMPRUEBA QUE TODOS LOS INPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_cambios_btn").click(function(){
        var estaVacio = false;
        $(".selec_descanso:checked").closest("tr").each(function(){
            if(!$(this).find("td:nth-child(7) > div").datetimepicker('date') || !$(this).find("td:nth-child(8) > div").datetimepicker('date') || !$(this).find("td:nth-child(9) input").val()){
                estaVacio = true;
            }
        });
        if (estaVacio) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", true);
        } else {
            editarDescansos();
        }
    });

    /* CARGA EL MENSAJE DE CONFIRMACION DE BORRADO AL MOSTRARSE EL MODAL DE CONFIRMACION */
    $("#modal_confirm_borrar_descansos").on('show.bs.modal', function(){
        var elementos = $(".selec_descanso:checked").closest("tr");
        if (elementos.length > 1) {
            $("#mensaje_confirm_borrar_descansos").html("<p>¿Realmente desea borrar estos " + elementos.length + " registros?: </p>");
            elementos.each(function(){
                $("#mensaje_confirm_borrar_descansos").append("<p>" + "Nº " + $(this).find("td:nth-child(2) input").val() + " - " + $(this).find("td:nth-child(4) input").val() + " " + $(this).find("td:nth-child(5) input").val() + " - " + $(this).find("td:nth-child(6) input").val() + " - " + $(this).find("td:nth-child(7) > div").datetimepicker('date').format('L') + " -> " + $(this).find("td:nth-child(8) > div").datetimepicker('date').format('L') +" - " + $(this).find("td:nth-child(9) input").val() + "</p>") ;
            });
        } else {
            $("#mensaje_confirm_borrar_descansos").text("¿Realmente desea borrar el nº " + elementos.find("td:nth-child(2) input").val() + " - " + elementos.find("td:nth-child(4) input").val() + " " + elementos.find("td:nth-child(5) input").val() + " - " + elementos.find("td:nth-child(6) input").val() + " - " + elementos.find("td:nth-child(7) > div").datetimepicker('date').format('L') + " -> " + elementos.find("td:nth-child(8) > div").datetimepicker('date').format('L') + " - " + elementos.find("td:nth-child(9) input").val() + " " + "?");
        }
    });

    $("#mostrar_descansos").on("change", ".selec_descanso", function(){
        if ($(".selec_descanso:checked").length > 0) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", false);
        } else {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", true);
        }
        
        var isChecked = $(this).prop("checked");
        $(this).closest("td").siblings("td:gt(4)").each(function(){
            if (isChecked){
                // https://stackoverflow.com/questions/1306708/how-to-add-a-readonly-attribute-to-an-input
                $(this).find("input").prop("readonly", false);
            } else {
                $(this).find("input").prop("readonly", true);
            }
        });
    });

    /* --------------------------------------------------------------------------------------------------------------------------- */

    function mostrarDescansos(){
        $.ajax({
            url: "php/descansos_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: "mostrarDescansos"
            },
            success: function(respuesta){
                if (respuesta.error == 0) {
                    $("#mostrar_descansos tbody").empty();
                    for (let index = 0; index < respuesta.datos.length; index++){
                        $("#mostrar_descansos tbody").append("<tr><td scope='row'><div class='form-check'><input type='checkbox' class='form-check-input selec_descanso' /></div></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].iddescanso + "' readonly /></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].idmanipulador + "' readonly /></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].nombre + "' readonly /></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].apellidos + "' readonly /></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].dni + "' readonly /></td><td><div class='input-group date' id='fecha_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_inicio_" + index + "' readonly /><div class='input-group-append' data-target='#fecha_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-calendar'></i></div></div></div></td><td><div class='input-group date' id='fecha_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_fin_" + index + "' readonly /><div class='input-group-append' data-target='#fecha_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-calendar'></i></div></div></div></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].tipo + "' readonly /></td></tr>");
                        $('#fecha_inicio_' + index).datetimepicker({
                            locale: 'es',
                            format: 'DD-MM-YYYY',
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: moment(respuesta.datos[index].fecha_inicio)
                        });
                        $('#fecha_fin_' + index).datetimepicker({
                            locale: 'es',
                            format: 'DD-MM-YYYY',
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: moment(respuesta.datos[index].fecha_fin)
                        });
                    }
                    $("#mostrar_descansos").css("display", "table");
                } else {
                    console.log(respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para mostrar los descansos: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function () {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", true);
        });
    }

    function anyadirDescanso() {
        $.ajax({
            url: "php/descansos_ajax.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "anyadirDescanso",
                datos: JSON.stringify({
                    idmanipulador: $("#idmanipulador").val(),
                    fecha_inicio: $("#fecha_inicio").datetimepicker('date').format('YYYY-MM-DD'),
                    fecha_fin: $("#fecha_fin").datetimepicker('date').format('YYYY-MM-DD'),
                    tipo: $("#tipo_descanso").val()
                })
            },
            success: function(respuesta){
                if (respuesta.error == 1) {
                    console.log("Error de php: " + respuesta.mensaje);
                } else {
                    mostrarDescansos();
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para añadir nuevo descanso: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            $("#modal_anyadir_descanso").modal('hide');
            mostrarDescansos();
        });
    }

    function editarDescansos() {
        var array = [];
        $(".selec_descanso:checked").closest("tr").each(function(){
            var temp = {
                "iddescanso": $(this).find("td:nth-child(2) input").val(),
                "idmanipulador": $(this).find("td:nth-child(3) input").val(),
                "fecha_inicio": $(this).find("td:nth-child(7) > div").datetimepicker('date').format('YYYY-MM-DD'),
                "fecha_fin": $(this).find("td:nth-child(8) > div").datetimepicker('date').format('YYYY-MM-DD'),
                "tipo": $(this).find("td:nth-child(9) input").val()
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/descansos_ajax.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "editarDescansos",
                datos: JSON.stringify(array)
            },
            success: function(respuesta){
                if (respuesta.error == 1) {
                    console.log("Error en php: " + respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para actualizar: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
                mostrarDescansos();
        });
    }

    function eliminarDescansos(){
        var array = [];
        $(".selec_descanso:checked").closest("tr").each(function(){
            var temp = {
                "iddescanso": $(this).find("td:nth-child(2) input").val()
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/descansos_ajax.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "borrarDescansos",
                datos: JSON.stringify(array)
            },
            success: function(respuesta){
                if (respuesta.error == 1) {
                    console.log("Error en php: " + respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para eliminar: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            mostrarDescansos();
        });
    }
});