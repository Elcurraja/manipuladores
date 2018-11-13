$(function(){
    $.ajax({
        url: "php/reparto_ajax.php",
        type: "post",
        dataType: "json",
        data: {
            accion: "exist_datos_lineas"
        },
        success: function(respuesta){
            if (respuesta.error == 1) {
                console.log(respuesta.mensaje);
            } else {
                if (respuesta.respuesta == 1) {
                    mostrarOpcionesLineas();
                } else {
                    $("#mensaje_opciones_lineas").css("display", "block").text("No hay datos en 'lineas'");
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para comprobar si existen lineas: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    });

    $("#mostrar_opciones_lineas").on("change", ".selec_linea", function(){
        //console.log($(this).prop("tagName"));
        var isChecked = $(this).prop("checked");
        $(this).closest("tr").find("td:nth-child(7) div:nth-child(1), td:nth-child(7) div:nth-child(2), td:nth-child(7) div:nth-child(3)").each(function(){
            if (isChecked){
                // https://stackoverflow.com/questions/1306708/how-to-add-a-readonly-attribute-to-an-input
                $(this).closest("tr").find("td:nth-child(6) select").prop("disabled", false);
                $(this).find("select").prop("disabled", false);
                $(this).closest("tr").css('background-color','#FFE189');
            } else {
                $(this).closest("tr").find("td:nth-child(6) select").prop("disabled", true);
                $(this).find("select").prop("disabled", true);
                $(this).closest("tr").css('background-color','');  
            }
        });
        $(this).closest("tr").find("td:nth-child(7) input[type='checkbox'], td:nth-child(8) input[type='radio']").each(function(){
            if (isChecked){
                $(this).prop("disabled", false);
            } else {
                $(this).prop("disabled", true);
            }
            
        });
    });

    $("#repartir").click(function(){
        var array = [];
        $("#mostrar_opciones_lineas tbody td:nth-child(7)").each(function(){
            var idlinea = $(this).siblings("input").val();
            var puestos_cubrir = $(this).prev().find("select").val();
            var fiabilidad = $(this).find("div:nth-child(1) input[type='checkbox']").prop("checked");
            var velocidad = $(this).find("div:nth-child(2) input[type='checkbox']").prop("checked");
            var disponibilidad = $(this).find("div:nth-child(3) input[type='checkbox']").prop("checked");
            var orden_fiabilidad = $("input[name='ordenacion_fiabilidad_" + idlinea + "']:checked").val();
            var orden_velocidad = $("input[name='ordenacion_velocidad_" + idlinea + "']:checked").val();
            var orden_disponibilidad = $("input[name='ordenacion_disponibilidad_" + idlinea + "']:checked").val();

            var temp = {
                "id_linea": idlinea,
                "puestos_max":parseInt(puestos_cubrir),
                "Fiabilidad":fiabilidad,
                "Velocidad":velocidad,
                "Disponibilidad":disponibilidad,
                "ordenFiabilidad":orden_fiabilidad,
                "ordenVelocidad":orden_velocidad,
                "ordenDisponibilidad":orden_disponibilidad,
            };
            array.push(temp);
        });
        repartoLineas(array)
        console.log(array)
    });

    function mostrarOpcionesLineas(){
        $.ajax({
            url: "php/reparto_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: "cargarLineas"
            },
            success: function(respuesta){
                for (let index = 0; index < respuesta.datos.length; index++) {
                    $("#mostrar_opciones_lineas tbody").append( "<tr>" +
                                                                    "<td class='align-middle' scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_linea custom-control-input' id='customCheck" + index + "' /><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].designacion + "</span></td>" +
                                                                    "<input type='hidden' value='" + respuesta.datos[index].idlinea + "' />" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].nombre_de_linea + "</span></td>" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].nombre_de_tipolinea + "</span></td>" +
                                                                    "<td id='td_puestos_maximos_" + index + "' class='align-middle'></td>" +
                                                                    "<td class='align-middle'>" +
                                                                        "<div class='form-group'>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='checkbox' value='fiabilidad' id='fiabilidad_" + respuesta.datos[index].idlinea + "' disabled />" +
                                                                                "<label class='form-check-label' for='fiabilidad_" + respuesta.datos[index].idlinea + "'>Fiabilidad</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='checkbox' value='velocidad' id='velocidad_" + respuesta.datos[index].idlinea + "' disabled />" +
                                                                                "<label class='form-check-label' for='velocidad_" + respuesta.datos[index].idlinea + "'>Velocidad</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='checkbox' value='disponibilidad' id='disponibilidad_" + respuesta.datos[index].idlinea + "' disabled />" +
                                                                                "<label class='form-check-label' for='disponibilidad_" + respuesta.datos[index].idlinea + "'>Disponibilidad</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                    "</td>" +
                                                                    "<td class='align-middle'>" +
                                                                        "<div class='form-group'>" +
                                                                            "<span>Fiables: </span>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_delante_" + respuesta.datos[index].idlinea + "' value='fiabilidad_delante' disabled />" +
                                                                                "<label class='form-check-label' for='fiabilidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_detras_" + respuesta.datos[index].idlinea + "' value='fiabilidad_detras' disabled />" +
                                                                                "<label class='form-check-label' for='fiabilidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_indiferente_" + respuesta.datos[index].idlinea + "' value='fiabilidad_indiferente' checked='checked' disabled />" +
                                                                                "<label class='form-check-label' for='fiabilidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<span>Veloces: </span>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_delante_" + respuesta.datos[index].idlinea + "' value='velocidad_delante' disabled />" +
                                                                                "<label class='form-check-label' for='velocidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_detras_" + respuesta.datos[index].idlinea + "' value='velocidad_detras' disabled />" +
                                                                                "<label class='form-check-label' for='velocidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_infiferente_" + respuesta.datos[index].idlinea + "' value='velocidad_indiferente' checked='checked' disabled />" +
                                                                                "<label class='form-check-label' for='velocidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<span>Disponibles: </span>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_delante_" + respuesta.datos[index].idlinea + "' value='disponibilidad_delante' disabled />" +
                                                                                "<label class='form-check-label' for='disponibilidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_detras_" + respuesta.datos[index].idlinea + "' value='disponibilidad_detras' disabled />" +
                                                                                "<label class='form-check-label' for='disponibilidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_indiferente_" + respuesta.datos[index].idlinea + "' value='disponibilidad_indiferente' checked='checked' disabled />" +
                                                                                "<label class='form-check-label' for='disponibilidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                    "</td>" +
                                                                "</tr>"
                    );
                    /*var select_fiabilidad = $("<select id='fiabilidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_velocidad = $("<select id='velocidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_disponibilidad = $("<select id='disponibilidad_" + index + "' class='form-control form-control-sm' disabled></select>");*/

                    var select_puestos_maximos = $("<select id='puestos_maximos_" + index + "' class='form-control' disabled></select>");
                    for (let i = 0; i <= respuesta.datos[index].puestos_maximos; i++) {
                        select_puestos_maximos.append("<option value='" + i + "'>" + i + "</option>");
                    }
                    select_puestos_maximos.val(respuesta.datos[index].puestos_maximos).appendTo("#td_puestos_maximos_" + index);
                    if (respuesta.datos[index].fiabilidad == 1) {
                        $("#fiabilidad_" + respuesta.datos[index].idlinea).prop("checked", true);
                    }
                    if (respuesta.datos[index].velocidad == 1) {
                        $("#velocidad_" + respuesta.datos[index].idlinea).prop("checked", true);
                    }
                    if (respuesta.datos[index].disponibilidad == 1) {
                        $("#disponibilidad_" + respuesta.datos[index].idlinea).prop("checked", true);
                    }
                    /* for (let i = 0; i <= 9; i++) {
                        select_fiabilidad.append("<option value='" + i + "'>" + i + "</option>");
                        select_velocidad.append("<option value='" + i + "'>" + i + "</option>");
                        select_disponibilidad.append("<option value='" + i + "'>" + i + "</option>");
                    }
                    select_fiabilidad.val(respuesta.datos[index].fiabilidad).insertAfter("label[for='fiabilidad_" + index + "']");
                    select_velocidad.val(respuesta.datos[index].velocidad).insertAfter("label[for='velocidad_" + index + "']");
                    select_disponibilidad.val(respuesta.datos[index].disponibilidad).insertAfter("label[for='disponibilidad_" + index + "']"); */
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para cargar las opciones de lineas: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        });
        
    }

    function repartoLineas(array){
        $.ajax({
            url: "php/reparto_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                datosLineas:array,
                accion: "cargarManipuladores"
            },
            success: function(response){
                if (response.error==1){
                    console.log("Codigo de error:"+response.error + " " + response.mensaje)
                }                
            },
            error: function(response,jqXHR, textStatus, errorThrown){
                
                console.log(response.responseText)
                console.log("Error en la peticion AJAX para cargar las opciones de lineas: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        });
    }
});