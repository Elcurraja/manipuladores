$(document).ready(function() {

    $('#fechaB').datetimepicker({
        locale: 'es',
        format: 'L',
    });
  
    $("#fechaB").on("change.datetimepicker ",function(){
        $('#fechaInfoInput').val($(this).datetimepicker('date').format('L'));
    })
})

function buscarReg(){
    var datos={
        op: "buscarReg",
        id: $("#manipulador").val(),
        fecha: $("#fechaB").datetimepicker('date').format('L'),
    }
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: datos,
        success:function(response){
            $("tbody#tablalineas").empty();
                for (let index = 0; index < response.datosReg.length; index++){
                    $("tbody#tablalineas").append(
                        "<tr class='fila' id='fila"+ index +"'>"+
                        "<td><div class='input-group date' id='horai_"+index+"' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#horai_" + index +"' readonly><div class='input-group-append' data-target='#horai_" + index +"' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='horaf_"+index+"' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#horaf_" + index +"' readonly><div class='input-group-append' data-target='#horaf_" + index +"' data-toggle='datetimepicker'><div class='input-group-text'><i class='far fa-clock'></i></div></div></div></td>"+
                        "<td><input type='text' id='linea"+index+"' name='linea' value='' class='input_s form-control' readonly></td>"+
                        "<input type='hidden' value='" + response.datosReg[index].idlinea + "' id='idlinea'/>"+
                        "<input type='hidden' value='" + response.datosReg[index].idturno + "' id='idturno'/>"+
                        "<input type='hidden' value='" + response.turnos[index].franja + "' id='turno'/>"+
                        "<input type='hidden' value='" + response.datosReg[index].idregistro + "' id='idregistro'/>");
                        //Comprobamos si es el ultimo registro para insertarle el boton de "Reasignar"
                        if(index == (response.datosReg.length-1)){
                            $("tr.fila:last-child").append("<td><button type='button' id='reasignarLinea' class='btn btn-primary' onclick ='modalReasignarLinea();'>Reasignar</button></td>")
                        }
                        else{
                            $("#fila"+index).append("<td></td>")
                        }
                        //Inicializamos las horas
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
                        for (let l=0;l<response.lineas.length;l++){
                            if(response.lineas[l].idlinea==response.datosReg[index].idlinea){
                                $("#linea"+index).val(response.lineas[l].nombre)
                            }
                        }
                    }    
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
}
//RECOGEMOS LOS DATOS DEL REGISTRO CON EL BOTON PARA REASIGNAR Y SE LOS MANDAMOS AL MODAL
function modalReasignarLinea(){
    //ASIGNAMOS LOS VALORES EN LOS INPUTS DEL MODAL
    $("#modalReasignarLinea #linea").val($("tr.fila:last-child").find(":nth-child(3) > input").val())
    $("#modalReasignarLinea #idturno").val($("#idturno").val())
    $("#modalReasignarLinea #turno").val($("#turno").val())
    $("#modalReasignarLinea #idregistro").val($("#idregistro").val())
    $("#modalReasignarLinea #idmanipulador").val($("#manipulador").val())
    $("#modalReasignarLinea #fecha").val($("#fechaB").datetimepicker('date').format('L'))
    var idlinea = $("#idlinea").val()
    var horainicio=$("tr.fila:last-child").find("td:nth-child(1) > div").datetimepicker('date').format('LT')
    var horafin= $("tr.fila:last-child").find("td:nth-child(2) > div").datetimepicker('date').format('LT')
    console.log(horainicio + " ++ " + horafin)
    $.ajax({
        url:"php/lineas_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"getLineas"
        },
        success:function(response){
            for (let l=0;l<response.lineas.length;l++){                      
                if(response.lineas[l].idlinea==idlinea){
                    $("#modalReasignarLinea #idlinea").append("<option value='"+ response.lineas[l].idlinea+"'selected>" + response.lineas[l].nombre + "</option>")
                }
                else{
                    $("#modalReasignarLinea #idlinea").append("<option value='"+ response.lineas[l].idlinea+"'>" + response.lineas[l].nombre + "</option>")
                }
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });    
    $('#hora_inicio_rl').datetimepicker({
        locale: 'es',
        format: 'LT',
        date: moment(horainicio,"HH:mm")
    });
    $('#hora_fin_rl').datetimepicker({
        locale: 'es',
        format: 'LT',
        date: moment(horafin,"HH:mm")
    });

    $('#modalReasignarLinea').modal('show')

}

//RECOGEMOS LOS DATOS DEL MODAL, HACEMOS UNA PETICION AJAX PARA INSERTAR EL NUEVO REGISTRO 
//Y PARA ACTUALIZAR EL ULTIMO REGISTRO QUE HEMOS REASIGNADO
function reasignarLinea(){
    var datos = {
        "op": "reasignarLinea",
        "idregistro":$("#idregistro").val(),
        "idmanipulador":$("#idmanipulador").val(),
        "fecha":$("#fecha").val(),
        "idturno":$("#idturno").val(),
        "horainicio":$("#hora_inicio_rl").datetimepicker('date').format('LT'),
        "horafin":$("#hora_fin_rl").datetimepicker('date').format('LT'),
        "idlinea":$("#idlinea").val(),
    }
    console.log(datos)
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        data: datos,
        success: function(response){
            if (response.error == 1) {
                console.log("Error en php: " + json.mensaje);
            }
        },
        error: function(response,jqXHR,textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        location.href ="reasignar_linea.php";
    });
}

