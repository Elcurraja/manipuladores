$(function(){
    $.fn.dataTable.moment("LT", "es");
    $.fn.dataTableExt.ofnSearch['html-input'] = function(object) {
        return $(object).val();
    };
    /* TIPO "tempusdominus-hour" PARA PODER HACER BUSQUEDAS POR HORAS. SI SE USA EL PROPIO ELEMENTO PARA OBTENER
       EL VALOR DE LA FECHA DA ERROR ("Cannot read property 'format' of null") PERO USANDOLO POR SU ID NO */
    $.fn.dataTableExt.ofnSearch['tempusdominus-hour'] = function(object) {
        var id = $(object).attr("id");
        return $("#" + id).datetimepicker('date').format("LT");
    };
    /* DECLARACION DE TIPO DE DATO PARA LA ORDENACION DE DATATABLES 
       https://stackoverflow.com/questions/11376469/can-datatables-sort-a-column-with-an-input-field */
    $.fn.dataTable.ext.order['tempusdominus-date-ordering'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            var div = $('div', td);
            var id = div.attr("id");
            return $("#" + id).datetimepicker("date");
        });
    }
    /* --------------------------------------------------- COMPROBACIONES INICIALES ---------------------------------------------- */

    /* COMPROBACION INICIAL EXISTENCIA DE DATOS EN 'turnos'.
       SI EXISTEN SE MUESTRA LA TABLA, SI NO, SE MUESTRA UN MENSAJE */
    $.ajax({
        url: "php/turnos_ajax.php",
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
    $("#hora_inicio, #hora_fin").on("change.datetimepicker show.datetimepicker", function(){
        try {
            if ($("#franja").val() && $("#hora_inicio").datetimepicker('date').format("LT") && $("#hora_fin").datetimepicker('date').format("LT")) {
                $("#guardar_nuevo_turno_btn").prop("disabled", false);
                $("#mensaje_anyadir_turno").empty();
            } else {
                $("#guardar_nuevo_turno_btn").prop("disabled", true);
            }
        } catch (error) {
            console.log("Error: " + error.message);
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
        try {
            if ($(this).val() && $("#hora_inicio").datetimepicker('date').format("LT") && $("#hora_fin").datetimepicker('date').format("LT")) {
                $("#guardar_nuevo_turno_btn").prop("disabled", false);
                $("#mensaje_anyadir_turno").empty();
            } else {
                $("#guardar_nuevo_turno_btn").prop("disabled", true);
            }
        } catch (error) {
            console.log("Error: " + error.message);
            $("#guardar_nuevo_turno_btn").prop("disabled", true);
        }
    });

    /* AÑADIR NUEVO TURNO
       COMPRUEBA QUE TODOS LOS INPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_nuevo_turno_btn").click(function(){
        var estaVacio = false;
        try {
            if (!$("#franja").val() || !$("#hora_inicio").datetimepicker('date').format("LT") || !$("#hora_fin").datetimepicker('date').format("LT")) {
                estaVacio = true;
            }
        } catch (error) {
            console.log("Error: " + error.message);
            estaVacio = true;
        }
        if (!estaVacio) {
            $("#mensaje_anyadir_turno").empty();
            anyadirTurno();
        } else {
            $("#guardar_nuevo_turno_btn").prop("disabled", true);
            $("#mensaje_anyadir_turno").text("Todos los campos deben tener algún dato");
        }
    });

    /* GUARDAR CAMBIOS
       COMPRUEBA QUE TODOS LOS INPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_cambios_btn").click(function(){
        var estaVacio = false;
        try {
            $(".selec_turno:checked").closest("tr").each(function(){
                if(!$(this).find("td:nth-child(3) input").val() || !$(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT') || !$(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT')){
                    estaVacio = true;
                }
            });
        } catch (error) {
            console.log("Error: " + error.message);
            estaVacio = true;
        }
        if (!estaVacio) {
            editarTurnos();
        } else {
            mostrarTurnos();
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
                $("#mensaje_confirm_borrar_turnos").append("<p>" + $(this).find("td:nth-child(3) input").val() + " de " + $(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT') + " hasta " + $(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT') + "</p>") ;
            });
        } else {
            $("#mensaje_confirm_borrar_turnos").text("¿Realmente desea borrar " + elementos.find("td:nth-child(3) input").val() + " de " + elementos.find("td:nth-child(4) > div").datetimepicker('date').format('LT') + " hasta " + elementos.find("td:nth-child(5) > div").datetimepicker('date').format('LT') + "?");
        }
    });

    /* COMPROBACION PARA LOS CHECKBOXES PARA ACTIVAR LOS BOTONES DE EDICION Y BORRADO
       EL EVENTO SE FIJA AL PADRE ESTATICO MAS CERCANO PERO APUNTA A LA CLASE DEL CHECKBOX */
    $("#mostrar_turnos").on("change", ".selec_turno", function(){
        if ($(".selec_turno:checked").length > 0) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "block");
        } else {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        }
        
        var isChecked = $(this).prop("checked");
        $(this).closest("td").siblings("td").each(function(){
            if (isChecked){
                // https://stackoverflow.com/questions/1306708/how-to-add-a-readonly-attribute-to-an-input
                $(this).find("input").prop("readonly", false);
                $(this).parent().css('background-color','#FFE189')    
            } else {
                $(this).find("input").prop("readonly", true);
                $(this).parent().css('background-color','')   
            }
        });
    });
    /* ---------------------------------------------------------- FUNCIONES --------------------------------------------------- */
    function anyadirTurno(){
        $.ajax({
            url: "php/turnos_ajax.php",
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
            url: "php/turnos_ajax.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "cargarTurnos"
            },
            success: function(respuesta){
                if (respuesta.error == 0) {
                    /* SI EXISTE UNA DATATABLE DE UNA EJECUCION ANTERIOR DE LA FUNCION "mostrarManipuladores" SE ELIMINA
                    ESA DATATABLE, SI NO SE HACE SE MUESTRA UN ALERT CON UN MENSAJE DE ERROR AL CREARLA DE NUEVO
                    https://datatables.net/manual/tech-notes/3 */
                    if ($.fn.dataTable.isDataTable("#mostrar_turnos")) {
                        tabla.destroy();
                    }
                    $("#mostrar_turnos tbody").empty();
                    for (let index = 0; index < respuesta.datos.length; index++) {
                        $("#mostrar_turnos tbody").append(
                            "<tr>" +
                                "<td scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_turno custom-control-input' id='customCheck" + index + "'><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                "<input type='hidden' value='" + respuesta.datos[index].idturno + "' />" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].franja + "' readonly /></td>" +
                                "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' readonly /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>" +
                                "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' readonly /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>" +
                            "</tr>"
                        );
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
                    $("#mostrar_turnos").css("display", "table");
                } else {
                    console.log(respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para mostrar los turnos: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
            tabla = $('#mostrar_turnos').DataTable({
                paging: false,
                // https://datatables.net/reference/option/order
                order: [[1, "asc"]],
                /* CODIGO PARA ESTABLECER LA CABECERA DE TABLA FIJA COMENTADO HASTA QUE SOLUCIONEN EL PROBLEMA
                   DE INCOMPATIBILIDAD CON EL SCROLLING EN UNA NUEVA VERSION DE LA EXTENSION "FixedHeader".
                   INFO SOBRE LA INCOMPATIBILIDAD: https://datatables.net/download/compatibility
                   INFO SOBRE LA EXTENSION: https://datatables.net/reference/option/fixedHeader */
                    /* fixedHeader: {
                        header: true,
                        // https://datatables.net/forums/discussion/30576/how-to-reanchor-fixedheader-or-how-to-change-headeroffset
                        headerOffset: $('.sticky-top').height(),
                    }, */
                language: {
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                columnDefs: [
                    // https://datatables.net/forums/discussion/21164/disable-sorting-of-one-column
                    {
                        "orderable": false,
                        "targets": "no_ordenable"
                    },
                    // https://datatables.net/reference/option/columns.searchable
                    {
                        "searchable": false,
                        "targets": 0
                    },
                    // https://datatables.net/reference/option/columns.type
                    {
                        "type": "tempusdominus-hour",
                        "targets": [2, 3]
                    },
                    {
                        "type": "html-input",
                        "targets": 1
                    },
                    {
                        /* ESPECIFICA QUE FUNCION DE ORDENACION PARA DATATABLES DEBE USAR PARA LAS COLUMNAS "targets" ESPECIFICADAS
                           https://stackoverflow.com/questions/11376469/can-datatables-sort-a-column-with-an-input-field */
                        "orderDataType": "tempusdominus-date-ordering",
                        "targets": [2, 3]
                    }
                ]
            });
            /* EVENTOS PARA ACTUALIZAR LOS ATRIBUTOS "value" DE LOS <input> PARA QUE AL CAMBIARSELE
               EL VALOR Y JUSTO DESPUES EFECTUAR UNA BUSQUEDA SE LEAN LOS NUEVOS VALORES 
               https://stackoverflow.com/questions/27852497/jquery-datatables-search-within-input-and-select */
            $("#mostrar_descansos tbody td:nth-child(9) input").on('change', function() {
                var td = $(this).parent();
                td.find('input').attr('value', this.value);
                tabla.cell(td).invalidate().draw();
            });
        });
    }

    function editarTurnos(){
        var array = [];
        $(".selec_turno:checked").closest("tr").each(function(){
            var temp = {
                "idturno": $(this).children("input").val(),
                "franja": $(this).find("td:nth-child(3) input").val(),
                "hora_inicio": $(this).find("td:nth-child(4) > div").datetimepicker('date').format('LT'),
                "hora_fin": $(this).find("td:nth-child(5) > div").datetimepicker('date').format('LT')
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/turnos_ajax.php",
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
                "idturno": $(this).children("input").val()
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/turnos_ajax.php",
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