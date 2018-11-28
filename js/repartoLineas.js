$(document).ready(function() {
    // $.fn.dataTableExt.ofnSearch['html-input'] = function(value) {
    //     return $(value).val();
    // }; 
    showManipuladoresReparto()

    var $tabs = $('.tablaindex')
    $("tbody.t_sortable").sortable({
        connectWith: ".t_sortable",
        items: "> tr",
        appendTo: $tabs,
        helper:"clone",
        zIndex: 999990
    }).disableSelection();
    
    var $tab_items = $(".nav-tabs > li", $tabs).droppable({
        accept: ".t_sortable tr",
        hoverClass: "ui-state-hover",
        drop: function( event, ui ) { return false; }
    });
});
function planificarDia(){
    var arrayLineas = [];
    var linea = 0;

    $(".table").each(function(){
        linea++
        var manipuladores = []
        $("#"+linea+" .fila").each(function(){
            var datos = {
                "id": $(this).find("input").val(),
                "manipulador": $(this).find("span").text(), 
            } 
           
            manipuladores.push(datos)
            console.log(datos)
        })
        var datosLineas = [$(this).attr('id'),manipuladores]
        arrayLineas.push(datosLineas)
    })

    console.log(arrayLineas)

    $.ajax({
        url:"php/registro_manipuladores_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"insertReg",
            datos:arrayLineas
        },
        success:function(response){
            // $('#mensaje').html(response.responseText)
            // console.log(response.responseText)

        },
        error:function(response,jqXHR, textStatus, errorThrown){
            $('#mensaje').html(response.responseText)
            console.log(response.responseText)
            
            console.log("Error en la peticion AJAX para mostrar los registros de naves: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    }).done(function(){

        });
}
function showManipuladoresReparto(){
    
    var manipuladores = [
        {"id":2,"manipuladores":[
            {"idmanipulador":1,"nombre":"julio","apellidos":"Gomez Restrepo"},
            {"idmanipulador":4,"nombre":"Lidia","apellidos":"Gomez Garcia lorca"},
            {"idmanipulador":10,"nombre":"Rago Upumeluf","apellidos":"Pilatos Bahamonte"}]
        },
        {"id":3,"manipuladores":[
            {"idmanipulador":2,"nombre":"Silvia","apellidos":"Gil Piñero"},
            {"idmanipulador":5,"nombre":"Manuela","apellidos":"Garcia"},
            {"idmanipulador":25,"nombre":"Odacow","apellidos":"Xojepuv Zafaledoxigano"}]
        },
        {"id":5,"manipuladores":[
            {"idmanipulador":9,"nombre":"Carles","apellidos":"Baixdemont Casamenó"},
            {"idmanipulador":16,"nombre":"Roberto","apellidos":"Antonio carrero"},
            {"idmanipulador":30,"nombre":"Musifoha","apellidos":"Rago Upumeluf"}]
        },
    ]
    //manipuladores[cadalinea][arraydemanipuladores]
    // console.log(manipuladores[0][1][0].nombre)

    for (let index = 0; index < manipuladores.length; index++) {
        if(index==0){
            var id =  manipuladores[index].id
        }
        else{
            var id = manipuladores[index].id
        }
        $(".table-responsive").append(
            "<div class='col-3 float-left'>"+
                "<h3>Linea "+ manipuladores[index].id+"</h3>"+
                "<table "+ (index == 0 ? 'class="table table-striped table-bordered tablaindex"': 'class="table table-striped table-bordered"') +" id='"+ id +"'>"+
                    "<thead class='thead-dark'>"+
                        "<tr><th scope='col'>Manipulador</th></tr>"+
                    "</thead>"+
                    "<tbody class='tabla_datos t_sortable'>"+
                        
                    "</tbody>"+
                "</table>"+
            "</div>")
        
    }
     $("#tabla_datos").empty();
    for (let index = 0; index < manipuladores.length; index++){
        // console.log(manipuladores[index].manipuladores.length)

        for (let indice = 0; indice < manipuladores[index].manipuladores.length; indice++){
            $("#"+ manipuladores[index].id +" .tabla_datos").append(
                "<tr class='fila'>"+
                "<input type='hidden' value='" + manipuladores[index].manipuladores[indice].idmanipulador + "' />" +
                "<td><span>"+ manipuladores[index].manipuladores[indice].nombre + " " + manipuladores[index].manipuladores[indice].apellidos +"</span></td>");
        }
    }
}
//RECORREMOS TODAS LAS FILAS, BUSCAMOS LAS QUE ESTEN CHECKEADAS Y GUARDAMOS SUS DATOS.
//LOS ENVIAMOS MEDIANTE AJAX
function guardarCampos(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idnave": $(this).find("> input").val(),
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
                "idnave": $(this).find("> input").val()               
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