$(document).ready(function() {
    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_tipo_lineas").on("change", "td", function(){
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
    $("#tabla_tipo_lineas").on("change", "div .checkedit", function(){
        var countchecked = false;
        $(".checkedit").each(function(){
            if($(this).is(":checked")){
                countchecked = true;
                return false;
            }
        });
        if(countchecked){
            $("#opciones .boton").css("display","block");
        }
        else{
            $("#opciones .boton").css("display","none");
        } 
    })
    showTipoLinea()
})
function showTipoLinea(){
    $.ajax({
        url:"php/tipo_lineas_f.php",
        type:"POST",
        dataType: "json",
        data: {
            op:"show"
        },
        success:function(response){
            $("#tabla_tipo_lineas #tabla_datos").empty();
                for (let index = 0; index < response.datosTipoLinea.length; index++){
                    $("#tabla_tipo_lineas #tabla_datos").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<input type='hidden' value='" + response.datosTipoLinea[index].idtipolinea + "' />" +
                        "<td><input type='text' class='form-control' name='designacion' id='nombre'value='"+ response.datosTipoLinea[index].nombre+"'disabled='disable'/></td>");
                    }
        },
        error:function(jqXHR, textStatus, errorThrown){
            //console.log(datos)
            console.log("Error en la peticion AJAX para mostrar los registros de naves: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    }).done(function(){
        $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
           DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
           CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
           QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
        tabla = $('#tabla_tipo_lineas').DataTable({
            // https://datatables.net/reference/option/order
            order: [[1, "asc"]],
            language: {
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningún dato disponible en esta tabla",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            columnDefs: [
                /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE COMO ORDENABLE
                   https://datatables.net/forums/discussion/21164/disable-sorting-of-one-column */
                { "orderable": false, "targets": 0 },
                /* CONFIGURACION PARA QUE LA COLUMNA DE LOS CHECKBOXES NO COMPUTE PARA LAS BUSQUEDAS DE DATATABLE
                   https://datatables.net/reference/option/columns.searchable */
                { "searchable": false, "targets": 0 },
                /* CONFIGURACION PARA QUE AL ORDENAR Y BUSCAR LOS DATOS PUEDA LEERLOS DENTRO DE LOS INPUTS Y SELECTS DE LAS CELDAS
                   https://stackoverflow.com/questions/40238819/jquery-datatables-sorting-a-select-inside-a-column */
                {
                    "type": "html-input",
                    "targets": [1]
                }
            ]
        });
    });
}
//RECORREMOS TODAS LAS FILAS, BUSCAMOS LAS QUE ESTEN CHECKEADAS Y GUARDAMOS SUS DATOS.
//LOS ENVIAMOS MEDIANTE AJAX
function guardarCampos(){
    var arrayDatos=[];
    $(".fila").each(function(){
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "idtipolinea": $(this).find("> input").val(),
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
                "idtipolinea": $(this).find("> input").val()               
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
            "nombre":$("#modalTipoLinea #nombre").val()
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