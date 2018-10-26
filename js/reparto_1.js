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
    });

    $("#repartir").click(function(){
        var texto = "";
        $("#mostrar_opciones_lineas tbody td:nth-child(7)").each(function(){
            texto += "puestos maximos = " + $(this).prev().find("select").val() + "\n";
            texto += "fiabilidad = " + $(this).find("div:nth-child(1) select").val() + ", velocidad = " + $(this).find("div:nth-child(2) select").val() + ", disponibilidad = " + $(this).find("div:nth-child(3) select").val() + "\n";
        });
        console.log(texto);
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
                                                                    "<td class='align-middle' scope='row'><div class='form-check'><input type='checkbox' class='form-check-input selec_linea' /></div></td>" +
                                                                    "<td class='align-middle'><input type='text' class='form-control' value='" + respuesta.datos[index].designacion + "' readonly /></td>" +
                                                                    "<td class='align-middle'><input type='text' class='form-control' value='" + respuesta.datos[index].idlinea + "' readonly /></td>" +
                                                                    "<td class='align-middle'><input type='text' class='form-control' value='" + respuesta.datos[index].nombre_de_linea + "' readonly /></td>" +
                                                                    "<td class='align-middle'><input type='text' class='form-control' value='" + respuesta.datos[index].nombre_de_tipolinea + "' readonly /></td>" +
                                                                    "<td class='align-middle'>" +
                                                                        "<div class='form-group'>" +
                                                                            "<label for='puestos_maximos_" + index + "'></label>" +
                                                                        "</div>" +
                                                                    "<td class='align-middle'>" +
                                                                        "<div class='form-group'>" +
                                                                            "<label for='fiabilidad_" + index + "'>Preferencia de Fiabilidad: </label>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<label for='velocidad_" + index + "'>Preferencia de Velocidad: </label>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<label for='disponibilidad_" + index + "'>Preferencia de Disponibilidad: </label>" +
                                                                        "</div>" +
                                                                    "</td>" +
                                                                "</tr>"
                    );
                    var select_puestos_maximos = $("<select id='puestos_maximos_" + index + "' class='form-control' disabled></select>");
                    var select_fiabilidad = $("<select id='fiabilidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_velocidad = $("<select id='velocidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_disponibilidad = $("<select id='disponibilidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    for (let i = 0; i <= respuesta.datos[index].puestos_maximos; i++) {
                        select_puestos_maximos.append("<option value='" + i + "'>" + i + "</option>");
                    }
                    select_puestos_maximos.val(respuesta.datos[index].puestos_maximos).insertAfter("label[for='puestos_maximos_" + index + "']");
                    for (let i = 0; i <= 9; i++) {
                        select_fiabilidad.append("<option value='" + i + "'>" + i + "</option>");
                        select_velocidad.append("<option value='" + i + "'>" + i + "</option>");
                        select_disponibilidad.append("<option value='" + i + "'>" + i + "</option>");
                    }
                    select_fiabilidad.val(respuesta.datos[index].fiabilidad).insertAfter("label[for='fiabilidad_" + index + "']");
                    select_velocidad.val(respuesta.datos[index].velocidad).insertAfter("label[for='velocidad_" + index + "']");
                    select_disponibilidad.val(respuesta.datos[index].disponibilidad).insertAfter("label[for='disponibilidad_" + index + "']");
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para cargar las opciones de lineas: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        });
        
    }
});