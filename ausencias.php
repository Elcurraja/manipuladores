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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ausencias</title>
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/tempusdominus-bootstrap-4.min.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" type="text/css" href="css/lib/datatables.min.css" />
    <link rel="stylesheet" href="css/lib/fontello.css" />
    <link rel="stylesheet" href="css/lib/animation.css" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">

    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
  
    
</head>
<body>
    <?php
        include("html/menu.php");
        include("php/ausencias_f.php");
    ?>

    <div class="row align-items-end" id="cabecera">
        <div class="col-5">
            <div class="input-group date" id="busqueda_fecha" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#busqueda_fecha" >
                <div class="input-group-append" data-target="#busqueda_fecha" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                </div>
                <button type="button" class="btn btn-primary" onclick ="showAusencias();"><i class="fa fa-search"></i></button>
            </div>
            <button type="button" id="mostrarTodos" class="btn boton btn-primary float-left">Mostrar Todos</button>
            <button type="button" class="btn boton btn-primary " data-toggle="modal" data-target="#modalAddAusencia" style="margin-right:10px;"><i class="far fa-plus-square"></i> Añadir Nueva</button>
            
        </div>
        <div class="col-3">
            <h3 class="msg text-center">Ausencias</h3>
        </div>
        <div class="col-4">
            <div class="btn-group" role="group" id="opciones" >
                <button type="button" class="btn boton btn-primary" id="guardar_cambios_btn" onclick ="updateAusencias();">Guardar <i class="far fa-save"></i></button>
                <button type="button" class="btn boton btn-danger" id="aviso_borrar_btn" data-toggle="modal" data-target="#modal_confirm_borrar">Borrar <i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    </div>   
</div>
   
    <div class="table-responsive">
        <table class="table table-striped table-bordered" id="tabla_ausencia"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">fecha</th>
                    <th scope="col">Dia Completo</th>
                    <th scope="col">Hora Inicio</th>
                    <th scope="col">Hora Fin</th>
                    <th scope="col">Observaciones</th>
                </tr>
            </thead>
            <tbody id="tabla_datos">

            </tbody>
        </table>
    </div>
</div>
    
    

<!-- Modal -->
<div class="modal fade" id="modalAddAusencia" tabindex="-1" role="dialog" aria-labelledby="modalAddAusenciaLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAddAusenciaLabel">Añadir Ausencia</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <table class="table table-striped table-bordered" id="addAusencia">
            <tbody>
                <tr>
                    <td>
                        <label for="idManipulador">ID Manipulador: </label>
                    </td>
                    <td>
                        <label for="busqueda_manipulador">Búsqueda por <strong>Documento Identificativo</strong> o por <strong>Apellidos</strong>: </label>
                        <input type="text" class="form-control" id="busqueda_manipulador" placeholder="Escribe para buscar..." />
                        <input type="text" class="form-control" name="nombre" id="nombre" readonly style="width:550px"/>
                        <input type="hidden" class="form-control" name="manipulador" id="manipulador"/>
                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="fecha">Fecha: </label>
                    </td>
                    <td>
                        <div class="input-group date" id="fecha" data-target-input="nearest">
                            <input type="text" class="form-control datetimepicker-input" data-target="#fecha"/>
                            <div class="input-group-append" data-target="#fecha" data-toggle="datetimepicker">
                                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="esdiacompleto">Dia completo: </label>
                    </td>
                    <td>
                    <select id="esdiacompleto" class="form-control">
                        <option value="1" selected>Si</option>
                        <option value="0" >No</option>
                    </select>
                    </td>
                </tr>
                <tr class="hora">
                    <td>
                        <label for="hora_Inicio">Hora Inicio: </label>
                    </td>
                    <td>
                        <div class="input-group date" id="hora_inicio" data-target-input="nearest">
                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_inicio" />
                            <div class="input-group-append" data-target="#hora_inicio" data-toggle="datetimepicker">
                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="hora">
                    <td>
                        <label for="hora_Fin">Hora Fin: </label>
                    </td>
                    <td>
                        <div class="input-group date" id="hora_fin" data-target-input="nearest">
                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_fin" />
                            <div class="input-group-append" data-target="#hora_fin" data-toggle="datetimepicker">
                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr id="obs">
                    <td>
                        <label for="observaciones">Observaciones: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="observaciones" id="observaciones" />
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick ="addAusencia();">Añadir Ausencia</button>
      </div>
    </div>
  </div>
</div>

<?php 
    include("html/confirBorrar.html");
?>

    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/lib/moment.min.js"></script>
    <script type="text/javascript" src="js/lib/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/lib/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables.min.js"></script>    
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>
    <script type="text/javascript" src="js/ausencias.js"></script>
    <script>
        $(function(){

        $("#busqueda_manipulador").ajaxlivesearch({
        loaded_at: <?php echo time(); ?>,
        token: <?php echo "'" . $handler->getToken() . "'"; ?>,
        max_input: <?php echo Config::getConfig('maxInputLength'); ?>,
        onResultClick: function(e, data) {
            // get the index 0 (first column) value
            var id = $(data.selected).find('td').eq('0').text();
            var nombre = $(data.selected).find('td').eq('1').text();
            var apellidos = $(data.selected).find('td').eq('2').text();
            console.log(id)
            // set the input value
            $('#nombre').val(nombre + " " + apellidos);
            $('#manipulador').val(id);

            // hide the result
            $("#busqueda_manipulador").trigger('ajaxlivesearch:hide_result');
        },
        onResultEnter: function(e, data) {
            // do whatever you want
            // jQuery("#ls_query").trigger('ajaxlivesearch:search', {query: 'test'});
        },
        onAjaxComplete: function(e, data) {

        }
    });
});

    </script>
    
</body>
</html>