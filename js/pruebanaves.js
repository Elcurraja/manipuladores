$(document).ready(function() {
    $.fn.dataTableExt.ofnSearch['html-input'] = function(value) {
        return $(value).val();
    }; 
    showNaves()

    var $tabs = $('#tabla1')
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

    var arrayLineas=[];
    var totalLineas = 0;
    $(".table").each(function(){
        totalLineas++
        var manipuladores = [{"nombre":"julio","apellidos":"gomez"},{"nombre":"andres","apellidos":"martin"},{"nombre":"pedro","apellidos":"diaz"}]
        arrayLineas[$(this).attr('id')]=manipuladores

        // for (let index = 0; index <= totalLineas; index++) {
        //     $("#tabla"+index+" .fila").each(function(){
        //         var datos = {
        //             "manipulador": $(this).find("span").text(),        
        //         };
               
        //         arrayManipuladoras[index].push(manipuladores,datos)
        //     })
        // }

    //     for (let index = 0; index <= totalLineas; index++) {
            
    //         $("#tabla"+index+" .fila").each(function(){
    //             var datos = {
    //                 "manipulador": $(this).find("span").text(),        
    //             };
    //             // console.log(arrayManipuladoras)
    //             arrayManipuladoras[index]=datos
    //        })
    //     }
    //     totalLineas++
    })
    console.log(arrayLineas)
}
function showNaves(){
    var array1 = [{"nombre":"julio","apellidos":"gomez"},{"nombre":"andres","apellidos":"martin"},{"nombre":"pedro","apellidos":"diaz"},]
    var array2 = [{"nombre":"julio","apellidos":"gomez"},{"nombre":"andres","apellidos":"martin"},{"nombre":"pedro","apellidos":"diaz"},]
    var array3 = [{"nombre":"julio","apellidos":"gomez"},{"nombre":"andres","apellidos":"martin"},{"nombre":"pedro","apellidos":"diaz"},]

    $("#tabla1 #tabla_datos,#tabla2 #tabla_datos,#tabla3 #tabla_datos").empty();
    for (let index = 0; index < array1.length; index++){
        $("#tabla1 .tabla_datos").append(
            "<tr class='fila'>"+
            // "<input type='hidden' value='" + array1[index].idnave + "' />" +
            "<td><span>"+ array1[index].nombre + " " + array1[index].apellidos +"</span></td>");
    }

    for (let index = 0; index < array2.length; index++){
        $("#tabla2 .tabla_datos").append(
            "<tr class='fila'>"+
            // "<input type='hidden' value='" + array2[index].idnave + "' />" +
            "<td><span>"+ array1[index].nombre + " " + array1[index].apellidos +"</span></td>");            
    }

    for (let index = 0; index < array3.length; index++){
        $("#tabla3 .tabla_datos").append(
            "<tr class='fila'>"+
            // "<input type='hidden' value='" + array3[index].idnave + "' />" +
            "<td><span>"+ array1[index].nombre + " " + array1[index].apellidos +"</span></td>");
    }
    
    // $.ajax({
    //     url:"php/naves_f.php",
    //     type:"POST",
    //     dataType: "json",
    //     data: {
    //         op:"show"
    //     },
    //     success:function(response){
    //         $("#tabla_naves #tabla_datos,#tabla_naves2 #tabla_datos").empty();
    //             for (let index = 0; index < response.array1.length; index++){
    //                 $("#tabla_naves #tabla_datos,#tabla_naves2 #tabla_datos").append(
    //                     "<tr class='fila'>"+
    //                     "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
    //                     "<input type='hidden' value='" + response.array1[index].idnave + "' />" +
    //                     "<td><input type='text' class='form-control' name='designacion' id='designacion'value='"+ response.array1[index].designacion+"'disabled='disable'/></td>");
    //                 }
    //     },
    //     error:function(jqXHR, textStatus, errorThrown){
    //         //console.log(datos)
    //         console.log("Error en la peticion AJAX para mostrar los registros de naves: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
    //     }
    // }).done(function(){
    //     $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
    //     /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
    //        DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
    //        CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
    //        QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
    //     tabla = $('#tabla_naves,#tabla_naves2').DataTable({
    //         // https://datatables.net/reference/option/order
    //         order: [[1, "asc"]],
    //         language: {
    //             "sProcessing":     "Procesando...",
    //             "sLengthMenu":     "Mostrar _MENU_ registros",
    //             "sZeroRecords":    "No se encontraron resultados",
    //             "sEmptyTable":     "Ningún dato disponible en esta tabla",
    //             "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    //             "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    //             "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    //             "sInfoPostFix":    "",
    //             "sSearch":         "Buscar:",
    //             "sUrl":            "",
    //             "sInfoThousands":  ",",
    //             "sLoadingRecords": "Cargando...",
    //             "oPaginate": {
    //                 "sFirst":    "Primero",
    //                 "sLast":     "Último",
    //                 "sNext":     "Siguiente",
    //                 "sPrevious": "Anterior"
    //             },
    //             "oAria": {
    //                 "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
    //                 "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    //             }
    //         },
    //         columnDefs: [
    //             /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE COMO ORDENABLE
    //                https://datatables.net/forums/discussion/21164/disable-sorting-of-one-column */
    //             { "orderable": false, "targets": 0 },
    //             /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE PARA LAS BUSQUEDAS DE DATATABLE
    //                https://datatables.net/reference/option/columns.searchable */
    //             { "searchable": false, "targets": 0 },
    //             /* CONFIGURACION PARA QUE AL ORDENAR Y BUSCAR LOS DATOS PUEDA LEERLOS DENTRO DE LOS INPUTS Y SELECTS DE LAS CELDAS
    //                https://stackoverflow.com/questions/40238819/jquery-datatables-sorting-a-select-inside-a-column */
    //             {
    //                 "type": "html-input",
    //                 "targets": [1]
    //             }
    //         ]
    //     });
    // });
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