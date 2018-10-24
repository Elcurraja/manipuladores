$(document).ready(function() {

    $('#fechaB').datetimepicker({
        locale: 'es',
        format: 'L',
    });
    $('#horai_').datetimepicker({
        locale: 'es',
        format: 'LT',
        date: moment("19:00:00","HH:mm")
    });
  
    $("#fechaB").on("change.datetimepicker ",function(){
        $('#fechaInfoInput').val($(this).datetimepicker('date').format('L'));
    })

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
})

function buscarReg(){
        var datos={
            op: "buscarReg",
            id: $("#manipulador").val(),
            fecha: $("#fechaB").datetimepicker('date').format('L'),
        }
    
    //console.log(datos)
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: datos,
        success:function(response){
            $("tbody#tablalineas").empty();
                for (let index = 0; index < response.datosReg.length; index++){
                    $("tbody#tablalineas").append(
                        "<tr class='fila'>"+
                        "<td><input type='checkbox' name='edit' class='checkedit'></td>"+
                        "<td><span>"+ response.datosReg[index].idregistro +"</span></td>"+
                        "<td><input type='text' name='idturno' value='" + response.datosReg[index].idturno + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><div class='input-group date' id='horai_"+index+"' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#horai_" + index +"' disabled='disable'><div class='input-group-append' data-target='#horai_" + index +"' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='horaf_"+index+"' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#horaf_" + index +"' disabled='disable'><div class='input-group-append' data-target='#horaf_" + index +"' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><input type='text' name='idlinea' value='" + response.datosReg[index].idlinea + "' class='input_s form-control' disabled='disable'></td>"
                        );
                
                        console.log(index == (response.datosReg.length-1))
                        if(index == (response.datosReg.length-1)){
                            $("tr.fila").append("<td><button type='button' id='reasignarLinea' class='btn btn-primary' onclick ='reasignarLinea();'>Reasignar</button></td>")
                        }
                        
                        $('#horai_'+ index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosReg[index].hora_inicio,"HH:mm")
                        });
                        $('#horaf_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            date: moment(response.datosReg[index].hora_fin,"HH:mm")
                        });
                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
    
}

