<?php
    // CONFIGURACION INICIAL PARA EL PLUGIN DE JQUERY AJAXLIVESEARCH
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
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <!-- ES NECESARIO CARGAR LOS PLUGINS EN ESTE ORDEN, DE LO CONTRARIO PUEDEN NO FUNCIONAR CORRECTAMENTE -->
    <link rel="stylesheet" href="css/lib/bootstrap.min.css" />
    <link rel="stylesheet" href="css/lib/tempusdominus-bootstrap-4.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
    <link rel="stylesheet" href="css/lib/fontello.css" />
    <link rel="stylesheet" href="css/lib/animation.css" />
    <link rel="stylesheet" type="text/css" href="css/lib/datatables.min.css" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    
    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/lib/moment.min.js"></script>
    <script type="text/javascript" src="js/lib/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/lib/datatables.min.js"></script>
    <script type="text/javascript" src="js/lib/datetime-moment.js"></script>
    <script type="text/javascript" src="js/lib/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>
    <script type="text/javascript" src="js/descansos_script.js"></script>
    <title>Acciones sobre Descansos</title>
</head>
<body>
    <?php 
        include("html/menu.php");
    ?>
            <div class="row align-items-end" id="cabecera">
                <div class="col-3">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal_anyadir_descanso" ><i class="far fa-plus-square"></i> Añadir Nuevo</button>
                </div>
                <div class="col-6">
                    <h3 class="msg text-center">Descansos</h3>
                </div>
                <div class="col-3">
                    <div class="btn-group" role="group" id="grupo_actualizar_borrar_btns">
                        <button type="button" class="btn btn-warning" id="guardar_cambios_btn" ><i class="far fa-save"></i> Guardar cambios</button>
                        <button type="button" class="btn btn-danger" id="aviso_borrar_btn" data-toggle="modal" data-target="#modal_confirm_borrar_descansos" ><i class="far fa-trash-alt"></i> Borrar Seleccionados</button>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="text-center" id="mensaje_descansos"></h4>
        <div class="table-responsive">
            <table class="table table-bordered table-hover" id="mostrar_descansos">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col" class="no_ordenable">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellidos</th>
                        <th scope="col">DNI / Pasaporte</th>
                        <th scope="col">Fecha de Inicio</th>
                        <th scope="col">Fecha de Fin</th>
                        <th scope="col">Tipo</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <!-- MODAL DE AÑADIR DESCANSO -->
        <div class="modal fade" id="modal_anyadir_descanso" tabindex="-1" role="dialog" aria-labelledby="modal_anyadir_descanso" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Añadir descanso</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped table-bordered" id="add_descanso">
                            <tbody>
                                <tr>
                                    <td>
                                        <label for="franja">Manipulador: </label>
                                    </td>
                                    <td>
                                        <!-- "AJAX LIVE SEARCH" ES UN FORMULARIO DE BUSQUEDA PHP QUE MUESTRA EL RESULTADO
                                        A MEDIDA QUE SE ESCRIBE SIMILAR A LA FUNCION DE AUTOCOMPLETAR DE GOOGLE
                                        https://github.com/iranianpep/ajax-live-search -->
                                        <label for="busqueda_manipulador">Búsqueda por <strong>Documento Identificativo</strong>, por <strong>Nombre</strong> o por <strong>Apellidos</strong>: </label>
                                        <input type="text" class="form-control" id="busqueda_manipulador" placeholder="Escribe para buscar..." />
                                        <input type="text" class="form-control" name="idmanipulador" id="idmanipulador" readonly />
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="fecha_inicio">Fecha de Inicio: </label>
                                    </td>
                                    <td>
                                        <!-- ELEMENTOS DEL INPUT "FECHA DE INICIO" PARA TEMPUS DOMINUS
                                             https://tempusdominus.github.io/bootstrap-4/Usage/#date-only -->
                                        <div class="input-group date" id="fecha_inicio" data-target-input="nearest">
                                            <input type="text" class="form-control datetimepicker-input" data-target="#fecha_inicio" />
                                            <div class="input-group-append" data-target="#fecha_inicio" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                                            </div>
                                        </div>
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="fecha_fin">Fecha de Fin: </label>
                                    </td>
                                    <td>
                                        <!-- ELEMENTOS DEL INPUT "FECHA DE FIN" PARA TEMPUS DOMINUS
                                             https://tempusdominus.github.io/bootstrap-4/Usage/#date-only -->
                                        <div class="input-group date" id="fecha_fin" data-target-input="nearest">
                                            <input type="text" class="form-control datetimepicker-input" data-target="#fecha_fin" />
                                            <div class="input-group-append" data-target="#fecha_fin" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                                            </div>
                                        </div>
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="tipo">Tipo de descanso: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="tipo_descanso" id="tipo_descanso" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="text-center" id="mensaje_anyadir_descanso"></h4>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="guardar_nuevo_descanso_btn" disabled>Guardar</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL DE CONFIRMACION DE BORRADO -->
        <div class="modal fade" id="modal_confirm_borrar_descansos" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_borrar_descansos" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmación</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <p id="mensaje_confirm_borrar_descansos"></p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  <button type="button" class="btn btn-danger" id="borrar_descansos_btn">Confirmar Borrado</button>
                </div>
              </div>
            </div>
        </div>
    </div>

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
                    var selectedOne = $(data.selected).find('td').eq('0').text();

                    // COMPROBAR QUE EL VALOR DEL INPUT NO ES EL DEL MENSAJE QUE APARECE CUANDO NO HAY RESULTADOS
                    var expreg = new RegExp("^There ");

                    /* ESTABLECER EL VALOR DEL INPUT Y DISPARADO MANUAL DEL EVENTO "CHANGE"
                       (SE USA SU CAPTURA PARA UN EVENTO DE COMPROBACION QUE ESTA EN EL ARCHIVO "descansos_script.js" ) */
                    if(!expreg.test(selectedOne)){
                        $('#idmanipulador').val(selectedOne).trigger("change");
                    }

                    // OCULTAR LA TABLA DE RESULTADOS
                    $("#busqueda_manipulador").trigger('ajaxlivesearch:hide_result');
                },
                onResultEnter: function(e, data) {
                    // OBTENER EL VALOR DE LA PRIMERA COLUMNA (INDICE 0)
                    var selectedOne = $(data.selected).find('td').eq('0').text();

                    // COMPROBAR QUE EL VALOR DEL INPUT NO ES EL DEL MENSAJE QUE APARECE CUANDO NO HAY RESULTADOS
                    var expreg = new RegExp("^There ");

                    /* ESTABLECER EL VALOR DEL INPUT Y DISPARADO MANUAL DEL EVENTO "CHANGE"
                       (SE USA SU CAPTURA PARA UN EVENTO DE COMPROBACION QUE ESTA EN EL ARCHIVO "descansos_script.js" ) */
                    if(!expreg.test(selectedOne)){
                        $('#idmanipulador').val(selectedOne).trigger("change");
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