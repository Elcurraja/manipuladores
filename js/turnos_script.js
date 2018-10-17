$(function(){
    // $(".table-responsive").css("overflowY", "visible");
    /* --------------------------------------------------- COMPROBACIONES INICIALES ---------------------------------------------- */

    /* COMPROBACION INICIAL EXISTENCIA DE DATOS EN 'turnos'.
       SI EXISTEN SE MUESTRA LA TABLA, SI NO, SE MUESTRA UN MENSAJE */
    $.ajax({
        url: "php/turnos.php",
        type: "post",
        dataType : "json",
        data: {
            accion: "exist_datos_turnos",
        },
        success: function(respuesta){
            if (respuesta.error == 1) {
                console.log(respuesta.mensaje);
            } else {
                if (respuesta.respuesta == 1) {
                    mostrarTurnos();
                } else {
                    $("#mensaje_turnos").css("display", "block").text("No hay datos en 'turnos'");
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los turnos: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    });

    /* ------------------------------------------------------- EVENTOS --------------------------------------------------------- */

    /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA EL INPUT "HORA FIN"
       https://tempusdominus.github.io/bootstrap-4/Usage/#time-only */
    $('#hora_fin').datetimepicker({
        locale: 'es',
        format: 'LT',
        stepping: "5"
    });

    /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA EL INPUT "HORA INICIO"
       https://tempusdominus.github.io/bootstrap-4/Usage/#time-only */
    $('#hora_inicio').datetimepicker({
        locale: 'es',
        format: 'LT',
        stepping: "5"
    });

    /* EVENTO PARA COMPROBAR SI TODOS LOS INPUTS DEL MODAL AÑADIR TURNO CONTIENEN UN DATO
       EL SELECTOR APUNTA A LOS DOS INPUTS DE FECHA Y LOS DOS PRIMEROS EVENTOS SON DE TEMPUS DOMINUS
       https://tempusdominus.github.io/bootstrap-4/Events/#hidedatetimepicker */
    $("#hora_inicio, #hora_fin").on("hide.datetimepicker show.datetimepicker focusin focusout", function(){
        if ($("#franja").val() && $("#hora_inicio").datetimepicker('date') && $("#hora_fin").datetimepicker('date')) {
            $("#guardar_nuevo_turno_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_turno_btn").prop("disabled", true);
        }
    });

    /* EVENTO PARA LIMPIAR TODOS LOS INPUTS DEL MODAL DE AÑADIR TURNO CUANDO ESTE SE OCULTA
       EL SELECTOR APUNTA AL ID DEL MODAL Y EL EVENTO ES DE BOOTSTRAP
       https://getbootstrap.com/docs/4.0/components/modal/#events */
    $("#modal_anyadir_turno").on("hide.bs.modal", function(){
        $("#mensaje_anyadir_turno").empty();
        $("#franja").val("");
        $('#hora_inicio').datetimepicker("clear");
        $('#hora_fin').datetimepicker("clear");
    });

    /* EVENTO PARA COMPROBAR SI TODOS LOS INPUTS DEL MODAL AÑADIR TURNO CONTIENEN UN DATO
       SE COMPRUEBA CADA VEZ QUE SE ESCRIBE ALGO EN EL CAMPO "FRANJA" */
    $("#franja").on("keyup blur focus", function(){
        if ($(this).val() && $("#hora_inicio").datetimepicker('date') && $("#hora_fin").datetimepicker('date')) {
            $("#guardar_nuevo_turno_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_turno_btn").prop("disabled", true);
        }
    });

    /* AÑADIR NUEVO TURNO
       COMPRUEBA QUE TODOS LOS INPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_nuevo_turno_btn").click(function(){
        if (!$("#franja").val() || !$("#hora_inicio").datetimepicker('date') || !$("#hora_fin").datetimepicker('date')) {
            $("#guardar_nuevo_turno_btn").prop("disabled", true);
            $("#mensaje_anyadir_turno").text("Todos los campos han de tener datos");
            console.log("Mensaje: " + $("#mensaje_anyadir_turno").text());
        } else {
            anyadirTurno();
        }
    });

    /* GUARDAR CAMBIOS
       COMPRUEBA QUE TODOS LOS IMPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_cambios_btn").click(function(){
        var estaVacio = false;
        $(".selec_turno:checked").closest("tr").each(function(){
            if(!$(this).find("td:nth-child(3) input").val() || !$(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT') || !$(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT')){
                estaVacio = true;
            }
        });
        if (estaVacio) {
            $("#guardar_cambios_btn").prop("disabled", true);
        } else {
            editarTurnos();
        }
    });

    /* CONFIRMAR BORRAR TURNOS
       AL PULSAR SOBRE CONFIRMAR BORRADO SE OCULTA EL MODAL Y SE LIMPIA EL CONTENIDO DE DATOS DEL MODAL */
    $("#borrar_turnos_btn").click(function(){
        $("#modal_confirm_borrar_turnos").modal('hide');
        $("#mensaje_confirm_borrar_turnos").empty();
        eliminarTurnos();
    });

    /* CARGA EL MENSAJE DE CONFIRMACION DE BORRADO AL MOSTRARSE EL MODAL DE CONFIRMACION */
    $("#modal_confirm_borrar_turnos").on('show.bs.modal', function(){
        var elementos = $(".selec_turno:checked").closest("tr");
        if (elementos.length > 1) {
            $("#mensaje_confirm_borrar_turnos").html("<p>¿Realmente desea borrar estos " + elementos.length + " turnos?: </p>");
            elementos.each(function(){
                $("#mensaje_confirm_borrar_turnos").append("<p>" + $(this).find("td:nth-child(3) input").val() + " " + $(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT') + " " + $(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT') + "</p>") ;
            });
        } else {
            $("#mensaje_confirm_borrar_turnos").text("¿Realmente desea borrar " + elementos.find("td:nth-child(3) input").val() + " " + elementos.find("td:nth-child(4) > div").datetimepicker('date').format('LT') + " " + elementos.find("td:nth-child(5) > div").datetimepicker('date').format('LT') + "?");
        }
    });

    /* COMPROBACION PARA LOS CHECKBOXES PARA ACTIVAR LOS BOTONES DE EDICION Y BORRADO
       EL EVENTO SE FIJA AL PADRE ESTATICO MAS CERCANO PERO APUNTA A LA CLASE DEL CHECKBOX */
    $("#mostrar_turnos").on("change", ".selec_turno", function(){
        if ($(".selec_turno:checked").length > 0) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", false);
        } else {
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", true);
        }
        
        var isChecked = $(this).prop("checked");
        $(this).closest("td").siblings("td:gt(0)").each(function(){
            if (isChecked){
                // https://stackoverflow.com/questions/1306708/how-to-add-a-readonly-attribute-to-an-input
                $(this).find("input").prop("readonly", false);
                $($(this).parent()[0]).css('background-color','#FFE189')
            } else {
                $(this).find("input").prop("readonly", true);
                $($(this).parent()[0]).css('background-color','')
            }
        });
    });
    /* ---------------------------------------------------------- FUNCIONES --------------------------------------------------- */
    function anyadirTurno(){
        $.ajax({
            url: "php/turnos.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "anyadirTurno",
                datos: JSON.stringify({
                    franja: $("#franja").val(),
                    hora_inicio: $("#hora_inicio").datetimepicker('date').format('LT'),
                    hora_fin: $("#hora_fin").datetimepicker('date').format('LT')
                })
            },
            success: function(respuesta){
                if (respuesta.error == 1) {
                    console.log("Error de php: " + respuesta.mensaje);
                } else {
                    mostrarTurnos();
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para añadir nuevo turno: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            $("#modal_anyadir_turno").modal('hide');
            mostrarTurnos();
        });
    }

    function mostrarTurnos(){
        $.ajax({
            url: "php/turnos.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "cargarTurnos"
            },
            success: function(respuesta){
                if (respuesta.error == 0) {
                    $("#mostrar_turnos tbody tr").remove();
                    for (let index = 0; index < respuesta.datos.length; index++) {
                        $("#mostrar_turnos tbody").append("<tr><td scope='row'><div class='form-check'><input type='checkbox' class='form-check-input selec_turno' /></div></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].idturno + "' readonly /></td><td><input type='text' class='form-control' value='" + respuesta.datos[index].franja + "' readonly /></td><td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' readonly /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-clock-o'></i></div></div></div></td><td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' readonly /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-clock-o'></i></div></div></div></td></tr>");
                        $('#hora_inicio_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            stepping: "5",
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: moment(respuesta.datos[index].hora_inicio, "HH:mm:ss")
                        });
                        $('#hora_fin_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            stepping: "5",
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date : moment(respuesta.datos[index].hora_fin, "HH:mm:ss")
                        });
                    }
                    $("#mostrar_turnos").css("display", "block");
                } else {
                    console.log(respuesta.mensaje);
                }
            }
        }).done(function(){
            $("#guardar_cambios_btn, #aviso_borrar_btn").prop("disabled", true);
        });
    }

    function editarTurnos(){
        var array = [];
        $(".selec_turno:checked").closest("tr").each(function(){
            var temp = {
                "idturno": $(this).find("td:nth-child(2) input").val(),
                "franja": $(this).find("td:nth-child(3) input").val(),
                "hora_inicio": $(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT'),
                "hora_fin": $(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT')
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/turnos.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "editarTurnos",
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
                mostrarTurnos();
        });
    }

    function eliminarTurnos(){
        var array = [];
        $(".selec_turno:checked").closest("tr").each(function(){
            var temp = {
                "idturno": $(this).find("td:nth-child(2) input").val()
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/turnos.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "borrarTurnos",
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
            mostrarTurnos();
        });
    }
});