$(function(){
    
    showManipuladoresReparto($("#fecha").val())
})
function showManipuladoresReparto(fecha){
        
    $.ajax({
        url: "php/editarPlanificacionDia_f.php",
        type: "post",
        dataType: "json",
        data: {
            op: "mostrarPlanificacionDia",
            fecha:fecha
        },
        success: function(response){
            if (response.error == 1) {
                console.log(response.mensaje);
            }
            else{
                $(".table-responsive").empty()
                for (let index = 0; index < response.datosPlanificacionDia.idlinea.length; index++) {
                    $(".table-responsive").append(
                                "<input type='hidden' id='fechaARepartir' value='" + fecha + "'>" +
                                "<div class='col-3 float-left'>"+
                                    "<h3>"+ response.datosPlanificacionDia[index].idlinea+"</h3>"+
                                    "<table "+ (index == 0 ? 'class="table  table-striped table-bordered tablaindex"': 'class="table  table-striped table-bordered"') +" id='"+ response.datosPlanificacionDia[index].idlinea +"'>"+
                                        "<thead class='thead-dark'>"+
                                            "<tr><th scope='col'>Manipulador</th>"+
                                            "<th scope='col'>#</th></tr>"+
                                        "</thead>"+
                                        "<tbody class='datos_planificacion_dia t_sortable'>"+
                                            
                                        "</tbody>"+
                                    "</table>"+
                                "</div>"+
                                (index==3 || (index>0 && index+1%4==0) ? "<div class='clearfix'></div>":""))
                }
                $("#datos_reparto_lineas").empty();
                // for (let index = 0; index < manipuladores.length; index++){
                //     for (let indice = 0; indice < manipuladores[index].manipuladores.length; indice++){
                //         $("#"+ manipuladores[index].id +" tbody").append(
                //             "<tr class='fila'>"+
                //             "<input type='hidden' value='" + manipuladores[index].manipuladores[indice].idmanipulador + "' />" +
                //             "<td><span>"+ manipuladores[index].manipuladores[indice].nombre + " " + manipuladores[index].manipuladores[indice].apellidos +"</span></td>"+
                //             "<td><button type='button' class='btn btn-danger borrar'><i class='fas fa-minus-square'></i></button>");
                //     }
                //     $("select#idlinea").append("<option value='" + manipuladores[index].id + "'>" + manipuladores[index].nombreLinea +"</option>")
                // }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para comprobar si existen una planificacion: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    });

    // $(".table-responsive").empty()    
    // for (let index = 0; index < manipuladores.length; index++) {
    //     $(".table-responsive").append(
    //         "<input type='hidden' id='fechaARepartir' value='" + fecha + "'>" +
    //         "<div class='col-3 float-left'>"+
    //             "<h3>"+ manipuladores[index].nombreLinea+"</h3>"+
    //             "<table "+ (index == 0 ? 'class="table  table-striped table-bordered tablaindex"': 'class="table  table-striped table-bordered"') +" id='"+ manipuladores[index].id +"'>"+
    //                 "<thead class='thead-dark'>"+
    //                     "<tr><th scope='col'>Manipulador</th>"+
    //                     "<th scope='col'>#</th></tr>"+
    //                 "</thead>"+
    //                 "<tbody class='datos_reparto_lineas t_sortable'>"+
                        
    //                 "</tbody>"+
    //             "</table>"+
    //         "</div>"+
    //         (index==3 || (index>0 && index+1%4==0) ? "<div class='clearfix'></div>":""))
        
    // }
    //  $("#datos_reparto_lineas").empty();
    // for (let index = 0; index < manipuladores.length; index++){
    //     for (let indice = 0; indice < manipuladores[index].manipuladores.length; indice++){
    //         $("#"+ manipuladores[index].id +" tbody").append(
    //             "<tr class='fila'>"+
    //             "<input type='hidden' value='" + manipuladores[index].manipuladores[indice].idmanipulador + "' />" +
    //             "<td><span>"+ manipuladores[index].manipuladores[indice].nombre + " " + manipuladores[index].manipuladores[indice].apellidos +"</span></td>"+
    //             "<td><button type='button' class='btn btn-danger borrar'><i class='fas fa-minus-square'></i></button>");
    //     }
    //     $("select#idlinea").append("<option value='" + manipuladores[index].id + "'>" + manipuladores[index].nombreLinea +"</option>")
    // }

    // $("#spanPlanificarDia,#fechaReparto,#repartir").css("display","none")

    // $("#confirmarReparto").css("display","block")
    // $(".manipulador").css("display","block")
}