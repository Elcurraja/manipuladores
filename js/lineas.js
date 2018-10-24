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
            // $("#opciones").css("display","block");
            $("#opciones .boton").prop("disabled",false);
        }
        else{
            // $("#opciones").css("display","none");
            $("#opciones .boton").prop("disabled",true);
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
                    if(response.lineas[index].estadisponible==1){
                        var disponible="Si"
                    }
                    else var disponible="No"
                    $("tbody#tabla_datos").append(
                        "<tr class='fila'>"+
                        "<td><input type='checkbox' name='edit' class='checkedit'></td>"+
                        "<td><span>"+ response.lineas[index].idlinea +"</span></td>"+
                        "<td><input type='text' name='nombre' value='" + response.lineas[index].nombre + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><select class='form-control selectReg' id='idnave"+index+"' disabled=disable></select>"+
                        "<td><select class='form-control selectReg' id='idtipolinea"+index+"' disabled=disable></select>"+
                        "<td><input type='text' name='disponible' value='" + disponible + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='puestosmax' value='" + response.lineas[index].puestosmax + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='fiabilidad' value='" + response.lineas[index].fiabilidad + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='velocidad' value='" + response.lineas[index].velocidad + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><input type='text' name='disponibilidad' value='" + response.lineas[index].disponibilidad + "' class='input_s form-control' disabled='disable'></td>")
                    
                        for (let l=0;l<response.idnave.length;l++){                            
                        if(response.idnave[l]==response.lineas[index].idnave){
                                $("#idnave"+index).append("<option value='"+ response.idnave[l]+"'selected>"+response.idnave[l] +"</option>")
                            }
                            else{
                                $("#idnave"+index).append("<option value='"+ response.idnave[l]+"'>"+response.idnave[l] +"</option>")
                            }
                        }
                        for (let l=0;l<response.idtipolinea.length;l++){                            
                            if(response.idtipolinea[l]==response.lineas[index].idtipolinea){
                                    $("#idtipolinea"+index).append("<option value='"+ response.idtipolinea[l]+"'selected>"+response.idtipolinea[l] +"</option>")
                                }
                                else{
                                    $("#idtipolinea"+index).append("<option value='"+ response.idtipolinea[l]+"'>"+response.idtipolinea[l] +"</option>")
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
            if($(this).find("td:nth-child(6) input").val()=="Si"){
                var disponible = 1
            }
            else var disponible=2
            var datos = {
                "IDlineas": $(this).find("td:nth-child(2) span").text(),
                "nombre": $(this).find("td:nth-child(3) input").val(),
                "IDnave": $(this).find("td:nth-child(4) .selectReg").val(),
                "IDtipolinea": $(this).find("td:nth-child(5) .selectReg").val(),
                "disponible": disponible,
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
            "nombre":$("#nombre").val(),
            "idnave":$("#idnave").val(),
            "idtipolinea":$("#idtipolinea").val(),
            "disponible":$("#disponible").val(),
            "puestosmax":$("#puestosmax").val(),
            "fiabilidad":$("#fiabilidad").val(),
            "velocidad":$("#velocidad").val(),
            "disponibilidad":$("#disponibilidad").val()
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