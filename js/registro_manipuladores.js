$(document).ready(function() {
   
   
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
    $("#tabla_registro").on("change", ".checkedit", function(){
        var countchecked = false;
        $(".checkedit").each(function(){
            if($(this).is(":checked")){
                countchecked = true;
                return false;
            }
        });
        if(countchecked){
            // $("#opciones").css("display","block");
            $("#opciones .boton").prop("disabled",false);
        }
        else{
            // $("#opciones").css("display","none");
            $("#opciones .boton").prop("disabled",true);
        }     
    })
    

    $('#busqueda_fecha').datetimepicker({
        locale: 'es',
        format: 'L',
    });
    //LIMPIAR EL INPUT DE DATE PARA MOSTRAR TODOS LOS REGISTOS DE NUEVO
    $('#mostrarTodos').click(function(){
        $("#busqueda_fecha").datetimepicker('clear')
        showReg()
    })

    showReg()
})

function showReg(){
    if ($("#busqueda_fecha").datetimepicker('date')==null){
        var datos ={
            op:"mostrarRegistros",
            fecha:"todos"
        }
    }
    else {
        var datos={
            op:"mostrarRegistros",
            fecha:$("#busqueda_fecha").datetimepicker('date').format('L'),
        }
    }
    //console.log(datos)
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: datos,
        success:function(response){
            $("tbody").empty();
                for (let index = 0; index < response.datosReg.length; index++){
                    $("tbody").append(
                        "<tr class='fila'>"+
                        "<td><input type='checkbox' name='edit' class='checkedit'></td>"+
                        "<td><span>"+ response.datosReg[index].idregistro +"</span></td>"+
                        "<td><span>"+ response.datosReg[index].idmanipulador+"</span></td>"+
                        "<td><input type='text' name='idpuesto' value='" + response.datosReg[index].idpuesto + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><select class='form-control selectReg' id='idturno_"+index+"' disabled=disable></select></td>"+
                        //"<td><input type='text' name='idpuesto' value='" + response.datosReg[index].idturno + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><div class='input-group date' id='fecha_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#fecha_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-calendar-alt'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' disabled='disable' /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><select class='form-control selectReg' id='idlinea"+index+"' disabled=disable></select></td>");
                       
                        $('#fecha_'+ index).datetimepicker({
                            locale: 'es',
                            format: 'DD-MM-YYYY',
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
                            if(response.turnos[i]==response.datosReg[index].idturno){
                                $("#idturno_"+index).append("<option value='"+ response.turnos[i]+"'selected>"+response.turnos[i] +"</option>")
                            }
                            else{
                                $("#idturno_"+index).append("<option value='"+ response.turnos[i]+"'>"+response.turnos[i] +"</option>")
                            }
                        }
                        
                        for (let l=0;l<response.lineas.length;l++){                            
                            if(response.lineas[l]==response.datosReg[index].idlinea){
                                $("#idlinea"+index).append("<option value='"+ response.lineas[l]+"'selected>"+response.lineas[l] +"</option>")
                            }
                            else{
                                $("#idlinea"+index).append("<option value='"+ response.lineas[l]+"'>"+response.lineas[l] +"</option>")
                            }
                        }

                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            //console.log(datos)
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
}

function updateReg(){
    var arrayData=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
                var data = {
                    "idregistro": $(this).find("td:nth-child(2) span").text(),
                    "idpuesto": $(this).find("td:nth-child(4) > input").val(),
                    "idturno": $(this).find("td:nth-child(5) .selectReg").val(),     
                    "fecha": $(this).find("td:nth-child(6) > div").datetimepicker('date').format('L'),
                    "horafin": $(this).find("td:nth-child(7) > div").datetimepicker('date').format('LT'),
                    "horainicio": $(this).find("td:nth-child(8) > div").datetimepicker('date').format('LT'),
                    "idlinea": $(this).find("td:nth-child(9) .selectReg").val(),
             }
             arrayData.push(data);
        }
    })
    console.log(arrayData)
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


// function borrarRegistro(){

// }