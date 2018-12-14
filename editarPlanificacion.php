<?php
    $DS = DIRECTORY_SEPARATOR;
    file_exists(__DIR__ . $DS . 'core' . $DS . 'Handler.php') ? require_once __DIR__ . $DS . 'core' . $DS . 'Handler.php' : die('Handler.php not found');
    file_exists(__DIR__ . $DS . 'core' . $DS . 'Config.php') ? require_once __DIR__ . $DS . 'core' . $DS . 'Config.php' : die('Config.php not found');

    use AjaxLiveSearch\core\Config;
    use AjaxLiveSearch\core\Handler;

    if (session_id() == '') {
        session_start();
    }

    $handler = new Handler();
    $handler->getJavascriptAntiBot();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/lib/tempusdominus-bootstrap-4.min.css"/>
    <link rel="stylesheet" type="text/css" href="css/styles.css">



    <title>Preferencias de Lineas</title>
</head>
<body>
    <?php 
        include("html/menu.php");
    ?>
            <div class="row align-items-end" id="cabecera">
                <div class="col-4 repartoDiaButtons">
                    <button type="button" id="guardarReparto" class="btn btn-primary" style="display:none"><i class="fas fa-users"></i> Guardar Reparto</button>
                    <button type='button' id="borrarRepartoDia" class="btn btn-danger float-left" style="display:none" data-toggle="modal" data-target="#modal_confirm_borrar"><i class='far fa-trash-alt'></i> Borrar Planificacion</button>              
                </div>
                <div class="col-4">
                    <h3 class="msg text-center">Editar Reparto</h3>
                </div>
                <div class="col-4">

                </div>
            </div>
        </div>
    
        <div class="manipulador" style="display:none">
            <label for="busqueda_manipulador">Búsqueda por <strong>Nombre,Apellidos o DNi</strong></label>
            <input type="text" class="form-control" id="busqueda_manipulador" placeholder="Escribe para buscar..." />
            <span class="error" style="display:none">No has seleccionado un manipulador</span>
            <!-- <input type="text" class="form-control" name="nombre" id="nombre" readonly style="width:550px"/> -->
            <select class='form-control selectReg' id='idlinea'></select>
            <button type='button' class='btn btn-seconday añadir' id="addManipuladorRepartoLinea"><i class='fas fa-plus-square'></i> Añadir</button>
            <input type="hidden" class="form-control" name="idmanipulador" id="idmanipulador"/>
        </div>
        <!-- <span id="spanPlanificarDia">Selecciona el dia para realizar el reparto</span>
        <div class="input-group dateReparto" id="fechaReparto" data-target-input="nearest">
            <input type="text" class="form-control datetimepicker-input" data-target="#fechaReparto" />
            <div class="input-group-append" data-target="#fechaReparto" data-toggle="datetimepicker">
                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
            </div>
        </div> -->
        <input type="hidden" class="form-control" name="fecha" id="fecha" value="<?php echo($_POST['fechaFormSend'])?>"/>
        <div class="table-responsive">
            
            
        </div>
    </div>
    <div class="mensaje" style="display:none"></div>

    <div class="modal fade" id="modal_confirm_borrar" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_borrar" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Confirmación</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <p id="mensaje_confirm_borrar">
                    ¿Esta seguro de que desea borrar todos los registros del dia actual?
                </p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-danger" id="borrar_Reparto_Dia">Borrar</button>
            </div>
        </div>
        </div>
    </div>
    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/lib/moment.min.js"></script>
    <script type="text/javascript" src="js/lib/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/lib/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>
    <script type="text/javascript" src="js/editarPlanificacionDia.js"></script>
    <script>
        $(function(){
            /* AJAX LIVE SEARCH ES UN FORMULARIO DE BUSQUEDA PHP QUE MUESTRA EL RESULTADO
               A MEDIDA QUE SE ESCRIBE SIMILAR A LA FUNCION DE AUTOCOMPLETAR DE GOOGLE
               https://github.com/iranianpep/ajax-live-search */
            $("#busqueda_manipulador").ajaxlivesearch({
                loaded_at: <?php echo time(); ?>,
                token: <?php echo "'" . $handler->getToken() . "'"; ?>,
                max_input: <?php echo Config::getConfig('maxInputLength'); ?>,
                onResultClick: function(e, data) {
                    // OBTENER EL VALOR DE LA PRIMERA COLUMNA (INDICE 0)
                    var idManipulador = $(data.selected).find('td').eq('0').text();
                    var nombre = $(data.selected).find('td').eq('1').text();
                    var apellidos = $(data.selected).find('td').eq('2').text();
                    // set the input value
                    $('#busqueda_manipulador').val(nombre + " " + apellidos);

                    // COMPROBAR QUE EL VALOR DEL INPUT NO ES EL DEL MENSAJE QUE APARECE CUANDO NO HAY RESULTADOS
                    var expreg = new RegExp("^There ");

                    /* ESTABLECER EL VALOR DEL INPUT Y DISPARADO MANUAL DEL EVENTO "CHANGE"
                       (SE USA SU CAPTURA PARA UN EVENTO DE COMPROBACION QUE ESTA EN EL ARCHIVO "descansos_script.js" ) */
                    if(!expreg.test(idManipulador)){
                        $('#idmanipulador').val(idManipulador).trigger("change");
                    }

                    // OCULTAR LA TABLA DE RESULTADOS
                    $("#busqueda_manipulador").trigger('ajaxlivesearch:hide_result');
                },
                onResultEnter: function(e, data) {
                    // OBTENER EL VALOR DE LA PRIMERA COLUMNA (INDICE 0)
                    var idManipulador = $(data.selected).find('td').eq('0').text();

                    // COMPROBAR QUE EL VALOR DEL INPUT NO ES EL DEL MENSAJE QUE APARECE CUANDO NO HAY RESULTADOS
                    var expreg = new RegExp("^There ");

                    /* ESTABLECER EL VALOR DEL INPUT Y DISPARADO MANUAL DEL EVENTO "CHANGE"
                       (SE USA SU CAPTURA PARA UN EVENTO DE COMPROBACION QUE ESTA EN EL ARCHIVO "descansos_script.js" ) */
                    if(!expreg.test(idManipulador)){
                        $('#idmanipulador').val(idManipulador).trigger("change");
                    }

                    // OCULTAR LA TABLA DE RESULTADOS
                    $("#busqueda_manipulador").trigger('ajaxlivesearch:hide_result');
                },
                onAjaxComplete: function(e, data) {
                    //
                }
            });
        });
    </script>

</body>
</html>