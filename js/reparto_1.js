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
        $(this).closest("tr").find("td:nth-child(7) input[type='checkbox']"/*, td:nth-child(8) input[type='radio']"*/).each(function(){
            if (isChecked){
                $(this).prop("disabled", false);
            } else {
                $(this).prop("disabled", true);
            }
            
        });
    });

    $("#repartir").click(function(){
        var lineas = [];
        $("#mostrar_opciones_lineas tbody td:nth-child(7)").each(function(){
            var puestos_cubrir = $(this).prev().find("select").val();
            if (parseInt(puestos_cubrir) > 0) {
                var idlinea = $(this).siblings("input").val();
                var fiabilidad = $(this).find("div:nth-child(1) input[type='checkbox']").prop("checked");
                var velocidad = $(this).find("div:nth-child(2) input[type='checkbox']").prop("checked");
                var disponibilidad = $(this).find("div:nth-child(3) input[type='checkbox']").prop("checked");
                var orden_fiabilidad = $("input[name='ordenacion_fiabilidad_" + idlinea + "']:checked").val();
                var orden_velocidad = $("input[name='ordenacion_velocidad_" + idlinea + "']:checked").val();
                var orden_disponibilidad = $("input[name='ordenacion_disponibilidad_" + idlinea + "']:checked").val();

                lineas.push([parseInt(idlinea), fiabilidad, velocidad, disponibilidad, orden_fiabilidad, orden_velocidad, orden_disponibilidad, parseInt(puestos_cubrir)]);
            }
        });
        ordenar(lineas);
    });

/* ------------------------------------------------------------------------ FUNCIONES ----------------------------------------------------------------- */

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
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_delante_" + respuesta.datos[index].idlinea + "' value='fiabilidad_delante' />" +
                                                                                "<label class='form-check-label' for='fiabilidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_detras_" + respuesta.datos[index].idlinea + "' value='fiabilidad_detras' />" +
                                                                                "<label class='form-check-label' for='fiabilidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_fiabilidad_" + respuesta.datos[index].idlinea + "' id='fiabilidad_indiferente_" + respuesta.datos[index].idlinea + "' value='fiabilidad_indiferente' checked='checked' />" +
                                                                                "<label class='form-check-label' for='fiabilidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<span>Veloces: </span>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_delante_" + respuesta.datos[index].idlinea + "' value='velocidad_delante' />" +
                                                                                "<label class='form-check-label' for='velocidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_detras_" + respuesta.datos[index].idlinea + "' value='velocidad_detras' />" +
                                                                                "<label class='form-check-label' for='velocidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_velocidad_" + respuesta.datos[index].idlinea + "' id='velocidad_infiferente_" + respuesta.datos[index].idlinea + "' value='velocidad_indiferente' checked='checked' />" +
                                                                                "<label class='form-check-label' for='velocidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                        "<div class='form-group'>" +
                                                                            "<span>Disponibles: </span>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_delante_" + respuesta.datos[index].idlinea + "' value='disponibilidad_delante' />" +
                                                                                "<label class='form-check-label' for='disponibilidad_delante_" + respuesta.datos[index].idlinea + "'>Delante</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_detras_" + respuesta.datos[index].idlinea + "' value='disponibilidad_detras' />" +
                                                                                "<label class='form-check-label' for='disponibilidad_detras_" + respuesta.datos[index].idlinea + "'>Detras</label>" +
                                                                            "</div>" +
                                                                            "<div class='form-check form-check-inline'>" +
                                                                                "<input class='form-check-input' type='radio' name='ordenacion_disponibilidad_" + respuesta.datos[index].idlinea + "' id='disponibilidad_indiferente_" + respuesta.datos[index].idlinea + "' value='disponibilidad_indiferente' checked='checked' />" +
                                                                                "<label class='form-check-label' for='disponibilidad_indiferente_" + respuesta.datos[index].idlinea + "'>Indiferente</label>" +
                                                                            "</div>" +
                                                                        "</div>" +
                                                                    "</td>" +
                                                                "</tr>"
                    );

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
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para cargar las opciones de lineas: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        });
        
    }

    function ordenar(lineas){
        var manipuladores = [];
        $.ajax({
            url: "php/manipuladores_ajax.php",
            type: "post",
            dataType: "json",
            data: {
                accion: "cargarManip"
            },
            success: function(respuesta){
                if (respuesta.error == 0) {
                    for (let index = 0; index < respuesta.datos.length; index++) {
                        var id = parseInt(respuesta.datos[index].idmanipulador);
                        var nombre = respuesta.datos[index].nombre;
                        var apellidos = respuesta.datos[index].apellidos;
                        var dni = respuesta.datos[index].dni;
                        var fiabilidad = parseInt(respuesta.datos[index].fiabilidad);
                        var velocidad = parseInt(respuesta.datos[index].velocidad);
                        var disponibilidad = parseInt(respuesta.datos[index].disponibilidad);
                        manipuladores.push([id, nombre, apellidos, dni, fiabilidad, velocidad, disponibilidad]);
                    }
                } else {
                    console.log(respuesta.mensaje);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("Error en la peticion AJAX para cargar manipuladores: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
            }
        }).done(function(){
            /* DISEÑO DE UN NUEVO ARRAY DE DATOS CON LA SIGUIENTE ESTRUCTURA:
               [0]->IDLINEA, [1]->NUMERO DE CHECKBOXES MARCADOS, [2]->BOOLEANO FIABILIDAD, [3]->BOOLEANO VELOCIDAD, [4]->BOOLEANO DISPONIBILIDAD,
               [5]->NUMERO DE OPCIONES SELECCIONADAS DELANTE, [6]->ARRAY CON LOS NOMBRES DE LAS PREFERENCIAS QUE VAN DELANTE,
               [7]->NUMERO DE OPCIONES SELECCIONADAS DETRAS, [8]->ARRAY CON LOS NOMBRES DE LAS PREFERENCIAS QUE VAN DETRAS, [9]->NUMERO DE PUESTOS A ASIGNAR*/
            var datosLineas = [];
            for (let index = 0; index < lineas.length; index++) {
                // NUMERO DE PREFERENCIAS (CHECKBOXES) MARCADOS PARA ESTA LINEA
                var conteo_prefs = 0;

                var idlinea = lineas[index][0];
                if (lineas[index][1]) {
                    conteo_prefs++;
                }
                if (lineas[index][2]) {
                    conteo_prefs++;
                }
                if (lineas[index][3]) {
                    conteo_prefs++;
                }
                // NUMERO DE OPCIONES (RADIOBUTTONS) ACTIVADOS EN "DELANTE"
                var conteo_orden_delante = 0;
                // NUMERO DE OPCIONES (RADIOBUTTONS) ACTIVADOS EN "DETRAS"
                var conteo_orden_detras = 0;
                // NOMBRES (STRINGS) DE LAS OPCIONES ACTIVADAS EN "DELANTE"
                var orden_delante = [];
                // NOMBRES (STRINGS) DE LAS OPCIONES ACTIVADAS EN "DETRAS"
                var orden_detras = [];
                /* VALORES (STRINGS) DE LOS RADIOBUTTONS MARCADOS:
                   ["fiabilidad_delante" || "fiabilidad_detras" || "fiabilidad_indiferente", "velocidad_delante" || "velocidad_detras" || "velocidad_indiferente", "disponibilidad_delante" || "disponibilidad_detras" || "disponibilidad_indiferente"] */
                var ordenaciones = [lineas[index][4], lineas[index][5], lineas[index][6]];
                for (let j = 0; j < ordenaciones.length; j++) {
                    var temp = ordenaciones[j].split("_");
                    if (temp[1] !== "indiferente") {
                        if (temp[1] === "delante") {
                            conteo_orden_delante++;
                            orden_delante.push(temp[0]);
                        } else {
                            conteo_orden_detras++;
                            orden_detras.push(temp[0]);
                        }
                    }
                }
                datosLineas.push([idlinea, conteo_prefs, lineas[index][1], lineas[index][2], lineas[index][3], conteo_orden_delante, orden_delante, conteo_orden_detras, orden_detras, lineas[index][7]]);
            }
            /* ------------------------------------------------------------------------------------------------ */

            var existen_lineas_con_3_checkboxes = false;
            var existen_lineas_con_2_checkboxes = false;
            var existen_lineas_con_1_checkbox = false;
            var existen_lineas_con_ningun_checkbox = false;
            // ESTA VARIABLE SE USA EN EL REPARTO DE MANIPULADORES
            var numero_lineas_sin_checkboxes = 0;
            // VARIABLE PARA RELLENAR CON LAS LINEAS Y SUS MANIPULADORES YA REPARTIDOS
            var lineas_manipuladores = [];

            for (let i = 0; i < datosLineas.length; i++) {
                // AÑADIR LAS LINEAS A LAS QUE SE LES VA A HACER EL REPARTO COMO OBJETOS CON DOS PROPIEDADES
                lineas_manipuladores.push({
                    id: datosLineas[i][0],
                    manipuladores: []
                });

                if (datosLineas[i][1] == 3) {
                    existen_lineas_con_3_checkboxes = true;
                }
                if (datosLineas[i][1] == 2) {
                    existen_lineas_con_2_checkboxes = true;
                }
                if (datosLineas[i][1] == 1) {
                    existen_lineas_con_1_checkbox = true;
                }
                if (datosLineas[i][1] == 0) {
                    existen_lineas_con_ningun_checkbox = true;
                    numero_lineas_sin_checkboxes++;
                }
            }
            if (existen_lineas_con_3_checkboxes) {
                /* CONTENDRA EL ID DE CADA MANIPULADOR */
                var manipuladores_f_v_d = [];
                /* SELECCION Y ORDENADO DE MANIPULADORES EN FUNCION DEL EQUILIBRIO DE SUS TRES PARAMETROS (FIABILIDAD, VELOCIDAD, DISPONIBILIDAD)
                   SE EMPIEZA BUSCANDO LOS QUE TENGAN VALORES MAS ALTOS EN LOS TRES PARAMETROS CON MENOS MARGEN DE DIFERENCIA
                   ENTRE ELLOS Y SE CONTINUA CON LOS QUE TENGAN VALORES MAS BAJOS PERO CON MAS MARGEN DE DIFERENCIA. */
                for (let i = 9, n = 0; i >= 0; i--, n++) {
                    for (let k = 0; k <= n; k++) {
                        for (let j = 0; j < manipuladores.length; j++) {
                            if (manipuladores_f_v_d.indexOf(manipuladores[j][0]) == -1) {
                                if ( (manipuladores[j][4] == i + k || manipuladores[j][4] == i || manipuladores[j][4] == i - k) && (manipuladores[j][5] == i + k || manipuladores[j][5] == i || manipuladores[j][5] == i - k) && (manipuladores[j][6] == i + k || manipuladores[j][6] == i || manipuladores[j][6] == i - k) ){
                                    manipuladores_f_v_d.push(manipuladores[j][0]);
                                }
                            }
                        }
                    }
                }
                // SI FALTAN MANIPULADORES
                if (manipuladores.length - manipuladores_f_v_d.length > 0) {
                    /* CONTENEDRA LOS MANIPULADORES RESTANTES CON SUS MEDIAS (FIABILIDAD, VELOCIDAD, DISPONIBILIDAD)
                       Y SE ORDENARAN DE MAYOR A MENOR VALOR DE MEDIA ANTES DE SER INCORPORADOS A LA VARIABLE "manipuladores_f_v_d" */
                    var manipuladoresRestantesMedia = [];
                    for (let index = 0; index < manipuladores.length; index++) {
                        if (manipuladores_f_v_d.indexOf(manipuladores[index][0]) == -1) {
                            var media = (manipuladores[index][4] + manipuladores[index][5] + manipuladores[index][6]) / 3;
                            manipuladoresRestantesMedia.push([manipuladores[index][0], media]);
                        }
                    }
                    // ORDENACION DE MAYOR A MENOR POR EL VALOR DE LA MEDIA
                    manipuladoresRestantesMedia.sort(function(a, b){
                        return parseFloat(b[1]) - parseFloat(a[1]);
                    });
                    // ADICION FINAL DE LOS RESTANTES
                    for (let index = 0; index < manipuladoresRestantesMedia.length; index++) {
                        manipuladores_f_v_d.push(manipuladoresRestantesMedia[index][0]);
                    }
                }
                console.log("Hay " + manipuladores.length + ", manipuladores_f_v_d tiene " + manipuladores_f_v_d.length);
            }
            if (existen_lineas_con_2_checkboxes) {
                // COMPROBAR QUE 2 OPCIONES SON LAS PRESENTES Y CREACION DE LAS VARIABLES APROPIADAS
                for (let index = 0; index < datosLineas.length; index++) {
                    /* SI EXISTE UNA LINEA CON CHECKBOXES EN FIABILIDAD Y VELOCIDAD Y CREACION DE UNA VARIABLE
                       QUE CONTIENE TODOS LOS MANIPULADORES ORDENADOS POR ESTE CRITERIO (SOLO LA CREA UNA VEZ) */
                    if (datosLineas[index][2] && datosLineas[index][3] && !datosLineas[index][4] && typeof manipuladores_f_v === 'undefined') {
                        var manipuladores_f_v = [];
                        for (let i = 9, n = 0; i >= 0; i--, n++) {
                            for (let k = 0; k <= n; k++) {
                                for (let j = 0; j < manipuladores.length; j++) {
                                    if (manipuladores_f_v.indexOf(manipuladores[j][0]) == -1) {
                                        if ( (manipuladores[j][4] == i + k || manipuladores[j][4] == i || manipuladores[j][4] == i - k) && (manipuladores[j][5] == i + k || manipuladores[j][5] == i || manipuladores[j][5] == i - k) ){
                                            manipuladores_f_v.push(manipuladores[j][0]);
                                        }
                                    }
                                }
                            }
                        }
                        // SI FALTAN MANIPULADORES
                        if (manipuladores.length - manipuladores_f_v.length > 0) {
                            /* CONTENEDRA LOS MANIPULADORES RESTANTES CON SUS MEDIAS (FIABILIDAD, VELOCIDAD)
                               Y SE ORDENARAN DE MAYOR A MENOR VALOR DE MEDIA ANTES DE SER INCORPORADOS A LA VARIABLE "manipuladores_f_v" */
                            var manipuladoresRestantesMedia = [];
                            for (let index = 0; index < manipuladores.length; index++) {
                                if (manipuladores_f_v.indexOf(manipuladores[index][0]) == -1) {
                                    var media = (manipuladores[index][4] + manipuladores[index][5]) / 2;
                                    manipuladoresRestantesMedia.push([manipuladores[index][0], media]);
                                }
                            }
                            // ORDENACION DE MAYOR A MENOR POR EL VALOR DE LA MEDIA
                            manipuladoresRestantesMedia.sort(function(a, b){
                                return parseFloat(b[1]) - parseFloat(a[1]);
                            });
                            // ADICION FINAL DE LOS RESTANTES
                            for (let index = 0; index < manipuladoresRestantesMedia.length; index++) {
                                manipuladores_f_v.push(manipuladoresRestantesMedia[index][0]);
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_f_v tiene " + manipuladores_f_v.length);
                    }
                    /* SI EXISTE UNA LINEA CON CHECKBOXES EN FIABILIDAD Y DISPONIBILIDAD Y CREACION DE UNA VARIABLE
                       CON TODOS LOS MANIPULADORES ORDENADOS POR ESTE CRITERIO (SOLO LA CREA UNA VEZ) */
                    if (datosLineas[index][2] && !datosLineas[index][3] && datosLineas[index][4] && typeof manipuladores_f_d === 'undefined') {
                        var manipuladores_f_d = [];
                        for (let i = 9, n = 0; i >= 0; i--, n++) {
                            for (let k = 0; k <= n; k++) {
                                for (let j = 0; j < manipuladores.length; j++) {
                                    if (manipuladores_f_d.indexOf(manipuladores[j][0]) == -1) {
                                        if ( (manipuladores[j][4] == i + k || manipuladores[j][4] == i || manipuladores[j][4] == i - k) && (manipuladores[j][6] == i + k || manipuladores[j][6] == i || manipuladores[j][6] == i - k) ){
                                            manipuladores_f_d.push(manipuladores[j][0]);
                                        }
                                    }
                                }
                            }
                        }
                        // SI FALTAN MANIPULADORES
                        if (manipuladores.length - manipuladores_f_d.length > 0) {
                            /* CONTENEDRA LOS MANIPULADORES RESTANTES CON SUS MEDIAS (FIABILIDAD, DISPONIBILIDAD)
                               Y SE ORDENARAN DE MAYOR A MENOR VALOR DE MEDIA ANTES DE SER INCORPORADOS A LA VARIABLE "manipuladores_f_d" */
                            var manipuladoresRestantesMedia = [];
                            for (let index = 0; index < manipuladores.length; index++) {
                                if (manipuladores_f_d.indexOf(manipuladores[index][0]) == -1) {
                                    var media = (manipuladores[index][4] + manipuladores[index][6]) / 2;
                                    manipuladoresRestantesMedia.push([manipuladores[index][0], media]);
                                }
                            }
                            // ORDENACION DE MAYOR A MENOR POR EL VALOR DE LA MEDIA
                            manipuladoresRestantesMedia.sort(function(a, b){
                                return parseFloat(b[1]) - parseFloat(a[1]);
                            });
                            // ADICION FINAL DE LOS RESTANTES
                            for (let index = 0; index < manipuladoresRestantesMedia.length; index++) {
                                manipuladores_f_d.push(manipuladoresRestantesMedia[index][0]);
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_f_d tiene " + manipuladores_f_d.length);
                    }
                    /* SI EXISTE UNA LINEA CON CHECKBOXES EN VELOCIDAD Y DISPONIBILIDAD Y CREACION DE LA VARIABLE
                       QUE CONTIENE TODOS LOS MANIPULADORES ORDENADOS POR ESTE CRITERIO (SOLO LA CREA UNA VEZ) */
                    if (!datosLineas[index][2] && datosLineas[index][3] && datosLineas[index][4] && typeof manipuladores_v_d === 'undefined') {
                        var manipuladores_v_d = [];
                        for (let i = 9, n = 0; i >= 0; i--, n++) {
                            for (let k = 0; k <= n; k++) {
                                for (let j = 0; j < manipuladores.length; j++) {
                                    if (manipuladores_v_d.indexOf(manipuladores[j][0]) == -1) {
                                        if ( (manipuladores[j][5] == i + k || manipuladores[j][5] == i || manipuladores[j][5] == i - k) && (manipuladores[j][6] == i + k || manipuladores[j][6] == i || manipuladores[j][6] == i - k) ){
                                            manipuladores_v_d.push(manipuladores[j][0]);
                                        }
                                    }
                                }
                            }
                        }
                        // SI FALTAN MANIPULADORES
                        if (manipuladores.length - manipuladores_v_d.length > 0) {
                            /* CONTENEDRA LOS MANIPULADORES RESTANTES CON SUS MEDIAS (VELOCIDAD, DISPONIBILIDAD)
                               Y SE ORDENARAN DE MAYOR A MENOR VALOR DE MEDIA ANTES DE SER INCORPORADOS A LA VARIABLE "manipuladores_v_d" */
                            var manipuladoresRestantesMedia = [];
                            for (let index = 0; index < manipuladores.length; index++) {
                                if (manipuladores_v_d.indexOf(manipuladores[index][0]) == -1) {
                                    var media = (manipuladores[index][5] + manipuladores[index][6]) / 2;
                                    manipuladoresRestantesMedia.push([manipuladores[index][0], media]);
                                }
                            }
                            // ORDENACION DE MAYOR A MENOR POR EL VALOR DE LA MEDIA
                            manipuladoresRestantesMedia.sort(function(a, b){
                                return parseFloat(b[1]) - parseFloat(a[1]);
                            });
                            // ADICION FINAL DE LOS RESTANTES
                            for (let index = 0; index < manipuladoresRestantesMedia.length; index++) {
                                manipuladores_v_d.push(manipuladoresRestantesMedia[index][0]);
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_v_d tiene " + manipuladores_v_d.length);
                    }
                }
            }
            if (existen_lineas_con_1_checkbox) {
                for (let index = 0; index < datosLineas.length; index++) {
                    // COMPROBAR SI ESTA PRESENTE LA OPCION DE FIABILIDAD Y CREACION DE LA VARIABLE APROPIADA (SOLO LA CREA UNA VEZ)
                    if (datosLineas[index][2] && !datosLineas[index][3] && !datosLineas[index][4] && typeof manipuladores_fiabilidad === 'undefined') {
                        var manipuladores_fiabilidad = [];
                        for (let i = 9; i >= 0; i--) {
                            for (let j = 0; j < manipuladores.length; j++) {
                                if (manipuladores_fiabilidad.indexOf(manipuladores[j][0]) == -1) {
                                    if (manipuladores[j][4] == i){
                                        manipuladores_fiabilidad.push(manipuladores[j][0]);
                                    }
                                }
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_fiabilidad tiene " + manipuladores_fiabilidad.length);
                    }
                    // COMPROBAR SI ESTA PRESENTE LA OPCION DE VELOCIDAD Y CREACION DE LA VARIABLE APROPIADA (SOLO LA CREA UNA VEZ)
                    if (!datosLineas[index][2] && datosLineas[index][3] && !datosLineas[index][4] && typeof manipuladores_velocidad === 'undefined') {
                        var manipuladores_velocidad = [];
                        for (let i = 9; i >= 0; i--) {
                            for (let j = 0; j < manipuladores.length; j++) {
                                if (manipuladores_velocidad.indexOf(manipuladores[j][0]) == -1) {
                                    if (manipuladores[j][5] == i){
                                        manipuladores_velocidad.push(manipuladores[j][0]);
                                    }
                                }
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_velocidad tiene " + manipuladores_velocidad.length);
                    }
                    // COMPROBAR SI ESTA PRESENTE LA OPCION DE DISPONIBILIDAD Y CREACION DE LA VARIABLE APROPIADA (SOLO LA CREA UNA VEZ)
                    if (!datosLineas[index][2] && !datosLineas[index][3] && datosLineas[index][4] && typeof manipuladores_disponibilidad === 'undefined') {
                        var manipuladores_disponibilidad = [];
                        for (let i = 9; i >= 0; i--) {
                            for (let j = 0; j < manipuladores.length; j++) {
                                if (manipuladores_disponibilidad.indexOf(manipuladores[j][0]) == -1) {
                                    if (manipuladores[j][6] == i){
                                        manipuladores_disponibilidad.push(manipuladores[j][0]);
                                    }
                                }
                            }
                        }
                        console.log("Hay " + manipuladores.length + ", manipuladores_disponibilidad tiene " + manipuladores_disponibilidad.length);
                    }
                }
            }

/* ----------------------------------------------------------- REPARTO DE MANIPULADORES --------------------------------------------------------------- */

            console.warn("COMIENZO DEL REPARTO");
            /* BARAJADO PARA EVITAR QUE EL REPARTO SEA SIEMPRE EN EL MISMO ORDEN QUE EL DE LAS BASES DE DATOS
               DE MANIPULADORES Y LINEAS. FUNCION "shuffleArray()" DECLARADA AL FINAL */
            shuffleArray(datosLineas);
            shuffleArray(manipuladores);
            // VA A CONTENER LOS IDS DE MANIPULADORES YA ASIGNADOS A UNA LINEA
            var manipuladores_asignados = [];
            // LA VARIABLE QUE VA A CONTENER LOS MANIPULADORES CON LAS LINEAS ESTA DECLARADA ALREDEDOR DE LA LINEA 263
            // INDICE PARA ITERAR LAS LINEAS, SE VA A IR MODIFICANDO O REINICIANDO AL FINAL DEL BUCLE DO-WHILE
            var indice_lineas = 0;
            for (let index = 0; index < manipuladores.length; index++) {
                var asignacion_realizada = false;
                // BUCLE DO-WHILE
                do {
                    // ID DE ESTA LINEA
                    var idlinea = datosLineas[indice_lineas][0];
                    // PUESTOS POR ASIGNAR DE ESTA LINEA
                    var puestos_pendientes = datosLineas[indice_lineas][9];
                    // SI ESTA LINEA TENIA ACTIVADO UN CHECKBOX
                    if (datosLineas[indice_lineas][1] == 1) {
                        // SI EL CHECKBOX ES EL DE FIABILIDAD
                        if (datosLineas[indice_lineas][2]) {
                            var idmanipulador = manipuladores_fiabilidad[0];
                            // SI EL MANIPULADOR NO ESTA ASIGNADO A OTRA LINEA
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                // SI QUEDAN PUESTOS POR ASIGNAR PARA ESTA LINEA
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    // ELIMINAR ESTE MANIPULADOR DEL ARRAY DEL QUE SE TOMA
                                    manipuladores_fiabilidad.splice(0, 1);
                                }
                            // SI YA HA SIDO ASIGNADO A OTRA LINEA SE DESCARTA
                            } else {
                                manipuladores_fiabilidad.splice(0, 1);
                                continue;
                            }
                        // O EL DE VELOCIDAD
                        } else if (datosLineas[indice_lineas][3]) {
                            var idmanipulador = manipuladores_velocidad[0];
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    // ELIMINAR ESTE MANIPULADOR DEL ARRAY DEL QUE SE TOMA
                                    manipuladores_velocidad.splice(0, 1);
                                }
                            // SI YA HA SIDO ASIGNADO A OTRA LINEA SE DESCARTA
                            } else {
                                manipuladores_velocidad.splice(0, 1);
                                continue;
                            }
                        // O EL DE DISPONIBILIDAD
                        } else if (datosLineas[indice_lineas][4]) {
                            var idmanipulador = manipuladores_disponibilidad[0];
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    // ELIMINAR ESTE MANIPULADOR DEL ARRAY DEL QUE SE TOMA
                                    manipuladores_disponibilidad.splice(0, 1);
                                }
                            // SI YA HA SIDO ASIGNADO A OTRA LINEA SE DESCARTA
                            } else {
                                manipuladores_disponibilidad.splice(0, 1);
                                continue;
                            }
                        }
                    // O SI TENIA ACTIVADO DOS CHECKBOXES
                    } else if (datosLineas[indice_lineas][1] == 2){
                        // SI LOS CHECKBOXES ERAN LOS DE FIABILIDAD Y VELOCIDAD
                        if (datosLineas[indice_lineas][2] && datosLineas[indice_lineas][3]) {
                            var idmanipulador = manipuladores_f_v[0];
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    manipuladores_f_v.splice(0, 1);
                                }
                            } else {
                                manipuladores_f_v.splice(0, 1);
                                continue;
                            }
                        // O ERAN LOS DE FIABILIDAD Y DISPONIBILIDAD
                        } else if (datosLineas[indice_lineas][2] && datosLineas[indice_lineas][4]) {
                            var idmanipulador = manipuladores_f_d[0];
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    manipuladores_f_d.splice(0, 1);
                                }
                            } else {
                                manipuladores_f_d.splice(0, 1);
                                continue;
                            }
                        // O ERAN LOS DE VELOCIDAD Y DISPONIBILIDAD
                        } else if (datosLineas[indice_lineas][3] && datosLineas[indice_lineas][4]) {
                            var idmanipulador = manipuladores_v_d[0];
                            if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                if (puestos_pendientes > 0) {
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                       https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[indice_lineas][9] -= 1;
                                    asignacion_realizada = true;
                                    manipuladores_v_d.splice(0, 1);
                                }
                            } else {
                                manipuladores_v_d.splice(0, 1);
                                continue;
                            }
                        }
                    // O SI TENIA ACTIVADO TRES CHECKBOXES
                    } else if (datosLineas[indice_lineas][1] == 3) {
                        var idmanipulador = manipuladores_f_v_d[0];
                        if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                            if (puestos_pendientes > 0) {
                                /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                   https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                manipuladores_asignados.push(idmanipulador);
                                // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                datosLineas[indice_lineas][9] -= 1;
                                asignacion_realizada = true;
                                manipuladores_f_v_d.splice(0, 1);
                            }
                        } else {
                            manipuladores_f_v_d.splice(0, 1);
                            continue;
                        }
                    }

                    // CONTROL DEL INDICE DE LAS LINEAS
                    if (indice_lineas == datosLineas.length - 1) {
                        indice_lineas = 0;
                    } else {
                        indice_lineas++;
                    }
                    // EN CASO DE QUE TODOS LOS MANIPULADORES ESTEN YA REPARTIDOS
                    if (manipuladores_asignados.length == manipuladores.length) {
                        asignacion_realizada = true;
                    }
                    // PARA CONTROLAR SI TODAS LAS LINEAS CON CHECKBOXES ESTAN YA LLENAS
                    var lineas_llenas = 0;
                    for (let index = 0; index < datosLineas.length; index++) {
                        if (datosLineas[index][9] == 0) {
                            lineas_llenas++;
                        }
                    }
                    if (lineas_llenas == datosLineas.length - numero_lineas_sin_checkboxes) {
                        asignacion_realizada = true;
                    }

                } while (!asignacion_realizada);
            }// FIN DEL FOR

            // REPARTO DE MANIPULADORES RESTANTES A LAS POSIBLES LINEAS SIN NINGUN CHECKBOX SELECCIONADO
            if (existen_lineas_con_ningun_checkbox) {
                //var indice_lineas = 0;
                for (let index = 0; index < datosLineas.length; index++) {
                    // SI ESTA LINEA NO TIENE NINGUN CHECKBOX ACTIVADO
                    if (datosLineas[index][1] == 0) {
                        for (let i = 0; i < manipuladores.length; i++) {
                            // PUESTOS POR ASIGNAR DE ESTA LINEA
                            var puestos_pendientes = datosLineas[index][9];
                            // SI QUEDAN POR CUBRIR PUESTOS PARA ESTA LINEA
                            if (puestos_pendientes > 0) {
                                var idmanipulador = manipuladores[i][0];
                                // SI ESTE MANIPULADOR NO ESTA ASIGNADO TODAVIA
                                if (manipuladores_asignados.indexOf(idmanipulador) == -1) {
                                    var idlinea = datosLineas[index][0];
                                    /* FORMA DE INTRODUCIR DATOS EN LA POSICION DEL OBJETO Y PROPIEDAD ESPECIFICA DENTRO DEL ARRAY DE OBJETOS
                                        https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array */
                                    lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(idmanipulador);
                                    manipuladores_asignados.push(idmanipulador);
                                    // DISMINUIR EN 1 LOS PUESTOS PENDIENTES
                                    datosLineas[index][9] -= 1;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
            }

            // PARA COMPROBAR QUE TODAS LAS LINEAS ESTEN YA LLENAS
            var lineas_llenas = 0;
            for (let index = 0; index < datosLineas.length; index++) {
                if (datosLineas[index][9] == 0) {
                    lineas_llenas++;
                }
            }

            console.log("Hay " + manipuladores.length + " manipuladores y se han repartido " + manipuladores_asignados.length);
            console.log("Lineas llenas: " + lineas_llenas + ", líneas totales: " + datosLineas.length);
            console.log(lineas_manipuladores);
            for (let index = 0; index < datosLineas.length; index++) {
                console.log("Para la linea id = " + datosLineas[index][0] + " quedan por asignar " + datosLineas[index][9] + " manipulador/es");
            }

            // COMPROBAR QUE TODOS LOS MANIPULADORES HAN SIDO ASIGNADOS Y AUN SIGUE HABIENDO LINEAS POR COMPLETAR
            if (manipuladores_asignados.length == manipuladores.length && lineas_llenas < datosLineas.length) {
                var numero = 0;
                for (let index = 0; index < datosLineas.length; index++) {
                    numero += datosLineas[index][9];
                }
                alert("No hay suficientes manipuladores para todos los puestos requeridos. Intenta asigar " + numero + " manipuladores menos.");
                throw new Error("Sin manipuladores suficientes!");

            // COMPROBAR QUE AUN QUEDAN MANIPULADORES POR REPARTIR Y SIGUE HABIENDO LINEAS POR COMPLETAR
            } else if (manipuladores_asignados.length < manipuladores.length && lineas_llenas < datosLineas.length){
                alert("Quedan por repatir manipuladores y hay lineas incompletas.");
                throw new Error("Error lógico en el reparto de manipuladores por las líneas!");
            }

/* ----------------------------------------- FIN DEL REPARTO DE MANIPULADORES, PREPARACION PARA EL ORDENADO ------------------------------------------- */

            console.warn("COMIENZO DE LA ORDENACION");
            // PREPARACION PARA LA ORDENACION DENTRO DE LAS LINEAS
            // VA A CONTENER LAS LINEAS QUE NECESITAN ORDENACION DESPUES DEL REPARTO
            var lineas_ordenar = [];

            for (let index = 0; index < datosLineas.length; index++) {
                for (let i = 0; i < lineas_manipuladores.length; i++) {
                    // TENER EL ID DE LA LINEA PARA PODER COMPROBAR DATOS
                    if (lineas_manipuladores[i].id === datosLineas[index][0]) {
                        /* SE NECESITA DESCARTAR LAS LINEAS EN LAS QUE COINCIDAN LOS NOMBRES DE LOS CHECKBOXES SELECCIONADOS
                           CON LAS OPCIONES DE ORDENACION DELANTE SELECCIONADAS Y QUE NO TENGAN NINGUNA ORDENACION DETRAS */
                        if (existen_lineas_con_3_checkboxes) {
                            // SI LA LINEA TIENE 3 CHECKBOXES Y NO TIENE 3 OPCIONES DE ORDENACION DELANTE
                            if (datosLineas[index][1] == 3 && datosLineas[index][5] != 3) {
                                lineas_ordenar.push(datosLineas[index][0]);
                            }
                        }
                        if (existen_lineas_con_2_checkboxes) {
                            // SI LA LINEA TIENE SELECCIONADOS 2 CHECKBOXES Y TIENE SOLO 2 OPCIONES DE ORDENACION DELANTE
                            if (datosLineas[index][1] == 2 && datosLineas[index][5] == 2 && datosLineas[index][7] == 0) {
                                // SI EL REPARTO FUE POR FIABILIDAD Y VELOCIDAD Y REQUIERE ORDENACION POR AL MENOS UNO DISTINTO
                                if (datosLineas[index][2] && datosLineas[index][3] && (datosLineas[index][6][0] !== "fiabilidad" || datosLineas[index][6][1] !== "velocidad")) {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                // SI EL REPARTO FUE POR FIABILIDAD Y DISPONIBILIDAD Y REQUIERE ORDENACION POR AL MENOS UNO DISTINTO
                                } else if (datosLineas[index][2] && datosLineas[index][4] && (datosLineas[index][6][0] !== "fiabilidad" || datosLineas[index][6][1] !== "disponibilidad")) {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                // SI EL REPARTO FUE POR VELOCIDAD Y DISPONIBILIDAD Y REQUIERE ORDENACION POR AL MENOS UNO DISTINTO
                                } else if (datosLineas[index][3] && datosLineas[index][4] && (datosLineas[index][6][0] !== "velocidad" || datosLineas[index][6][1] !== "disponibilidad")) {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                }
                            // EN CUALQUIER OTRO CASO NECESITA ORDENACION
                            } else if (datosLineas[index][1] == 2) {
                                lineas_ordenar.push(datosLineas[index][0]);
                            }
                        }
                        if (existen_lineas_con_1_checkbox) {
                            // SI LA LINEA TIENE SELECCIONADO 1 CHECKBOX Y TIENE SOLO 1 OPCION DE ORDENACION DELANTE
                            if (datosLineas[index][1] == 1 && datosLineas[index][5] == 1 && datosLineas[index][7] == 0) {
                                // SI EL REPARTO FUE POR FIABILIDAD Y REQUIERE ORDENACION POR OTRA DISTINTA
                                if (datosLineas[index][2] && datosLineas[index][6][0] !== "fiabilidad") {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                // SI EL REPARTO FUE POR VELOCIDAD Y REQUIERE ORDENACION POR UNA DISTINTA
                                } else if (datosLineas[index][3] && datosLineas[index][6][0] !== "velocidad") {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                // SI EL REPARTO FUE POR DISPONIBILIDAD Y REQUIERE ORDENACION POR UNA DISTINTA
                                } else if (datosLineas[index][4] && datosLineas[index][6][0] !== "disponibilidad") {
                                    lineas_ordenar.push(datosLineas[index][0]);
                                }
                            // EN CUALQUIER OTRO CASO NECESITA ORDENACION
                            } else if (datosLineas[index][1] == 1) {
                                lineas_ordenar.push(datosLineas[index][0]);
                            }
                        }
                        if (existen_lineas_con_ningun_checkbox) {
                            // SI LA LINEA NO TIENE SELECCIONADO NINGUN CHECKBOX Y TIENE AL MENOS UNA OPCION DE ORDENACION
                            if (datosLineas[index][1] == 0 && (datosLineas[index][5] != 0 || datosLineas[index][7] != 0)) {
                                lineas_ordenar.push(datosLineas[index][0]);
                            }
                        }
                    }
                }
            }
            console.log("Nº de lineas a ordenar: " + lineas_ordenar.length);
            console.log(lineas_ordenar);

/* -------------------------------------------------------------- ORDENACION DE MANIPULADORES --------------------------------------------------------- */

            for (let index = 0; index < lineas_ordenar.length; index++) {
                for (let i = 0; i < datosLineas.length; i++) {
                    if (datosLineas[i][0] == lineas_ordenar[index]) {
                        // ESTA LINEA
                        var idlinea = lineas_ordenar[index];
                        var manipuladores_ordenados = [];
                        // OBTENCION DE LOS MANIPULADORES A ORDENAR DE ESTA LINEA
                        var manipuladores_a_ordenar = lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.slice();
                        // SI TIENE QUE IR SIN ORDENACION ALGUNA
                        if (datosLineas[i][5] == 0 && datosLineas[i][7] == 0) {
                            shuffleArray(manipuladores_a_ordenar);
                            manipuladores_ordenados = manipuladores_a_ordenar;
                        // SI TIENE ORDENACION DELANTE O DETRAS PARA LOS TRES RADIOBUTTONS
                        } else if (datosLineas[i][5] == 3 || datosLineas[i][7] == 3) {
                            // SI VAN DELANTE
                            if (datosLineas[i][7] == 0) {
                                // EL VALOR 0 SIGNIFICA DELANTE
                                var posicion = 0;
                            // O VAN DETRAS
                            } else {
                                // EL VALOR 1 SIGNIFICA DETRAS
                                var posicion = 1;
                            }
                            manipuladores_ordenados = manipuladores_por_FVD(manipuladores, manipuladores_a_ordenar, posicion);
                        // SI SOLO TIENE ORDENACION DELANTE O DETRAS PARA UNA OPCION
                        } else if ( (datosLineas[i][5] == 1 && datosLineas[i][7] == 0) || (datosLineas[i][5] == 0 && datosLineas[i][7] == 1) ) {
                            if (datosLineas[i][7] == 0) {
                                var donde_opcion = 6;
                            } else {
                                var donde_opcion = 8;
                            }
                            console.log(donde_opcion);
                            switch (datosLineas[i][donde_opcion][0]) {
                                case "fiabilidad":
                                    var opcion = 4;
                                    break;
                                case "velocidad":
                                    var opcion = 5;
                                    break;
                                case "disponibilidad":
                                    var opcion = 6;
                                    break;
                            }
                            if (datosLineas[i][7] == 0) {
                                var posicion = 0;
                            } else {
                                var posicion = 1;
                            }
                            manipuladores_ordenados = manipuladores_por_una_opcion(manipuladores, manipuladores_a_ordenar, opcion, posicion);
                        // SI SOLO TIENE ORDENACION DELANTE O DETRAS PARA 2 OPCIONES
                        } else if ( (datosLineas[i][5] == 2 && datosLineas[i][7] == 0) || (datosLineas[i][5] == 0 && datosLineas[i][7] == 2) ) {
                            if (datosLineas[i][7] == 0){
                                var donde_opciones = 6;
                                var posicion = 0;
                            } else {
                                var donde_opciones = 8;
                                var posicion = 1;
                            }
                            if (datosLineas[i][donde_opciones][0] === "fiabilidad" && datosLineas[i][donde_opciones][1] === "velocidad") {
                                var opciones = [4, 5];
                            } else if (datosLineas[i][donde_opciones][0] === "fiabilidad" && datosLineas[i][donde_opciones][1] === "disponibilidad") {
                                var opciones = [4, 6];
                            } else if (datosLineas[i][donde_opciones][0] === "velocidad" && datosLineas[i][donde_opciones][1] === "disponibilidad") {
                                var opciones = [5, 6];
                            }
                            manipuladores_ordenados = manipuladores_por_dos_opciones(manipuladores, manipuladores_a_ordenar, opciones, posicion);
                        // SI TIENE ORDENACION DELANTE PARA 2 OPCIONES Y 1 DETRAS O PARA 2 OPCIONES DETRAS Y 1 DELANTE
                        } else if ( (datosLineas[i][5] == 2 && datosLineas[i][7] == 1) || (datosLineas[i][5] == 1 && datosLineas[i][7] == 2) ) {
                            if (datosLineas[i][7] == 1) {
                                var donde_2_opciones = 6;
                                var donde_1_opcion = 8;
                                // EL VALOR 0 SIGNIFICA DELANTE
                                var posicion_dos_opciones = 0;
                                // EL VALOR 1 SIGNIFICA DETRAS
                                var posicion_una_opcion = 1;
                            } else {
                                var donde_2_opciones = 8;
                                var donde_1_opcion = 6;
                                // EL VALOR 1 SIGNIFICA DETRAS
                                var posicion_dos_opciones = 1;
                                // EL VALOR 0 SIGNIFICA DELANTE
                                var posicion_una_opcion = 0;
                            }
                            switch (datosLineas[i][donde_1_opcion][0]) {
                                    case "fiabilidad":
                                        var opcion = 4;
                                        break;
                                    case "velocidad":
                                        var opcion = 5;
                                        break;
                                    case "disponibilidad":
                                        var opcion = 6;
                                        break;
                            }
                            if (datosLineas[i][donde_2_opciones][0] === "fiabilidad" && datosLineas[i][donde_2_opciones][1] === "velocidad") {
                                var opciones = [4, 5];
                            } else if (datosLineas[i][donde_2_opciones][0] === "fiabilidad" && datosLineas[i][donde_2_opciones][1] === "disponibilidad") {
                                var opciones = [4, 6];
                            } else if (datosLineas[i][donde_2_opciones][0] === "velocidad" && datosLineas[i][donde_2_opciones][1] === "disponibilidad") {
                                var opciones = [5, 6];
                            }
                            var manipuladores_ordenados_dos_opciones = manipuladores_por_dos_opciones(manipuladores, manipuladores_a_ordenar, opciones, posicion_dos_opciones);
                            var manipuladores_ordenados_una_opcion = manipuladores_por_una_opcion(manipuladores, manipuladores_a_ordenar, opcion, posicion_una_opcion);
                            // ALEATORIEDAD PARA LA ASIGNACION PRIMERO DESDE EL ARRAY DE ORDENACION POR DOS OPCIONES O DESDE EL DE UNA OPCION
                            var aleatorio = getRandomInt(1, 2);
                            // VARIABLE AUXILIAR PARA RECIBIR LOS ORDENADOS DELANTE
                            var aux1 = [];
                            // VARIABLE AUXILIAR PARA RECIBIR LOS ORDENADOS DETRAS
                            var aux2 = [];
                            for (let j = 0; j < manipuladores_a_ordenar.length; j++) {
                                // CONTROL PARA COGER SOLO 
                                if (aux1.length + aux2.length == manipuladores_a_ordenar.length) {
                                    break;
                                }
                                // SI "aleatorio" VALE 2 SE EMPIEZA ASIGNANDO UN MANIPULADOR ORDENADO POR 2 OPCIONES, SI NO POR 1 OPCION
                                if (aleatorio == 2) {
                                    // SI VAN DELANTE LOS MANIPULADORES ORDENADOS POR 2 OPCIONES
                                    if (datosLineas[i][7] == 1) {
                                        // SE RECORRE EL ARRAY DESDE EL PRINCIPIO
                                        for (let k = 0; k < manipuladores_ordenados_dos_opciones.length; k++) {
                                            // SI EL MANIPULADOR NO ESTA YA ASIGNADO
                                            if (aux1.indexOf(manipuladores_ordenados_dos_opciones[k]) == -1 && aux2.indexOf(manipuladores_ordenados_dos_opciones[k]) == -1) {
                                                // SOLO UNO CADA VEZ SE ASIGNA
                                                aux1.push(manipuladores_ordenados_dos_opciones[k]);
                                                break;
                                            }
                                        }
                                    // SI VAN DETRAS LOS MANIPULADORES ORDENADOS POR 2 OPCIONES
                                    } else {
                                        // SE RECORRE EL ARRAY DESDE EL FINAL
                                        for (let k = manipuladores_ordenados_dos_opciones.length - 1; k >= 0 ; k--) {
                                            // SI EL MANIPULADOR NO ESTA YA ASIGNADO
                                            if (aux1.indexOf(manipuladores_ordenados_dos_opciones[k]) == -1 && aux2.indexOf(manipuladores_ordenados_dos_opciones[k]) == -1) {
                                                // SOLO UNO CADA VEZ SE ASIGNA
                                                aux2.unshift(manipuladores_ordenados_dos_opciones[k]);
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    // SI VAN DETRAS LOS MANIPULADORES ORDENADOS POR UNA OPCION
                                    if (datosLineas[i][7] == 1) {
                                        // SE RECORRE EL ARRAY DESDE EL FINAL
                                        for (let k = manipuladores_ordenados_una_opcion.length - 1; k >= 0 ; k--) {
                                            // SI EL MANIPULADOR NO ESTA YA ASIGNADO
                                            if (aux1.indexOf(manipuladores_ordenados_una_opcion[k]) == -1 && aux2.indexOf(manipuladores_ordenados_una_opcion[k]) == -1) {
                                                // SOLO UNO CADA VEZ SE ASIGNA
                                                aux2.unshift(manipuladores_ordenados_una_opcion[k]);
                                                break;
                                            }
                                        }
                                    // SI VAN DELANTE LOS MANIPULADORES ORDENADOS POR UNA OPCION
                                    } else {
                                        // SE RECORRE EL ARRAY DESDE EL PRINCIPIO
                                        for (let k = 0; k < manipuladores_ordenados_una_opcion.length; k++) {
                                            // SI EL MANIPULADOR NO ESTA YA ASIGNADO
                                            if (aux1.indexOf(manipuladores_ordenados_una_opcion[k]) == -1 && aux2.indexOf(manipuladores_ordenados_una_opcion[k]) == -1) {
                                                // SOLO UNO CADA VEZ SE ASIGNA
                                                aux1.push(manipuladores_ordenados_una_opcion[k]);
                                                break;
                                            }
                                        }
                                    }
                                }
                                // CONTROL DEL REPARTO
                                aleatorio < 2 ? aleatorio++ : aleatorio -= 1;
                            }// FIN DEL FOR
                            manipuladores_ordenados = aux1.concat(aux2);
                        // SI TIENE ORDENACION DELANTE PARA 1 Y ORDENACION DETRAS PARA 1
                        } else if (datosLineas[i][5] == 1 && datosLineas[i][7] == 1) {
                            switch (datosLineas[i][6][0]) {
                                case "fiabilidad":
                                    var opcion_delante = 4;
                                    break;
                                case "velocidad":
                                    var opcion_delante = 5;
                                    break;
                                case "disponibilidad":
                                    var opcion_delante = 6;
                                    break;
                            }
                            switch (datosLineas[i][8][0]) {
                                case "fiabilidad":
                                    var opcion_detras = 4;
                                    break;
                                case "velocidad":
                                    var opcion_detras = 5;
                                    break;
                                case "disponibilidad":
                                    var opcion_detras = 6;
                                    break;
                            }
                            var manipuladores_delante = manipuladores_por_una_opcion(manipuladores, manipuladores_a_ordenar, opcion_delante, 0);
                            var manipuladores_detras = manipuladores_por_una_opcion(manipuladores, manipuladores_a_ordenar, opcion_detras, 1);
                            // VARIABLE AUXILIAR PARA RECIBIR LOS ORDENADOS DELANTE
                            var aux1 = [];
                            // VARIABLE AUXILIAR PARA RECIBIR LOS ORDENADOS DETRAS
                            var aux2 = [];
                            // ALEATORIEDAD PARA ASIGNAR PRIMERO LOS QUE VAN DELANTE O LOS QUE VAN DETRAS
                            var aleatorio = getRandomInt(1, 2);
                            for (let j = 0; j < manipuladores_a_ordenar.length; j++) {
                                if (aux1.length + aux2.length == manipuladores_a_ordenar.length) {
                                    break;
                                }
                                // SI "aleatorio" VALE 1 SE EMPIEZA REPARTIENDO LOS QUE VAN DELANTE, SI NO, LOS DE DETRAS
                                if (aleatorio == 1) {
                                    // SE EMPIEZA A RECORRER EL ARRAY DESDE EL PRINCIPIO
                                    for (let k = 0; k < manipuladores_delante.length; k++) {
                                        if (aux1.indexOf(manipuladores_delante[k]) == -1 && aux2.indexOf(manipuladores_delante[k]) == -1) {
                                            aux1.push(manipuladores_delante[k]);
                                            break;
                                        }
                                    }
                                } else {
                                    // SE EMPIEZA A RECORRER EL ARRAY DESDE EL FINAL
                                    for (let k = manipuladores_detras.length - 1; k >= 0; k--) {
                                        if (aux1.indexOf(manipuladores_detras[k]) == -1 && aux2.indexOf(manipuladores_detras[k]) == -1) {
                                            aux2.unshift(manipuladores_detras[k]);
                                            break;
                                        }
                                    }
                                }
                                // CONTROL DEL REPARTO
                                aleatorio < 2 ? aleatorio++ : aleatorio -= 1;
                            }
                            manipuladores_ordenados = aux1.concat(aux2);
                        }
                        console.log(manipuladores_ordenados);
                        lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores = [];
                        for (let k = 0; k < manipuladores_ordenados.length; k++) {
                            var datosManipulador = manipuladores[manipuladores.map(function(elemento) { return elemento[0]; }).indexOf(manipuladores_ordenados[k])];
                            var objeto = {
                                idmanipulador: manipuladores_ordenados[k],
                                nombre: datosManipulador[1],
                                apellidos: datosManipulador[2]
                            };
                            lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores.push(objeto);
                        }
                        // ASIGNACION DE LOS MANIPULADORES YA ORDENADOS A LA VARIABLE QUE CONTIENE LAS LINEAS Y LOS MANIPULADORES DEL REPARTO
                        //lineas_manipuladores[lineas_manipuladores.map(function(elemento) { return elemento.id; }).indexOf(idlinea)].manipuladores = manipuladores_ordenados;
                    }
                }
            }
            console.log(lineas_manipuladores);
            //  CONTINUAR CON EL CODIGO QUE FALTE AQUI

        });// FIN DEL DONE JQUERY
    }// FIN DE LA FUNCION

/* ----------------------------------------------------------------- FUNCIONES ----------------------------------------------------------------------- */

    /* DEVUELVE UN ENTERO ALEATORIO ENTRE "min" (INCLUIDO) Y "max" (INCLUIDO)
       https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* BARAJADO DE LOS ELEMENTOS DE UN ARRAY
       https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    /* DEVUELVE UN ARRAY DE IDS DE MANIPULADORES CON LA MISMA LOGITUD QUE "manipuladores_a_ordenar", ORDENADOS CALCULANDO LA
       MEDIA ENTRE FIABILIDAD, VELOCIDAD Y DISPONIBILIDAD, DELANTE O DETRAS SEGUN EL VALOR RECIBIDO EN EL PARAMETRO "posicion".
       SE USAN LOS MANIPULADORES PRESENTES EN "manipuladores_a_ordenar" Y LOS DATOS PRESENTES EN "manipuladores" */
    function manipuladores_por_FVD(manipuladores, manipuladores_a_ordenar, posicion){
        var auxiliar = [];
        for (let index = 0; index < manipuladores_a_ordenar.length; index++) {
            // ESTE MANIPULADOR
            var idmanipulador = manipuladores_a_ordenar[index];
            // ARRAY CON LOS DATOS DE ESTE MANIPULADOR
            var datos_manipulador = manipuladores[manipuladores.map(function(elemento) { return elemento[0]; }).indexOf(idmanipulador)];
            var media = (datos_manipulador[4] + datos_manipulador[5] + datos_manipulador[6]) / 3;
            console.log("Por media devuelve a: " + idmanipulador + ", que tiene f: " + datos_manipulador[4] + ", v: " + datos_manipulador[5] + ", d: " + datos_manipulador[6] + " y media = " + media);
            auxiliar.push([idmanipulador, media]);
        }
        
        // ORDENACION DE MAYOR A MENOR USANDO EL VALOR DE LA MEDIA SI LA ORDENACION ES DELANTE (0)
        if (posicion == 0) {
            auxiliar.sort(function(a, b){
                return parseFloat(b[1]) - parseFloat(a[1]);
            });
        // MENOR A MAYOR USANDO EL VALOR DE LA MEDIA SI ES DETRAS
        } else {
            auxiliar.sort(function(a, b){
                return parseFloat(a[1]) - parseFloat(b[1]);
            });
        }
        var manipuladores_ordenados = [];
        for (let index = 0; index < auxiliar.length; index++) {
            manipuladores_ordenados.push(auxiliar[index][0]);
        }
        return manipuladores_ordenados;
    }

    /* DEVUELVE UN ARRAY DE IDS DE MANIPULADORES CON LA MISMA LOGITUD QUE "manipuladores_a_ordenar", ORDENADOS CALCULANDO LA
       MEDIA DE LAS 2 OPCIONES ESPECIFICADAS EN EL PARAMETRO "opciones", DELANTE O DETRAS SEGUN EL VALOR RECIBIDO EN EL PARAMETRO "posicion".
       SE USAN LOS MANIPULADORES PRESENTES EN "manipuladores_a_ordenar" Y LOS DATOS PRESENTES EN "manipuladores" */
    function manipuladores_por_dos_opciones(manipuladores, manipuladores_a_ordenar, opciones, posicion){
        var auxiliar = [];
        for (let index = 0; index < manipuladores_a_ordenar.length; index++) {
            // ESTE MANIPULADOR
            var idmanipulador = manipuladores_a_ordenar[index];
            // ARRAY CON LOS DATOS DE ESTE MANIPULADOR
            var datos_manipulador = manipuladores[manipuladores.map(function(elemento) { return elemento[0]; }).indexOf(idmanipulador)];
            var media = (datos_manipulador[opciones[0]] + datos_manipulador[opciones[1]]) / 2;
            //console.log("Devuelve a: " + idmanipulador + ", que tiene f: " + datos_manipulador[4] + ", v: " + datos_manipulador[5] + ", d: " + datos_manipulador[6] + " y media = " + media);
            auxiliar.push([idmanipulador, media]);
        }
        
        // ORDENACION DE MAYOR A MENOR USANDO EL VALOR DE LA MEDIA SI LA ORDENACION ES DELANTE (0)
        if (posicion == 0) {
            auxiliar.sort(function(a, b){
                return parseFloat(b[1]) - parseFloat(a[1]);
            });
        // MENOR A MAYOR USANDO EL VALOR DE LA MEDIA SI ES DETRAS
        } else {
            auxiliar.sort(function(a, b){
                return parseFloat(a[1]) - parseFloat(b[1]);
            });
        }
        var manipuladores_ordenados = [];
        for (let index = 0; index < auxiliar.length; index++) {
            manipuladores_ordenados.push(auxiliar[index][0]);
        }
        return manipuladores_ordenados;
    }

    /* DEVUELVE UN ARRAY DE IDS DE MANIPULADORES CON LA MISMA LONGITUD QUE "manipuladores_a_ordenar", ORDENADOS
       POR LA OPCION RECIBIDA EN EL PARÁMETRO "opcion", DELANTE O DETRAS POR EL VALOR RECIBIDO EN "posicion" */
    function manipuladores_por_una_opcion(manipuladores, manipuladores_a_ordenar, opcion, posicion){
        var auxiliar = [];
        for (let j = 0; j < manipuladores_a_ordenar.length; j++) {
            // ESTE MANIPULADOR
            var idmanipulador = manipuladores_a_ordenar[j];
            var datos_manipulador = manipuladores[manipuladores.map(function(elemento) { return elemento[0]; }).indexOf(idmanipulador)];
            console.log("Devuelve a: " + idmanipulador + ", que tiene f: " + datos_manipulador[4] + ", v: " + datos_manipulador[5] + ", d: " + datos_manipulador[6]);
            auxiliar.push([idmanipulador, datos_manipulador[opcion]]);
        }
        // ORDENACION DE MAYOR A MENOR USANDO EL VALOR DE LA OPCION SI LA ORDENACION ES DELANTE (0)
        if (posicion == 0) {
            auxiliar.sort(function(a, b){
                return parseFloat(b[1]) - parseFloat(a[1]);
            });
        // MENOR A MAYOR USANDO EL VALOR DE LA OPCION SI ES DETRAS
        } else {
            auxiliar.sort(function(a, b){
                return parseFloat(a[1]) - parseFloat(b[1]);
            });
        }
        var manipuladores_ordenados = [];
        for (let index = 0; index < auxiliar.length; index++) {
            manipuladores_ordenados.push(auxiliar[index][0]);
        }
        return manipuladores_ordenados;
    }
});