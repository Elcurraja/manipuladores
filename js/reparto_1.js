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
        var array = [];
        var a = 0
        $("#mostrar_opciones_lineas tbody tr").each(function(){
            console.log(this)
            //console.log($(this).find("td div input#checkFiabilidad"+ a+"").is(":checked"))
            if($(this).find("td div input#switchFiabilidad"+ a+"").is(":checked")==true){
                var ordenFiabilidad = "atras";
            }
            else 
            var ordenFiabilidad= "delante"
            if($(this).find("td div input#switchVelocidad"+ a+"").is(":checked")==true){
                var ordenVelocidad = "atras";
            }
            else 
                var ordenVelocidad= "delante"
            if($(this).find("td div input#switchDisponibilidad"+ a+"").is(":checked")==true){
                var ordenDisponibilidad = "atras";
            }
            else 
                var ordenDisponibilidad= "delante"

            var temp = {
                "id_linea": $(this).children("input").val(),
                "puestos_max":$(this).find("select").val(),
                "opFiablidad":$(this).find("td div input#checkFiabilidad"+ a+"").is(":checked"),
                "opVelocidad":$(this).find("td div input#checkVelocidad"+ a+"").is(":checked"),
                "opDisponibilidad":$(this).find("td div input#checkDisponibilidad"+ a+"").is(":checked"),
                "ordenFiablidad":ordenFiabilidad,
                "ordenVelocidad":ordenVelocidad,
                "ordenDisponibilidad":ordenDisponibilidad,
            };
            array.push(temp);
            // console.log("id linea = " + $(this).siblings("input").val() + "\n" +
            //             "puestos a cubrir = " + $(this).prev().find("select").val() + "\n" +
            //             "fiabilidad = " + $(this).find("div:nth-child(1) select").val() + "\n" +
            //             "velocidad = " + $(this).find("div:nth-child(2) select").val() + "\n" +
            //             "disponibilidad = " + $(this).find("div:nth-child(3) select").val() + "\n");
            a++
        });
        repartoLineas(array)
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
                                                                    "<td class='align-middle' scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input selec_linea custom-control-input' id='customCheck" + index + "'><label class='custom-control-label' for='customCheck" + index + "'></label></div></td>" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].designacion + "</span></td>" +
                                                                    "<input type='hidden' value='" + respuesta.datos[index].idlinea + "' />" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].nombre_de_linea + "</span></td>" +
                                                                    "<td class='align-middle'><span>" + respuesta.datos[index].nombre_de_tipolinea + "</span></td>" +
                                                                    "<td id='td_puestos_maximos_" + index + "' class='align-middle'></td>" +
                                                                    
                                                                    "<td class='align-middle' scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checkFiabilidad" + index + "'><label class='custom-control-label' for='checkFiabilidad" + index + "'>Fiablidad</label></div>"+
                                                                    "<div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checkVelocidad" + index + "'><label class='custom-control-label' for='checkVelocidad" + index + "'>Velocidad</label></div>"+
                                                                    "<div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checkDisponibilidad" + index + "'><label class='custom-control-label' for='checkDisponibilidad" + index + "'>Disponibilidad</label></div></td>"+
                                                                    
                                                                    "<td><div><label class='labelcheck'>Mas fiables</label><span class='switch'>Delante <input type='checkbox' class='switch' id='switchFiabilidad"+ index +"'><label for='switchFiabilidad"+ index +"'> Atras</label></span>" +
                                                                    "<div><label class='labelcheck'>Mas veloces</label><span class='switch'>Delante <input type='checkbox' class='switch' id='switchVelocidad"+ index +"'><label for='switchVelocidad"+ index +"'> Atras</label></span>"+
                                                                    "<div><label class='labelcheck'>Mejor disponibilidad</label><span class='switch'>Delante <input type='checkbox' class='switch' id='switchDisponibilidad"+ index +"'><label for='switchDisponibilidad"+ index +"'> Atras</label></span></td>"+
                                                                    // "<td class='align-middle' scope='row'><div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checkOrdenFiabilidad" + index + "'><label class='custom-control-label' for='checkOrdenFiabilidad" + index + "'>Fiablidad</label></div>"+
                                                                    // "<div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checkOrdenVelocidad" + index + "'><label class='custom-control-label' for='checkOrdenVelocidad" + index + "'>Velocidad</label></div>"+
                                                                    // "<div class='custom-control custom-checkbox'><input type='checkbox' class='form-check-input custom-control-input' id='checOrdenkDisponibilidad" + index + "'><label class='custom-control-label' for='checkOrdenDisponibilidad" + index + "'>Disponibilidad</label></div></td>"+
                                                                    
                                                                    // "<td class='align-middle'>" +
                                                                    //     "<div class='form-group'>" +
                                                                    //         "<label for='fiabilidad_" + index + "'>Preferencia de Fiabilidad: </label>" +
                                                                    //     "</div>" +
                                                                    //     "<div class='form-group'>" +
                                                                    //         "<label for='velocidad_" + index + "'>Preferencia de Velocidad: </label>" +
                                                                    //     "</div>" +
                                                                    //     "<div class='form-group'>" +
                                                                    //         "<label for='disponibilidad_" + index + "'>Preferencia de Disponibilidad: </label>" +
                                                                    //     "</div>" +
                                                                    // "</td>" +
                                                                "</tr>"
                    );
                    console.log()
                    var select_puestos_maximos = $("<select id='puestos_maximos_" + index + "' class='form-control' disabled></select>");
                    var select_fiabilidad = $("<select id='fiabilidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_velocidad = $("<select id='velocidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    var select_disponibilidad = $("<select id='disponibilidad_" + index + "' class='form-control form-control-sm' disabled></select>");
                    for (let i = 0; i <= respuesta.datos[index].puestos_maximos; i++) {
                        select_puestos_maximos.append("<option value='" + i + "'>" + i + "</option>");
                    }
                    select_puestos_maximos.val(respuesta.datos[index].puestos_maximos).appendTo("#td_puestos_maximos_" + index);
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