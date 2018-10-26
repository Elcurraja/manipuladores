$(document).ready(function() {

      /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA LOS INPUT "HORA INICIO, FIN Y DATE"
    EN EL MOMENTO DE AÑADIR UNA AUSENCIA
       https://tempusdominus.github.io/bootstrap-4/Usage/#time-only */
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
    $("#tabla_ausencia").on("change", ".checkedit", function(){
        var countchecked = false;
        $(".checkedit").each(function(){
            if($(this).is(":checked")){
                countchecked = true;
                return false;
            }
        });
        if(countchecked){
            $("#opciones .boton").prop("disabled",false);
        }
        else{
            $("#opciones .boton").prop("disabled",true);
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
        },
        success:function(response){
            $("#tabla_ausencia tbody").empty();
                for (let index = 0; index < response.datosAusencia.length; index++){
                    $("tbody").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck1'><label class='custom-control-label' for='customCheck1'></label></div></td>'"+
                        "<td><span>"+ response.datosAusencia[index].idausencia +"</span></td>"+
                        "<input type='hidden' class='form-control' name='idmanipulador' id='idmanipulador'value='"+ response.datosAusencia[index].idmanipulador+"'disabled='disable'/>"+
                        "<td><span>"+ response.datosAusencia[index].nombre+"</span></td>"+
                        "<td><div class='input-group date' id='fecha_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#fecha_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>"+
                        "<td><select class='form-control selectReg' id='esdiacompleto"+index+"' disabled=disable></select></td>"+
                        "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><input type='text' class='form-control' name='observaciones' id='observaciones'value='"+ response.datosAusencia[index].observaciones+"'disabled='disable'/></td>");
                       
                        $('#fecha_'+ index).datetimepicker({
                            locale: 'es',
                            format: 'DD-MM-YYYY',
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
            //console.log(datos)
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
}
function addAusencia(){
    
    if ($("#hora_inicio").datetimepicker('date')==null && $("#hora_fin").datetimepicker('date')==null){
        var datos = {
            "op": "add",
            "idmanipulador":$("#manipulador").val(),
            "fecha":$("#fecha").datetimepicker('date').format('L'),
            "esdiacompleto":$("#esdiacompleto").val(),
            "observaciones":$("#observaciones").val()
        }
    }
    else {
        var datos = {
            "op": "add",
            "idmanipulador":$("#manipulador").val(),
            "fecha":$("#fecha").datetimepicker('date').format('L'),
            "esdiacompleto":$("#esdiacompleto").val(),
            "horainicio":$("#hora_inicio").datetimepicker('date').format('LT'),
            "horafin":$("#hora_fin").datetimepicker('date').format('LT'),
            "observaciones":$("#observaciones").val()
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
                    "idausencia": $(this).find("td:nth-child(2) span").text(),
                    "fecha": $(this).find("td:nth-child(4) > div").datetimepicker('date').format('L'),
                    "diacompleto": $(this).find("td:nth-child(5) input").val(),     
                    "observaciones": $(this).find("td:nth-child(8) input").val()     
                }
            }
             else{
                var datos = {
                    "idausencia": $(this).find("td:nth-child(2) span").text(),
                    "fecha": $(this).find("td:nth-child(4) > div").datetimepicker('date').format('L'),
                    "diacompleto": $(this).find("td:nth-child(5) input").val(),     
                    "horainicio": $(this).find("td:nth-child(6) > div").datetimepicker('date').format('LT'),
                    "horafin": $(this).find("td:nth-child(7) > div").datetimepicker('date').format('LT'),
                    "observaciones": $(this).find("td:nth-child(8) input").val()     
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
                "idausencia": $(this).find("td:nth-child(2) span").text()               
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
