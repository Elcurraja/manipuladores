$(document).ready(function() {

      /* INICIADO DEL PLUGIN TEMPUS DOMINUS PARA LOS INPUT "HORA INICIO, FIN Y DATE"
    EN EL MOMENTO DE AÑADIR UNA AUSENCIA
       https://tempusdominus.github.io/bootstrap-4/Usage/#time-only */
    $('#hora_fin').datetimepicker({
       locale: 'es',
       format: 'LT',
       stepping: "5"
    });

    $('#hora_inicio').datetimepicker({
        locale: 'es',
        format: 'LT',
        stepping: "5"
    });
    $('#fecha').datetimepicker({
        locale: 'es',
        format: 'L',
    });

    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla td").change(function(){
        var elementos = $(this).parent()[0];
        if($(elementos).find("input:checked").val()){
            var hijos =$(elementos).find("input[type=text]").prop("disabled",false);
            $(elementos).css('background-color','#FFE189')    
        }
        else {
            var hijos =$(elementos).find("input[type=text]").prop("disabled",true);
            $(elementos).css('background-color','')
        }
    })
    //MOSTRAMOS U OCULTAMOS EL MENU PARA GUARDAR O BORRAR
    $(".checkedit").on("change",function(){
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

    $('#esdiacompleto').change(function(){
        
        if ($('#esdiacompleto').val()==1){
            $('.hora').css("display","none")
        }
        else {
            $('.hora').css("display","table-row")
        }
    })

});

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
        url:"ausencias.php",
        type:"POST",
        data: datos,
        success:function(respuesta){
            location.href ="./ausencias.php";
            console.log('Linea insertada correctamente');
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
        url:"ausencias.php",
        type:"POST",
        data:{
            "op": "update",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="./ausencias.php";
            //console.log(respuesta)
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
        url:"ausencias.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success:function(respuesta){
           
            location.href ="./ausencias.php";
            console.log('Delete realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}
