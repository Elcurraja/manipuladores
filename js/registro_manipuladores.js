$(document).ready(function() {
   
   
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
        var elementos = $(this).parent()[];
        console.log(elementos)
    
    })
    

    $('#busqueda_fecha').datetimepicker({
        locale: 'es',
        format: 'L',
    });
    //LIMPIAR EL INPUT DE DATE PARA MOSTRAR TODOS LOS REGISTOS DE NUEVO
    $('#mostrarTodos').click(function(){
        $("#busqueda_fecha").datetimepicker('clear')
        mostrarRegistro()
    })

    mostrarRegistro()
})


function mostrarRegistro(){
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
    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: datos,
        success:function(response){
            //console.log(response.datos.length)
            $("tbody").empty();
                for (let index = 0; index < response.datos.length; index++){
                    $("tbody").append(
                        "<tr class='fila'>"+
                        "<td><input type='checkbox' name='edit' class='checkedit'></td>"+
                        "<td><span>"+ response.datos[index].idregistro +"</span></td>"+
                        "<td><span>"+ response.datos[index].idmanipulador+"</span></td>"+
                        "<td><input type='text' name='idpuesto' value='" + response.datos[index].idpuesto + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='idpuesto' value='" + response.datos[index].idturno + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><div class='input-group date' id='fecha_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#fecha_" + index + "' readonly /><div class='input-group-append' data-target='#fecha_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-calendar'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_inicio_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_inicio_" + index + "' readonly /><div class='input-group-append' data-target='#hora_inicio_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-calendar'></i></div></div></div></td>"+
                        "<td><div class='input-group date' id='hora_fin_" + index + "' data-target-input='nearest'><input type='text' class='form-control datetimepicker-input' data-target='#hora_fin_" + index + "' readonly /><div class='input-group-append' data-target='#hora_fin_" + index + "' data-toggle='datetimepicker'><div class='input-group-text'><i class='fa fa-calendar'></i></div></div></div></td>"+
                        "<td><input type='text' name='idpuesto' value='" + response.datos[index].idlinea + "' class='input_s form-control' disabled='disable'></td>")
                        $('#fecha_' + index).datetimepicker({
                            locale: 'es',
                            format: 'DD-MM-YYYY',
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: response.datos[index].fecha
                        });
                        $('#hora_inicio_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: moment(response.datos[index].hora_inicio,"HH:mm:ss")
                        });
                        $('#hora_fin_' + index).datetimepicker({
                            locale: 'es',
                            format: 'LT',
                            /* FORMA CORRECTA DE ESTABLECER MANUALMENTE EL VALOR DEL INPUT PARA TEMPUSDOMINUS
                               https://stackoverflow.com/questions/46940928/datetimepicker-erasing-value-from-input-if-value-exists-at-page-load */
                            date: moment(response.datos[index].hora_fin,"HH:mm:ss")
                        });
                }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los descansos: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
}