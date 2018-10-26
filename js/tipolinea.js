$(document).ready(function() {
    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("td").change(function(){
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
})

//RECORREMOS TODAS LAS FILAS, BUSCAMOS LAS QUE ESTEN CHECKEADAS Y GUARDAMOS SUS DATOS.
//LOS ENVIAMOS MEDIANTE AJAX
function guardarCampos(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idtipolinea": $(this).find("td:nth-child(2) span").text(),
                "nombre": $(this).find("td:nth-child(3) input").val()           
            };
            arrayDatos.push(datos);
        }
    })
    
 $.ajax({
        url:"php/tipo_lineas_f.php",
        type:"POST",
        data:{
            op: "update",
            datos:arrayDatos
        },
        success: function(response){
            var json = JSON.parse(response.error);
            if (json.error == 1) {
                console.log("Error en php: " + json.mensaje);
            }
        },
        error: function(response,jqXHR,textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        location.href ="tipolineas.php";
    });
}
//RECORREMOS LAS FILAS, COGEMOS EL ID DE CADA FILA CHECKEADA Y LA BORRAMOS MEDIANTE AJAX
function borrarCampos(){
    
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idtipolinea": $(this).find("td:nth-child(2) span").text()               
            };
            arrayDatos.push(datos);
        }
    })
    $.ajax({
        url:"php/tipo_lineas_f.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            //$('body').empty().html(respuesta);
            location.href ="tipolineas.php";
            console.log('Delete realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}

//RECOGEMOS LOS CAMPOS DEL MODAL PARA INSERTARLOS EN LA BD
function addTipoLinea(){
    $.ajax({
        url:"php/tipo_lineas_f.php",
        type:"POST",
        data:{
            "op": "add",
            "nombre":$("#nombre").val()
        },
        success:function(respuesta){
            location.href ="tipolineas.php";
            console.log('Linea insertada correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}