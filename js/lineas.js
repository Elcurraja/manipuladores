$(document).ready(function() {

    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_datos").on("change","td",function(){
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
    $("#tabla_datos").on("change", ".checkedit", function(){
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
    showLineas()
});

function showLineas(){
    $.ajax({
        url:"php/lineas_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"showLineas"
        },
        success:function(response){
            //console.log(response)
            $("tbody#tabla_datos").empty();
                for (let index = 0; index < response.lineas.length; index++){
                    
                    $("tbody#tabla_datos").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<td><span>"+ response.lineas[index].idlinea +"</span></td>"+
                        "<td><input type='text' name='nombre' value='" + response.lineas[index].nombre + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><select class='form-control selectFont' id='idnave"+index+"' disabled=disable></select>"+
                        "<td><select class='form-control selectFont' id='idtipolinea"+index+"' disabled=disable></select>"+
                        "<td><select class='form-control selectReg' id='disponible"+index+"' disabled=disable></select>"+
                        "<td><input type='text' name='puestosmax' value='" + response.lineas[index].puestosmax + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='fiabilidad' value='" + response.lineas[index].fiabilidad + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='velocidad' value='" + response.lineas[index].velocidad + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='disponibilidad' value='" + response.lineas[index].disponibilidad + "' class='input_s form-control' disabled='disable'></td>")
                    
                        for (let l=0;l<response.nave.length;l++){                            
                            if(response.nave[l].idnave==response.lineas[index].idnave){
                                $("#idnave"+index).append("<option value='"+ response.nave[l].idnave+"'selected>"+response.nave[l].designacion +"</option>")
                            }
                            else{
                                $("#idnave"+index).append("<option value='"+ response.nave[l].idnave+"'>"+response.nave[l].designacion +"</option>")
                            }
                        }

                        if(response.lineas[index].estadisponible==1){
                            $("#disponible"+index).append("<option value='1'selected>Si</option>")
                            $("#disponible"+index).append("<option value='0'>No</option>")
                        }
                        else {
                            $("#disponible"+index).append("<option value='1'>Si</option>")
                            $("#disponible"+index).append("<option value='0' selected>No</option>")
                        }
                            
                        for (let l=0;l<response.tipolinea.length;l++){                            
                            if(response.tipolinea[l]==response.lineas[index].idtipolinea){
                                    $("#idtipolinea"+index).append("<option value='"+ response.tipolinea[l].idtipolinea+"'selected>"+response.tipolinea[l].nombre +"</option>")
                                }
                                else{
                                    $("#idtipolinea"+index).append("<option value='"+ response.tipolinea[l].idtipolinea+"'>"+response.tipolinea[l].nombre +"</option>")
                                }
                            }
                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
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
                "IDlineas": $(this).find("td:nth-child(2) span").text(),
                "nombre": $(this).find("td:nth-child(3) input").val(),
                "IDnave": $(this).find("td:nth-child(4) .selectFont").val(),
                "IDtipolinea": $(this).find("td:nth-child(5) .selectFont").val(),
                "disponible": $(this).find("td:nth-child(6) .selectReg").val(),
                "puestosmax": $(this).find("td:nth-child(7) input").val(),
                "fiabilidad": $(this).find("td:nth-child(8) input").val(),
                "velocidad": $(this).find("td:nth-child(9) input").val(),
                "disponibilidad": $(this).find("td:nth-child(10) input").val()                 
            };
            arrayDatos.push(datos);
        }
    })

    $.ajax({
        url:"php/lineas_f.php",
        type:"POST",
        data:{
            "op": "update",
            "datos":arrayDatos,
        },
        success:function(response){
            location.href ="./lineas.php";
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
                "IDlineas": $(this).find("td:nth-child(2) span").text()               
            };
            arrayDatos.push(datos);
        }
    })
    $.ajax({
        url:"php/lineas_f.php",
        type:"POST",
        data:{
            "op": "delete",
            "datos":arrayDatos,
        },
        success:function(respuesta){
            location.href ="./lineas.php";
            //console.log('Delete realizado correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}

//RECOGEMOS LOS CAMPOS DEL MODAL PARA INSERTARLOS EN LA BD
function addlinea(){
    $.ajax({
        url:"php/lineas_f.php",
        type:"POST",
        data:{
            "op": "add",
            "nombre":$("#modalLineas #nombre").val(),
            "idnave":$("#modalLineas #idnave").val(),
            "idtipolinea":$("#modalLineas #idtipolinea").val(),
            "disponible":$("#modalLineas #disponible").val(),
            "puestosmax":$("#modalLineas #puestosmax").val(),
            "fiabilidad":$("#modalLineas #fiabilidad").val(),
            "velocidad":$("#modalLineas #velocidad").val(),
            "disponibilidad":$("#modalLineas #disponibilidad").val()
        },
        success:function(response){
        location.href ="./lineas.php";
            console.log('Linea insertada correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}