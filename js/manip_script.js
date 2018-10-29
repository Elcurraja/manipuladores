$(function(){
/* -------------------------------------------------- COMPRORBACIONES INICIALES --------------------------------------------------*/
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
                    // https://stackoverflow.com/questions/10782054/what-does-the-tilde-squiggle-twiddle-css-selector-mean
                    $("#mostrar_manip tbody tr").remove();
                    for (let index = 0; index < respuesta.datos.length; index++) {
                        $("#mostrar_manip tbody").append(
                            "<tr>" +
                                "<td scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_manip custom-control-input' id='customCheck" + index + "'><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                "<input type='hidden' value='" + respuesta.datos[index].idmanipulador + "' />" +
                                "<td><input type='text' class='form-control' value='" +  respuesta.datos[index].nombre + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].apellidos + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].dni + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].telefono + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].direccion + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].dias_seguidos_trabajados + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].email + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].tlf_familiar + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].fiabilidad + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].velocidad + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].disponibilidad + "' readonly /></td>" +
                                "<td><input type='text' class='form-control' value='" + respuesta.datos[index].observaciones + "' readonly /></td>" +
                            "</tr>"
                        );
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
        });
    }

    function anyadirManipulador(){
        if(!esNumerico($("#fiabilidad").val()) || $("#fiabilidad").val().length < 1){
            var fiabilidad = 0;
        } else {
            var fiabilidad = $("#fiabilidad").val();
        }
        if(!esNumerico($("#velocidad").val()) || $("#velocidad").val().length > 1){
            var velocidad = 0;
        } else {
            var velocidad = $("#velocidad").val();
        }
        if (!esNumerico($("#disponibilidad").val()) || $("#disponibilidad").val().length > 1) {
            var disponibilidad = 0;
        } else {
            var disponibilidad = $("#disponibilidad").val()
        }
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
                    fiabilidad: fiabilidad,
                    velocidad: velocidad,
                    disponibilidad: disponibilidad,
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
            if(!esNumerico($(this).find("td:nth-child(11) input").val()) || $(this).find("td:nth-child(11) input").val().length > 1){
                var fiabilidad = 0;
            } else {
                var fiabilidad = $(this).find("td:nth-child(11) input").val();
            }
            if(!esNumerico($(this).find("td:nth-child(12) input").val()) || $(this).find("td:nth-child(12) input").val().length > 1){
                var velocidad = 0;
            } else {
                var velocidad = $(this).find("td:nth-child(12) input").val();
            }
            if (!esNumerico($(this).find("td:nth-child(13) input").val()) || $(this).find("td:nth-child(13) input").val().length > 1) {
                var disponibilidad = 0;
            } else {
                var disponibilidad = $(this).find("td:nth-child(13) input").val()
            }
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
                'fiabilidad': fiabilidad,
                'velocidad': velocidad,
                'disponibilidad': disponibilidad,
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
                "id": $(this).find("td:nth-child(2) input").val()
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