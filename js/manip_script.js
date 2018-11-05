$(function(){
/* -------------------------------------------------- COMPROBACIONES INICIALES --------------------------------------------------*/
    /* COMPROBACION INICIAL EXISTENCIA DE DATOS EN 'manipuladores'.
       SI EXISTEN SE MUESTRA LA TABLA, SI NO, SE MUESTRA UN MENSAJE */
    $.ajax({
        url: "php/manipuladores_ajax.php",
        type: "post",
        dataType: "json",
        data: {
            accion: "exist_datos_manip",
        },
        success: function(respuesta){
            if (respuesta.error == 1) {
                console.log(respuesta.mensaje);
            } else {
                if (parseInt(respuesta.respuesta) == 1) {
                    mostrarManipuladores();
                } else {
                    $("#mensaje_manip").css("display", "block").text("No hay datos en 'manipuladores'");
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los manipuladores: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    });
/* ----------------------------------------------------------- EVENTOS ------------------------------------------------------------- */
    /* GUARDAR MANIPULADOR
       AL PULSAR EL BOTON DE GUARDAR SE OCULTA EL MODAL, SE LIMPIAN LOS INPUTS DE DATOS Y SE AÑADE A LA BD UN MANIPULADOR NUEVO */
    $("#guardar_nuevo_manip_btn").click(function(){
        $("#modal_anyadir_manip").modal('hide');
        anyadirManipulador();
    });

    /* EDITAR MANIPULADOR/ES
       ENVIA A LA BD LOS DATOS DE LOS MANIPULADORES EDITABLES */
    $("#guardar_cambios_btn").click(function(){
        editarManipuladores();
    });

    /* CONFIRMAR BORRAR MANIPULADOR/ES
       AL PULSAR SOBRE CONFIRMAR BORRADO SE OCULTA EL MODAL Y SE LIMPIA EL CONTENIDO DE DATOS DEL MODAL */
    $("#borrar_manip_btn").click(function(){
        $("#modal_confirm_borrar_manip").modal('hide');
        $("#mensaje_confirm_borrar_manip").empty();
        eliminarManipuladores();
    });

    /* AL MOSTRAR EL MODAL DE CONFIRMAR BORRAR MANIPULADOR/ES SE AÑADE LA PREGUNTA EN LA VENTANA MODAL
       EL SELECTOR APUNTA AL ID DEL <div> QUE CONTIENE DICHA VENTANA MODAL Y EL EVENTO ES DE BOOTSTRAP:
       https://getbootstrap.com/docs/4.1/components/modal/#events */
    $("#modal_confirm_borrar_manip").on('show.bs.modal', function(){
        var elementos = $(".selec_manip:checked").closest("tr");
        if (elementos.length > 1) {
            $("#mensaje_confirm_borrar_manip").html("<p>¿Realmente desea borrar estos " + elementos.length + " trabajadores?: </p>");
            elementos.each(function(){
                $("#mensaje_confirm_borrar_manip").append("<p>" + $(this).find("td:nth-child(3) input").val() + " " + $(this).find("td:nth-child(4) input").val() + "</p>") ;
            });
        } else {
            $("#mensaje_confirm_borrar_manip").text("¿Realmente desea borrar a " + elementos.find("td:nth-child(3) input").val() + " " + elementos.find("td:nth-child(4) input").val() + "?");
        }
    });

    /* ARREGLO PARA MOSTRAR DESACTIVADO EL BOTON DE GUARDAR MANIPULADOR AL CARGAR LA VENTANA MODAL
       (CON EL ATRIBUTO "disabled" EN LA ETIQUETA NO FUNCIONA) */
    $('#modal_anyadir_manip').on('show.bs.modal', function (){
        $("#guardar_nuevo_manip_btn").prop("disabled", true);
    });

    /* ARREGLO PARA QUE CUALQUIERA DE LOS MODALES GANE EL FOCUS DESPUES DE MOSTRARSE
       (BOOTSTRAP 4.1.3 NO DA EL FOCUS AL MODAL AUTOMATICAMENTE)
       EL SELECTOR APUNTA A LOS ID'S DE TODOS LOS MODALES EN EL DOCUMENTO Y EL EVENTO ES DE BOOTSTRAP:
       https://getbootstrap.com/docs/4.1/components/modal/#events */
    $('#modal_anyadir_manip, #aviso_borrar_btn').on('shown.bs.modal', function(){
        $(this).trigger('focus');
    });

    /* CADA VEZ QUE SE ESCRIBE EN ALGUNO DE LOS INPUTS DE DATOS DE NUEVO TRABAJADOR
       SE COMPRUEBA QUE LOS INPUTS OBLIGATORIOS CONTENGAN UN DATO.
       SI HAY ALGUNO QUE NO CONTENGA UN CARACTER EL BOTON PARA AÑADIR NO SE ACTIVA */
       $("#add_manip").find("input[type='text']").keyup(function(){
        var inputsVacios = false;
        $("#nombre, #apellidos, #dni").each(function(){
            if (!$(this).val()) {
                inputsVacios = true;
            }
        });
        if (!inputsVacios) {
            $("#guardar_nuevo_manip_btn").prop("disabled", false);
        } else {
            $("#guardar_nuevo_manip_btn").prop("disabled", true);
        }
    });

    /* CADA VEZ QUE SE SELECCIONA-DESELECCIONA UN CHECKBOX SE ACTIVA O DESACTIVA LA EDICION DE DATOS PARA LOS INPUT DE ESA FILA
       EL EVENTO ES FIJADO MANUALMENTE A SU ELEMENTO ESTATICO PADRE MAS CERCANO: <table id="mostrar_manip">
       https://stackoverflow.com/questions/13418963/jquery-onchange-function-not-triggering-for-dynamically-created-inputs */
    $("#mostrar_manip").on("change", ".selec_manip", function(){
        if ($(".selec_manip:checked").length > 0) {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "block");
        } else {
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        }
        var isChecked = $(this).prop("checked");
        $(this).closest("td").siblings().each(function(){
            if (isChecked){
                if ($(this).children().prop("tagName") === "INPUT") {
                    $(this).children().prop("readonly", false);
                } else {
                    $(this).children().prop("disabled", false);
                }
                $(this).parent().css('background-color','#FFE189')    
            } else {
                if ($(this).children().prop("tagName") === "INPUT") {
                    $(this).children().prop("readonly", true);
                } else {
                    $(this).children().prop("disabled", true);
                }
                $(this).parent().css('background-color','')   
            }
        });
    });
/* ---------------------------------------------------------------- FUNCIONES ------------------------------------------------------------ */
    function mostrarManipuladores(){
        $.ajax({
            url: "php/manipuladores_ajax.php",
            type: "post",
            dataType : "json",
            data: {
                accion: "cargarManip"
            },
            success: function(respuesta){
                if (respuesta.error == 0) {
                    /* SI EXISTE UNA DATATABLE DE UNA EJECUCION ANTERIOR DE LA FUNCION "mostrarManipuladores" SE ELIMINA
                    ESA DATATABLE, SI NO SE HACE SE MUESTRA UN ALERT CON UN MENSAJE DE ERROR AL CREARLA DE NUEVO
                    https://datatables.net/manual/tech-notes/3 */
                    if ($.fn.dataTable.isDataTable("#mostrar_manip")) {
                        tabla.destroy();
                        // DESASIGNACION DEL EVENTO "change" PARA LOS ELEMENTOS "input" Y "select"
                        $("#mostrar_manip tbody td input, #mostrar_manip tbody td select").off("change");
                    }
                    $("#mostrar_manip tbody").empty();
                    for (let index = 0; index < respuesta.datos.length; index++) {
                        $("#mostrar_manip tbody").append(
                            "<tr>" +
                                "<td scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_manip custom-control-input' id='customCheck" + index + "'><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                "<input type='hidden' value='" + respuesta.datos[index].idmanipulador + "' />" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].nombre + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].apellidos + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].dni + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].telefono + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].direccion + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].dias_seguidos_trabajados + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].email + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].tlf_familiar + "' readonly /></td>" +
                                "<td id='td_fiabilidad_" + index + "'></td>" +
                                "<td id='td_velocidad_" + index + "'></td>" +
                                "<td id='td_disponibilidad_" + index + "'></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].observaciones + "' readonly /></td>" +
                            "</tr>"
                        );
                        var select_fiabilidad = $("<select id='fiabilidad_" + index + "' class='form-control' disabled></select>");
                        var select_velocidad = $("<select id='velocidad_" + index + "' class='form-control' disabled></select>");
                        var select_disponibilidad = $("<select id='disponibilidad_" + index + "' class='form-control' disabled></select>");
                        for (let i = 0; i <= 9; i++) {
                            if (i == respuesta.datos[index].fiabilidad) {
                                select_fiabilidad.append("<option value='" + i + "' selected>" + i + "</option");
                            } else {
                                select_fiabilidad.append("<option value='" + i + "'>" + i + "</option");
                            }
                            if (i == respuesta.datos[index].velocidad) {
                                select_velocidad.append("<option value='" + i + "' selected>" + i + "</option");
                            } else {
                                select_velocidad.append("<option value='" + i + "'>" + i + "</option");
                            }
                            if (i == respuesta.datos[index].disponibilidad) {
                                select_disponibilidad.append("<option value='" + i + "' selected>" + i + "</option");
                            } else {
                                select_disponibilidad.append("<option value='" + i + "'>" + i + "</option");
                            }
                        }
                        select_fiabilidad.appendTo("#td_fiabilidad_" + index);
                        select_velocidad.appendTo("#td_velocidad_" + index);
                        select_disponibilidad.appendTo("#td_disponibilidad_" + index);
                    }
                    $("#mostrar_manip").css("display", "table");
                } else {
                    console.log(respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para mostrar: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
            /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
               DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
               CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
               QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
            tabla = $('#mostrar_manip').DataTable({
                // https://datatables.net/reference/option/order
                order: [[2, "asc"]],
                // https://datatables.net/reference/option/fixedHeader
                fixedHeader: {
                    header: true,
                    // https://datatables.net/forums/discussion/30576/how-to-reanchor-fixedheader-or-how-to-change-headeroffset
                    headerOffset: $('.sticky-top').height(),
                },
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
                    { "type": "html-input", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
                ]
            });
            /* EVENTOS PARA ACTUALIZAR LOS ATRIBUTOS "value" Y "selected" DE LOS <input> Y <select> PARA QUE
               AL CAMBIARSELE EL VALOR Y JUSTO DESPUES EFECTUAR UNA BUSQUEDA SE LEAN LOS NUEVOS VALORES 
               https://stackoverflow.com/questions/27852497/jquery-datatables-search-within-input-and-select */
            $("#mostrar_manip tbody td input").on('change', function() {
                var td = $(this).parent();
                td.find('input').attr('value', this.value);
                tabla.cell(td).invalidate().draw();
            });
            $("#mostrar_manip tbody td select").on('change', function() {
                var td = $(this).parent();
                var value = this.value;
                td.find('option').each(function(index, object) {
                    $(object).removeAttr('selected');
                    if ($(object).val() == value){
                        $(object).attr('selected', true);
                    }
                });
                tabla.cell(td).invalidate().draw();
            });
        });
    }

    function anyadirManipulador(){
        $.ajax({
            url: "php/manipuladores_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: 'anyadirManip',
                datos: JSON.stringify({
                    nombre: $("#nombre").val(),
                    apellidos: $("#apellidos").val(),
                    dni: $("#dni").val(),
                    telefono: $("#telefono").val(),
                    direccion: $("#direccion").val(),
                    email: $("#email").val(),
                    tlf_familiar: $("#tlf_familiar").val(),
                    fiabilidad: $("#fiabilidad").val(),
                    velocidad: $("#velocidad").val(),
                    disponibilidad: $("#disponibilidad").val(),
                    observaciones: $("#observaciones").val()
                })
            },
            success: function(respuesta){
                if (respuesta.error == 1) {
                    console.log("Error en php: " + respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para añadir: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            $("#add_manip input").val("");
            mostrarManipuladores();
        });
    }

    function editarManipuladores(){
        var array = [];
        $(".selec_manip:checked").closest("tr").each(function(){
            var temp = {
                "id": $(this).children("input").val(),
                "nombre": $(this).find("td:nth-child(3) input").val(),
                "apellidos": $(this).find("td:nth-child(4) input").val(),
                "dni": $(this).find("td:nth-child(5) input").val(),
                "telefono": $(this).find("td:nth-child(6) input").val(),
                "direccion": $(this).find("td:nth-child(7) input").val(),
                "dst": $(this).find("td:nth-child(8) input").val(),
                "email": $(this).find("td:nth-child(9) input").val(),
                "tlf_familiar": $(this).find("td:nth-child(10) input").val(),
                'fiabilidad': $(this).find("td:nth-child(11) select").val(),
                'velocidad': $(this).find("td:nth-child(12) select").val(),
                'disponibilidad': $(this).find("td:nth-child(13) select").val(),
                'observaciones': $(this).find("td:nth-child(14) input").val()
            };
            // https://stackoverflow.com/questions/43361864/how-to-push-json-object-in-to-array-using-javascript/43362428
            array.push(temp);
        });
        $.ajax({
            url: "php/manipuladores_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: "editarManip",
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
                mostrarManipuladores();
        });
    }

    function eliminarManipuladores(){
        var array = [];
        $(".selec_manip:checked").closest("tr").each(function(){
            var temp = {
                "id": $(this).children("input").val()
            };
            array.push(temp);
        });
        $.ajax({
            url: "php/manipuladores_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: "borrarManip",
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
            mostrarManipuladores();
        });
    }

    function esNumerico(valor) {
        return !isNaN(parseFloat(valor)) && isFinite(valor);
    }
});