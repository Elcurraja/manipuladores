$(document).ready(function() {

    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_naves").on("change","td",function(){
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
    $("#tabla_naves").on("change", "div .checkedit", function(){
        var countchecked = false;
        $(".checkedit").each(function(){
            if($(this).is(":checked")){
                countchecked = true;
                return false;
            }
        });
        if(countchecked){
            $("#opciones .boton").css("display","block");
            // $("#opciones .boton").prop("disabled",false);
        }
        else{
            $("#opciones .boton").css("display","none");
            // $("#opciones .boton").prop("disabled",true);
        } 
    })
    showNaves()
});

function showNaves(){
    $.ajax({
        url:"php/naves_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"show"
        },
        success:function(response){
            $("#tabla_naves tbody").empty();
                for (let index = 0; index < response.datosNaves.length; index++){
                    $("#tabla_naves tbody").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<td><span>"+ response.datosNaves[index].idnave +"</span></td>"+
                        "<td><input type='text' class='form-control' name='designacion' id='designacion'value='"+ response.datosNaves[index].designacion+"'disabled='disable'/></td>");
                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            //console.log(datos)
            console.log("Error en la peticion AJAX para mostrar los registros de naves: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    })
}
//RECORREMOS TODAS LAS FILAS, BUSCAMOS LAS QUE ESTEN CHECKEADAS Y GUARDAMOS SUS DATOS.
//LOS ENVIAMOS MEDIANTE AJAX
function guardarCampos(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idnave": $(this).find("td:nth-child(2) span").text(),
                "designacion": $(this).find("td:nth-child(3) input").val()            
            };
            arrayDatos.push(datos);
        }
    })

    $.ajax({
        url:"php/naves_f.php",
        type:"POST",
        data:{
            "op": "update",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="naves.php";
            console.log('Update realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}
//RECORREMOS LAS FILAS, COGEMOS EL ID DE CADA FILA CHECKEADA Y LA BORRAMOS MEDIANTE AJAX
function borrarCampos(){
    
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idnave": $(this).find("td:nth-child(2) span").text()               
            };
            arrayDatos.push(datos);
        }
    })
    $.ajax({
        url:"php/naves_f.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="naves.php";
            console.log('Delete realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}

//RECOGEMOS LOS CAMPOS DEL MODAL PARA INSERTARLOS EN LA BD
function addNave(){
    $.ajax({
        url:"php/naves_f.php",
        type:"POST",
        data:{
            "op": "add",
            "designacion":$("#modal_designacion").val()
        },
        success:function(respuesta){
            location.href ="naves.php";
            console.log('Linea insertada correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}