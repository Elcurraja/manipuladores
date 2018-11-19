$(document).ready(function() {
    $.fn.dataTableExt.ofnSearch['html-span'] = function(value) {
        return $(value).text();
    };
    $.fn.dataTableExt.ofnSearch['html-input'] = function(value) {
        return $(value).val();
    };
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
        console.log($("#" + id).datetimepicker('date'))
        return $("#" + id).datetimepicker('date');
    };

 

    /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA LOS INPUT "HORA INICIO, FIN Y DATE"
    EN EL MOMENTO DE AÑADIR UNA AUSENCIA */
    $('#modalAddAusencia #hora_fin').datetimepicker({
       locale: 'es',
       format: 'LT',
       stepping: "5"
    });

    $('#modalAddAusencia #hora_inicio').datetimepicker({
        locale: 'es',
        format: 'LT',
        stepping: "5"
    });
    $('#modalAddAusencia #fecha').datetimepicker({
        locale: 'es',
        format: 'L',
    });

    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_ausencia").on("change","td",function(){
        var elementos = $(this).parent()[0];
        if($(elementos).find("input:checked").val()){
            var hijos =$(elementos).find("input[type=text],select").prop("disabled",false);
            $(elementos).css('background-color','#FFE189')    
        }
        else {
            var hijos =$(elementos).find("input[type=text],select").prop("disabled",true);
            $(elementos).css('background-color','')
        }
    })
    //MOSTRAMOS U OCULTAMOS EL MENU PARA GUARDAR O BORRAR
    $("#tabla_ausencia").on("change", "div .checkedit", function(){
        var countchecked = false;
        $(".checkedit").each(function(){
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

    //POR DEFECTO OCULTA EN EL MODAL DE AÑADIR AUSENCIA LOS INPUTS PARA LAS HORAS, 
    //AL CAMBIAR SI ES DIA COMPLETO A NO, LOS MOSTRAMOS
    $('.hora').css("display","none")
    $('#esdiacompleto').change(function(){
        if ($('#esdiacompleto').val()==1){
            $('.hora').css("display","none")
        }
        else {
            $('.hora').css("display","table-row")
        }
    })
  

    showAusencias()
});
function showAusencias(){

    $.ajax({
        url:"php/ausencias_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"show"
        }
        ,success:function(response){
            $("#tabla_ausencia tbody").empty();
                for (let index = 0; index < response.datosAusencia.length; index++){
                    $("#tabla_ausencia tbody").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<input type='hidden' value='" + response.datosAusencia[index].idausencia + "' />" +
                        "<input type='hidden' class='form-control' name='idmanipulador' id='idmanipulador'value='"+ response.datosAusencia[index].idmanipulador+"'disabled='disable'/>"+
                        "<td><span>"+ response.datosAusencia[index].nombre+"</span></td>"+
                        "<td><span>"+ response.datosAusencia[index].apellidos+"</span></td>"+
                        "<td><div class='input-group date' id='fecha_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#fecha_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>"+
                        "<td><select class='form-control selectReg' id='esdiacompleto"+index+"' disabled=disable></select></td>"+
                        "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><input type='text' class='form-control' name='observaciones' id='observaciones'value='"+ response.datosAusencia[index].observaciones+"'disabled='disable'/></td>");
                       
                        $('#fecha_'+ index).datetimepicker({
                            locale: 'es',
                            format: 'DD/MM/YYYY',
                            date: response.datosAusencia[index].fecha
                        });
                        $('#hora_inicio_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosAusencia[index].hora_inicio,"HH:mm:ss")
                        });
                        $('#hora_fin_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosAusencia[index].hora_fin,"HH:mm:ss")
                        });

                        if(response.datosAusencia[index].esdiacompleto==1){
                            $("#esdiacompleto"+index).append("<option value='1'selected>Si</option>")
                            $("#esdiacompleto"+index).append("<option value='0'>No</option>")
                        }
                        else {
                            $("#esdiacompleto"+index).append("<option value='1'>Si</option>")
                            $("#esdiacompleto"+index).append("<option value='0' selected>No</option>")
                        }

                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los registros de ausencias: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
           DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
           CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
           QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
        tabla = $('#tabla_ausencia').DataTable({
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
                    "targets": 0 
                },
                /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE PARA LAS BUSQUEDAS DE DATATABLE
                   https://datatables.net/reference/option/columns.searchable */
                { 
                    "searchable": false, 
                    "targets": 0 
                },
                /* CONFIGURACION PARA QUE AL ORDENAR Y BUSCAR LOS DATOS PUEDA LEERLOS DENTRO DE LOS INPUTS Y SELECTS DE LAS CELDAS
                   https://stackoverflow.com/questions/40238819/jquery-datatables-sorting-a-select-inside-a-column */
                {
                    "type": "html-span",
                    "targets": [1,2]
                },
                {
                    "type": "html-input",
                    "targets": [7]
                },
                {
                    "type": "tempusdominus-date",
                    "targets": [3]
                },
                {
                    /* 
                       https://stackoverflow.com/questions/11376469/can-datatables-sort-a-column-with-an-input-field */
                    "orderDataType": "tempusdominus-date-ordering",
                    "targets": [3]
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
                    targets: [4], 
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
function addAusencia(){
    
    if ($("#hora_inicio").datetimepicker('date')==null && $("#hora_fin").datetimepicker('date')==null){
        var datos = {
            "op": "add",
            "idmanipulador":$("#addAusencia #manipulador").val(),
            "fecha":$("#addAusencia #fecha").datetimepicker('date').format('L'),
            "esdiacompleto":$("#addAusencia #esdiacompleto").val(),
            "observaciones":$("#addAusencia #observaciones").val()
        }
    }
    else {
        var datos = {
            "op": "add",
            "idmanipulador":$("#addAusencia #manipulador").val(),
            "fecha":$("#addAusencia #fecha").datetimepicker('date').format('L'),
            "esdiacompleto":$("#addAusencia #esdiacompleto").val(),
            "horainicio":$("#addAusencia #hora_inicio").datetimepicker('date').format('LT'),
            "horafin":$("#addAusencia #hora_fin").datetimepicker('date').format('LT'),
            "observaciones":$("#addAusencia #observaciones").val()
        }
    }
    $.ajax({
        url:"php/ausencias_f.php",
        type:"POST",
        data: datos,
        success:function(response){
            location.href ="ausencias.php";
            //console.log('Linea insertada correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}
function updateAusencias(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            if ($(this).find("td:nth-child(6) > div").datetimepicker('date')==null && $(this).find("td:nth-child(7) > div").datetimepicker('date')==null){
                var datos = {
                    "idausencia": $(this).find("> input").val(),
                    "fecha": $(this).find("td:nth-child(4) > div").datetimepicker('date').format('L'),
                    "diacompleto": $(this).find("td:nth-child(5) input").val(),     
                    "observaciones": $(this).find("td:nth-child(8) input").val()     
                }
            }
             else{
                var datos = {
                    "idausencia": $(this).find("> input").val(),
                    "fecha": $(this).find("td:nth-child(5) > div").datetimepicker('date').format('L'),
                    "diacompleto": $(this).find("td:nth-child(6) select").val(),     
                    "horainicio": $(this).find("td:nth-child(7) > div").datetimepicker('date').format('LT'),
                    "horafin": $(this).find("td:nth-child(8) > div").datetimepicker('date').format('LT'),
                    "observaciones": $(this).find("td:nth-child(9) input").val()     
                }
             }
      
            arrayDatos.push(datos);
        }
    })
    $.ajax({
        url:"php/ausencias_f.php",
        type:"POST",
        data:{
            "op": "update",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="ausencias.php";
            //alert('Update realizado correctamente');
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
                "idausencia": $(this).find("> input").val()               
            };
            arrayDatos.push(datos);
        }
    })
    console.log(arrayDatos)
    $.ajax({
        url:"php/ausencias_f.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="ausencias.php";
            //console.log('Delete realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}
