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

$('#busqueda_fecha').datetimepicker({
    locale: 'es',
    format: 'L',
});

function mostrarRegistroPorFecha(){
   
    $.ajax({
        url:"registro_manipuladores.php",
        type:"POST",
        data: {
            op:"busqueda_fecha",
            fecha:$("#busqueda_fecha").datetimepicker('date').format('L'),
        },
        success:function(response){
            //$('body').empty().html(response);
         
        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
}