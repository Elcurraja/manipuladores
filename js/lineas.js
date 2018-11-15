$(document).ready(function() {
    $.fn.dataTableExt.ofnSearch['html-input'] = function(value) {
        return $(value).val();
    }; 
    $.fn.dataTableExt.order['html-select'] = function  ( settings, col )
    {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            return $('select', td).val();
        } );
    } 

    //DESHABILITAMOS O HABILITAMOS LA FILA DE INPUTS SI ESTA MARCADO EL CHECKBOX
    $("#tabla_lineas").on("change","td",function(){
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
    $("#tabla_lineas").on("change", ".checkedit", function(){
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
           
            $("tbody#tabla_datos").empty();
                for (let index = 0; index < response.lineas.length; index++){
                    
                    $("tbody#tabla_datos").append(
                        "<tr class='fila'>"+
                        "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='checkedit custom-control-input' id='customCheck"+ index+"'><label class='custom-control-label' for='customCheck"+ index+"'></label></div></td>'"+
                        "<input type='hidden' value='" + response.lineas[index].idlinea + "' />" +
                        "<td><input type='text' name='nombre' value='" + response.lineas[index].nombre + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><select class='form-control' id='idnave"+index+"' disabled=disable></select>"+
                        "<td><select class='form-control' id='idtipolinea"+index+"' disabled=disable></select>"+
                        "<td><select class='form-control' id='disponible"+index+"' disabled=disable></select>"+
                        "<td><input type='text' name='puestosmax' value='" + response.lineas[index].puestosmax + "' class='input_s form-control' disabled='disable'></td>"+
                        "<td><select class='form-control' id='fiabilidad"+ index+"' disabled=disable></select></td>"+
                        "<td><select class='form-control' id='velocidad"+ index+"' disabled=disable></select></td>"+
                        "<td><select class='form-control' id='disponibilidad"+ index+"' disabled=disable></select></td></tr>")
                        
                        //Generar el select para las naves
                        for (let l=0;l<response.nave.length;l++){                            
                            if(response.nave[l].idnave==response.lineas[index].idnave){
                                $("#idnave"+index).append("<option value='"+ response.nave[l].idnave+"'selected>"+response.nave[l].designacion +"</option>")
                            }
                            else{
                                $("#idnave"+index).append("<option value='"+ response.nave[l].idnave+"'>"+response.nave[l].designacion +"</option>")
                            }
                        }
                        //Generar el select para "Disponible"
                        if(response.lineas[index].estadisponible==1){
                            $("#disponible"+index).append("<option value='1'selected>Si</option>")
                            $("#disponible"+index).append("<option value='0'>No</option>")
                        }
                        else {
                            $("#disponible"+index).append("<option value='1'>Si</option>")
                            $("#disponible"+index).append("<option value='0' selected>No</option>")
                        }
                        //Generar el select para el tipo de linea   
                        for (let l=0;l<response.tipolinea.length;l++){                            
                            if(response.tipolinea[l].idtipolinea==response.lineas[index].idtipolinea){
                                $("#idtipolinea"+index).append("<option value='"+ response.tipolinea[l].idtipolinea+"'selected>"+response.tipolinea[l].nombre +"</option>")
                            }
                            else{
                                $("#idtipolinea"+index).append("<option value='"+ response.tipolinea[l].idtipolinea+"'>"+response.tipolinea[l].nombre +"</option>")
                            }
                        }

                        //Generar el select para fiabilidad
                        for (let i=0;i<=9;i++){                            
                            if(i==response.lineas[index].fiabilidad){
                                $("#fiabilidad"+index).append("<option value='"+ i +"'selected>"+ i +"</option>")
                            }
                            else{
                                $("#fiabilidad"+index).append("<option value='"+ i +"'>"+ i +"</option>")
                            }
                        }

                        //Generar el select para velocidad
                        for (let i=0;i<=9;i++){                            
                            if(i==response.lineas[index].velocidad){
                                $("#velocidad"+index).append("<option value='"+ i +"'selected>"+ i +"</option>")
                            }
                            else{
                                $("#velocidad"+index).append("<option value='"+ i +"'>"+ i +"</option>")
                            }
                        }

                        //Generar el select para disponibilidad
                        for (let i=0;i<=9;i++){                            
                            if(i==response.lineas[index].disponibilidad){
                                $("#disponibilidad"+index).append("<option value='"+ i +"'selected>"+ i +"</option>")
                            }
                            else{
                                $("#disponibilidad"+index).append("<option value='"+ i +"'>"+ i +"</option>")
                            }
                        }
                        
                    }
                    
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX para mostrar los registros: " + JSON.stringify(jqXHR) + ", " + errorThrown + ", " + textStatus);
        }
    
    }).done(function(){
        $("#guardar_cambios_btn, #aviso_borrar_btn").css("display", "none");
        /* CREACION DE LA DATATABLE UNA VEZ LA TABLA ESTA FORMADA. SE INICIA CON LAS OPCIONES DE NO ORDENAR POR
           DEFECTO POR LA PRIMERA COLUMNA (SOLO CONTIENE CHECKBOXES) SINO LA TERCERA (APELLIDOS), CABECERA FIJA
           CON OFFSET A LA ANCHURA DEL MENU (PARA QUE NO SE OCULTE POR DEBAJO), LENGUAJE EN CASTELLANO, Y
           QUE NO HAGA ORDENABLE LA PRIMERA COLUMNA NI USE SU CONTENIDO EN LAS BUSQUEDAS DE LA DATATABLE */
        tabla = $('#tabla_lineas').DataTable({
            // https://datatables.net/reference/option/order
            order: [[2, "asc"]],
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
                },
                { 
                    "orderDataType": "html-select",
                    "targets": [2, 3, 4]
                },
                // {
                //     "type": "dom-select",
                //     "targets": [2, 3, 4]
                // },
                {
                    targets: [5,6,7,8], 
                    render: function(data, type, full, meta){
                        if(type === 'filter' || type === 'sort'){
                            var api = new $.fn.dataTable.Api(meta.settings);
                            var td = api.cell({row: meta.row, column: meta.col}).node();
                            data = $('select, input', td).val();
                            /* if (esNumerico(data)) {
                                return parseFloat(data);
                            } */
                        }
                        return data;
                    }
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
        // console.log(this)
        if($(this).find("input:checked").is(":checked")){
            var datos = {
                "IDlineas": $(this).find(">input").val(),
                "nombre": $(this).find("td:nth-child(3) input").val(),
                "IDnave": $(this).find("td:nth-child(4) select").val(),
                "IDtipolinea": $(this).find("td:nth-child(5) select").val(),
                "disponible": $(this).find("td:nth-child(6) select").val(),
                "puestosmax": $(this).find("td:nth-child(7) input").val(),
                "fiabilidad": $(this).find("td:nth-child(8) select").val(),
                "velocidad": $(this).find("td:nth-child(9) select").val(),
                "disponibilidad": $(this).find("td:nth-child(10) select").val()                 
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
            // alert('Registros modificados correctamente')
            location.href ="./lineas.php";
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
                "IDlineas": $(this).find(">input").val()               
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
            //console.log('Linea insertada correctamente');
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("Error en la peticion AJAX: " + errorThrown + ", " + textStatus);
        }
    });
}