$(function(){
    /* A PESAR DE QUE DATATABLES TIENE UN METODO (SUPUESTAMENTE) INTELIGENTE PARA ADIVINAR QUE CONTENIDO HTML HAY
       DENTRO DE LAS CELDAS Y PODER ASI EXTRAER LOS DATOS PARA LA BUSQUEDA DE DATATABLE, ES RECOMENDABLE ESTABLECERLO
       MANUALMENTE SI SE SABE QUE CONTENIDO VA A TENER. SE ESTABLECE EL TIPO "type" DE COLUMNA A "html-input"
       PARA QUE PUEDA LEER LOS DATOS DE LOS <input> DE LA COLUMNA ESPECIFICADA AL INICIAR DATATABLE */
    /* TIPO "tempusdominus-date" PARA PODER HACER BUSQUEDAS POR FECHAS. SI SE USA EL PROPIO ELEMENTO PARA OBTENER
       EL VALOR DE LA FECHA DA ERROR ("Cannot read property 'format' of null") PERO USANDOLO POR SU ID NO */
    $.fn.dataTableExt.ofnSearch['tempusdominus-date'] = function(value) {
        var id = $(value).attr("id");
        var data = $("#" + id).datetimepicker('date').format("DD-MM-YYYY");
        return data;
    };
    $.fn.dataTable.moment( 'DD-MM-YYYY' );
    /* -------------------------------------------------- COMPROBACIONES INICIALES --------------------------------------------------*/
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
    /* ----------------------------------------------------------- EVENTOS ------------------------------------------------------------- */

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
       EL SELECTOR APUNTA A LOS DOS INPUTS DE FECHA Y LOS DOS EVENTOS SON DE TEMPUS DOMINUS
       https://tempusdominus.github.io/bootstrap-4/Events/ */
        $("#fecha_inicio, #fecha_fin").on("change.datetimepicker show.datetimepicker", function(){
            try {
                if ($("#idmanipulador").val() && $("#tipo_descanso").val() && $("#fecha_inicio").datetimepicker('date').format("YYYY-MM-DD") && $("#fecha_fin").datetimepicker('date').format("YYYY-MM-DD")) {
                    $("#guardar_nuevo_descanso_btn").prop("disabled", false);
                    $("#mensaje_anyadir_descanso").empty();
                } else {
                    $("#guardar_nuevo_descanso_btn").prop("disabled", true);
                }
            } catch (error) {
                console.log("Error: " + error.message);
                $("#guardar_nuevo_descanso_btn").prop("disabled", true);
            }
    });
    // EVENTO CAPTURADO DESDE UN LANZAMIENTO MANUAL (LINEA 213) EN EL CODIGO JAVASCRIPT DEL DOCUMENTO PHP
    $("#idmanipulador").change(function(){
        try {
            if ($(this).val() && $("#tipo_descanso").val() && $("#fecha_inicio").datetimepicker('date').format("YYYY-MM-DD") && $("#fecha_fin").datetimepicker('date').format("YYYY-MM-DD")) {
                $("#guardar_nuevo_descanso_btn").prop("disabled", false);
                $("#mensaje_anyadir_descanso").empty();
            } else {
                $("#guardar_nuevo_descanso_btn").prop("disabled", true);
            }
        } catch (error) {
            console.log("Error: " + error.message);
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
        }
    });

    /* EVENTO PARA COMPROBAR SI TODOS LOS INPUTS DEL MODAL AÑADIR DESCANSO CONTIENEN UN DATO
       SE COMPRUEBA CADA VEZ QUE SE ESCRIBE ALGO EN EL CAMPO "Tipo de descanso" */
       $("#tipo_descanso").on("keyup", function(){
        try {
            if ($("#idmanipulador").val().length != 0 && $(this).val() && $("#fecha_inicio").datetimepicker('date').format("YYYY-MM-DD") && $("#fecha_fin").datetimepicker('date').format("YYYY-MM-DD")) {
                $("#guardar_nuevo_descanso_btn").prop("disabled", false);
                $("#mensaje_anyadir_descanso").empty();
            } else {
                $("#guardar_nuevo_descanso_btn").prop("disabled", true);
            }
        } catch (error) {
            console.log("Error: " + error.message);
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
        var estaVacio = false;
        try {
            if (!$("#idmanipulador").val() || !$("#tipo_descanso").val() || !$("#fecha_inicio").datetimepicker('date').format("YYYY-MM-DD") || !$("#fecha_fin").datetimepicker('date').format("YYYY-MM-DD")) {
                estaVacio = true;
            }
        } catch (error) {
            console.log("Error: " + error.message);
            estaVacio = true;
        }
        if (!estaVacio) {
            $("#mensaje_anyadir_descanso").empty();
            anyadirDescanso();
        } else {
            $("#guardar_nuevo_descanso_btn").prop("disabled", true);
            $("#mensaje_anyadir_descanso").text("Todos los campos deben tener algún dato");
        }
    });

    /* GUARDAR CAMBIOS
       COMPRUEBA QUE TODOS LOS INPUTS CONTENGAN UN DATO ANTES DE PASARLOS POR AJAX */
    $("#guardar_cambios_btn").click(function(){
        var estaVacio = false;
        try {
            $(".selec_descanso:checked").closest("tr").each(function(){
                if(!$(this).find("td:nth-child(7) > div").datetimepicker('date').format("YYYY-MM-DD") || !$(this).find("td:nth-child(8) > div").datetimepicker('date').format("YYYY-MM-DD") || !$(this).find("td:nth-child(9) input").val()){
                    estaVacio = true;
                }
            });
        } catch (error) {
            console.log("Error: " + error.message);
            estaVacio = true;
        }
        if (!estaVacio) {
            editarDescansos();
        } else {
            mostrarDescansos();
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

    // BORRADO DE COLUMNA/S
    $("#borrar_descansos_btn").click(function(){
        $("#modal_confirm_borrar_descansos").modal('hide');
        $("#mensaje_confirm_borrar_descansos").empty();
        eliminarDescansos();
    });

    /* COMPROBACION PARA LOS CHECKBOXES PARA ACTIVAR LOS BOTONES DE EDICION Y BORRADO
       EL EVENTO SE FIJA AL PADRE ESTATICO MAS CERCANO PERO APUNTA A LA CLASE DEL CHECKBOX */
    $("#mostrar_descansos").on("change", ".selec_descanso", function(){
        if ($(".selec_descanso:checked").length > 0) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "block");
        } else {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        }
        
        var isChecked = $(this).prop("checked");
        $(this).closest("td").siblings("td:gt(2)").each(function(){
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

    /* ---------------------------------------------------------------- FUNCIONES ------------------------------------------------------------ */

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
                    /* SI EXISTE UNA DATATABLE DE UNA EJECUCION ANTERIOR DE LA FUNCION "mostrarManipuladores" SE ELIMINA
                    ESA DATATABLE, SI NO SE HACE SE MUESTRA UN ALERT CON UN MENSAJE DE ERROR AL CREARLA DE NUEVO
                    https://datatables.net/manual/tech-notes/3 */
                    if ($.fn.dataTable.isDataTable("#mostrar_descansos")) {
                        tabla.destroy();
                        // DESASIGNACION DEL EVENTO "change" PARA LOS "<input>"
                        $("#mostrar_descansos tbody td:nth-child(9) input").off("change");
                    }
                    $("#mostrar_descansos tbody").empty();
                    for (let index = 0; index < respuesta.datos.length; index++){
                        $("#mostrar_descansos tbody").append(
                            "<tr>" +
                                "<td scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_descanso custom-control-input' id='customCheck" + index + "'><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                "<input type='hidden' value='" + respuesta.datos[index].iddescanso + "' />" +
                                "<input type='hidden' value='" + respuesta.datos[index].idmanipulador + "' />" +
                                "<td><span>" + respuesta.datos[index].nombre + "</span></td>" +
                                "<td><span>" + respuesta.datos[index].apellidos + "</span></td>" +
                                "<td><span>" + respuesta.datos[index].dni + "</span></td>" +
                                "<td><div class='input-group date' id='fecha_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_inicio_" + index + "' readonly /><div class='input-group-append' data-target='#fecha_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>" +
                                "<td><div class='input-group date' id='fecha_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_fin_" + index + "' readonly /><div class='input-group-append' data-target='#fecha_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].tipo + "' readonly /></td>" +
                            "</tr>"
                        );
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
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
            //console.log($("#mostrar_descansos tbody tr:nth-child(1) td:nth-child(7) > div").datetimepicker('date').format('DD-MM-YYYY'));
            /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
               DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
               CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
               QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
            tabla = $('#mostrar_descansos').DataTable({
                // https://datatables.net/reference/option/order
                order: [[2, "asc"]],
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
                    { "orderable": false, "targets": "no_ordenable" },
                    // https://datatables.net/reference/option/columns.searchable
                    { "searchable": false, "targets": 0 },
                    // https://datatables.net/reference/option/columns.type
                    //{ "type": "tempusdominus-date", "targets": [4, 5]},
                    {
                        targets: [6], 
                        render: function(data, type, full, meta){
                                    if(type === 'filter' || type === 'sort'){
                                        var api = new $.fn.dataTable.Api(meta.settings);
                                        var td = api.cell({row: meta.row, column: meta.col}).node();
                                        data = $('input', td).val();
                                    }
                                    return data;
                                }
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
                "iddescanso": $(this).children("input:nth-child(2)").val(),
                "idmanipulador": $(this).children("input:nth-child(3)").val(),
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
                "iddescanso": $(this).children("input:nth-child(2)").val()
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