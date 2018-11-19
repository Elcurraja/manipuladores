$(document).ready(function() {
   
    $.fn.dataTableExt.ofnSearch['html-input'] = function(value) {
        return $(value).text();
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
    $.fn.dataTable.ext.order['tempusdominus-time-ordering'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            var div = $('div', td);
            var id = div.attr("id");
            return $("#" + id).datetimepicker("date");
        });
    }

   
    /* TIPO "tempusdominus-date" PARA PODER HACER BUSQUEDAS POR FECHAS. SI SE USA EL PROPIO ELEMENTO PARA OBTENER
       EL VALOR DE LA FECHA DA ERROR ("Cannot read property 'format' of null") PERO USANDOLO POR SU ID NO */
    $.fn.dataTableExt.ofnSearch['tempusdominus-date'] = function(object) {
        var id = $(object).attr("id");
        return $("#" + id).datetimepicker('date').format("L");
    };

    $.fn.dataTableExt.ofnSearch['tempusdominus-time'] = function(object) {
        var id = $(object).attr("id");
        return $("#" + id).datetimepicker('date').format("LT");
    };
    
    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_registro").on("change","td",function(){
        var elementos = $(this).parent()[0];
        if($(elementos).find("input:checked").val()){
            $(elementos).find("input[type=text],select").prop("disabled",false);
            $(elementos).css('background-color','#FFE189')    
        }
        else {
            $(elementos).find("input[type=text],select").prop("disabled",true);
            $(elementos).css('background-color','')
        }
    })
    //MOSTRAMOS U OCULTAMOS EL MENU PARA GUARDAR O BORRAR
    $("#tabla_registro").on("change", "div .checkedit", function(){
        var countchecked = false;
        $(this).each(function(){
            if($(this).is(":checked")){
                countchecked = true;
                return false;
            }
        });
        if(countchecked){
            $("#opciones .boton").css("display","block");
        }
        else{
            $("#opciones .boton").css("display","none");
        }     
    })
    

   

    showReg()
})

function showReg(){
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"mostrarRegistros",
        },
        success:function(response){
            if ($.fn.dataTable.isDataTable("#tabla_registro")) {
                tabla.destroy();
            }
            $("#tabla_registro #tabla_datos").empty();
                for (let index = 0; index < response.datosReg.length; index++){
                    $("#tabla_registro #tabla_datos").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<input type='hidden' value='" + response.datosReg[index].idregistro + "' />" +
                        "<input type='hidden' class='form-control' name='idmanipulador' id='idmanipulador'value='"+ response.datosReg[index].idmanipulador+"'/>"+
                        "<td><span>"+ response.datosReg[index].nombre+"</span></td>"+
                        "<td><span>"+ response.datosReg[index].apellidos+"</span></td>"+
                        "<td><select class='form-control selectReg' id='idturno_"+index+"' disabled=disable></select></td>"+
                        "<td><div class='input-group date' id='fecha_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#fecha_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><select class='form-control selectReg' id='idlinea"+index+"' disabled=disable></select></td>");
                       
                        $('#fecha_'+ index).datetimepicker({
                            locale: 'es',
                            format: 'DD/MM/YYYY',
                            date: response.datosReg[index].fecha
                        });
                        $('#hora_inicio_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosReg[index].hora_inicio,"HH:mm:ss")
                        });
                        $('#hora_fin_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosReg[index].hora_fin,"HH:mm:ss")
                        });
                        for (let i=0;i<response.turnos.length;i++){                            
                            if(response.turnos[i].idturno==response.datosReg[index].idturno){
                                $("#idturno_"+index).append("<option value='"+ response.turnos[i].idturno+"'selected>"+ response.turnos[i].franja +"</option>")
                            }
                            else{
                                $("#idturno_"+index).append("<option value='"+ response.turnos[i].idturno +"'>"+ response.turnos[i].franja +"</option>")
                            }
                        }
                        
                        for (let l=0;l<response.lineas.length;l++){                            
                            if(response.lineas[l].idlinea==response.datosReg[index].idlinea){
                                $("#idlinea"+index).append("<option value='"+ response.lineas[l].idlinea+"'selected>" + response.lineas[l].nombre + "</option>")
                            }
                            else{
                                $("#idlinea"+index).append("<option value='"+ response.lineas[l].idlinea+"'>" + response.lineas[l].nombre + "</option>")
                            }
                        }

                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            //console.log(datos)
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
           DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
           CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
           QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
        tabla = $('#tabla_registro').DataTable({
            // https://datatables.net/reference/option/order
            order: [[1, "asc"]],
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
                /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE COMO ORDENABLE
                   https://datatables.net/forums/discussion/21164/disable-sorting-of-one-column */
                { 
                    "orderable": false, 
                    "targets": 0 },
                /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE PARA LAS BUSQUEDAS DE DATATABLE
                   https://datatables.net/reference/option/columns.searchable */
                { 
                    "searchable": false, 
                    "targets": 0 },
                /* CONFIGURACION PARA QUE AL ORDENAR Y BUSCAR LOS DATOS PUEDA LEERLOS DENTRO DE LOS INPUTS Y SELECTS DE LAS CELDAS
                   https://stackoverflow.com/questions/40238819/jquery-datatables-sorting-a-select-inside-a-column */
                   {
                    "type": "html-input",
                    "targets": [1,2]
                },
                {
                    "type": "tempusdominus-date",
                    "targets": [4]
                },
                {
                    /* 
                       https://stackoverflow.com/questions/11376469/can-datatables-sort-a-column-with-an-input-field */
                    "orderDataType": "tempusdominus-date-ordering",
                    "targets": [4]
                },
                {
                    "type": "tempusdominus-time",
                    "targets": [5,6]
                },
                {
                    /* 
                        https://stackoverflow.com/questions/11376469/can-datatables-sort-a-column-with-an-input-field */
                    "orderDataType": "tempusdominus-time-ordering",
                    "targets": [5,6]
                },
                {
                    targets: [3,7], 
                    render: function(data, type, full, meta){
                        if(type === 'filter' || type === 'sort'){
                            var api = new $.fn.dataTable.Api(meta.settings);
                            var td = api.cell({row: meta.row, column: meta.col}).node();
                            var $input = $('select, input', td);
                            if($input.length && $input.is('select')){
                            data = $('option:selected', $input).text();
                            } else {                   
                            data = $input.text();
                            }
                        }
                        return data;
                    }
                },
            ]
        });
    });
}

function updateReg(){
    var arrayData=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            console.log(this)
                var data = {
                    "idregistro": $(this).find("> input").val(),
                    //"idpuesto": $(this).find("td:nth-child(4) > input").val(),
                    "idturno": $(this).find("td:nth-child(6) .selectReg").val(),     
                    "fecha": $(this).find("td:nth-child(7) > div").datetimepicker('date').format('L'),
                    "horainicio": $(this).find("td:nth-child(8) > div").datetimepicker('date').format('LT'),
                    "horafin": $(this).find("td:nth-child(9) > div").datetimepicker('date').format('LT'),
                    "idlinea": $(this).find("td:nth-child(10) .selectReg").val(),
             }
             arrayData.push(data);
        }
    })
    //console.log(arrayData)
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        data:{
            "op": "update",
            "datos":arrayData,
        },
        success:function(response){
            showReg()
            console.log(response)
            //console.log('Update realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}

function borrarCampos(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idRegistroManipulador": $(this).find("> input").val()               
            };
            arrayDatos.push(datos);
        }
    })
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success: function(response){
            if (response.error == 1) {
                console.log("Error en php: " + json.mensaje);
            }
        },
        error: function(response,jqXHR,textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        location.href ="registro_manipuladores.php";
    });
}