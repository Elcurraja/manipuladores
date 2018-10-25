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

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">    
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/tempusdominus-bootstrap-4.min.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" href="css/lib/fontello.css" />
    <link rel="stylesheet" href="css/lib/animation.css" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">

    <script src="js/lib/jquery-3.3.1.min.js"></script>

    <title>Reasignar Linea</title>
</head>
<body>
    <?php
        include("html/menu.php");
    ?>
     <h3 class="msg text-center">Reasignar Linea Manipulador</h3>
    </div>
    <button type="button" id="botonVolver" class="btn btn-primary" onclick ="window.location.href='./registro_manipuladores.php'">Volver a registro</button>
    <div class="clear"></div>
    

    <div id="nombreB">
        <label for="busqueda_manipulador">Búsqueda por: <strong>Documento Identificativo</strong>,<strong>Nombre</strong> o <strong>Apellidos</strong>: </label>
        <input type="text" class="form-control" id="busqueda_manipulador" placeholder="Escribe para buscar..." />
    </div>
    
    <div class="clear"></div>
<div id="conf">
    <div id="info">
        <input type="hidden" class="form-control" name="manipulador" id="manipulador" readonly />
        <div id="nombreInfo">
        <label for="nombre">Nombre</label> <input type="text" class="form-control" name="nombreInfo" id="nombreInfoInput" readonly />
        </div>
        <div id="fechaInfo">
            <label for="fecha">Fecha: </label>
            <div class="input-group date" id="fechaB" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#fechaB"/>
                <div class="input-group-append" data-target="#fechaB" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                </div>
                <button type="button" id="buscarReg" class="btn btn-primary" onclick ="buscarReg();"><i class="fa fa-search"></i> Buscar </button>
            </div>
        </div>
        
    </div>
    <div class="clear"></div>
</div>


<div id="table-responsive">
    <table class="table table-striped table-bordered" id="tabla_registro"> 
        <thead class="thead-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">IDRegistro</th>
                <th scope="col">IDTurno</th>
                <th scope="col">Hora inicio</th>
                <th scope="col">Hora Fin</th>
                <th scope="col">IDLinea</th>
                <th scope="col">#</th>
            </tr>
        </thead>
        <tbody id="tablalineas">
              
        </tbody>
    </table>
</div>

<!-- Modal -->
<div class="modal fade" id="modalReasignarLinea" tabindex="-1" role="dialog" aria-labelledby="modalReasignarLineaLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalReasignarLineaLabel">Reasignar Linea </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <table class="table table-bordered" id="add_manip">
            <tbody id="modalReasignarLinea">
                <tr>
                    <td>
                        <label for="idregistro">ID Registro: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="idregistro" id="idregistro" disabled="disable" />                    
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="idturno">ID Turno: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="idturno" id="idturno" disabled="disable"/>
                    </td>
                </tr>
   
                <tr class="hora">
                    <td>
                        <label for="hora_inicio_rl">Hora Inicio: </label>
                    </td>
                    <td>
                        <div class="input-group date" id="hora_inicio_rl" data-target-input="nearest">
                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_inicio_rl"/>
                            <div class="input-group-append" data-target="#hora_inicio_rl" data-toggle="datetimepicker">
                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="hora">
                    <td>
                        <label for="hora_fin_rl">Hora Fin: </label>
                    </td>
                    <td>
                        <div class="input-group date" id="hora_fin_rl" data-target-input="nearest">
                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_fin_rl" />
                            <div class="input-group-append" data-target="#hora_fin_rl" data-toggle="datetimepicker">
                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="idlinea">ID Linea: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="idlinea" id="idlinea"/>
                    </td>
                </tr>
                <input type="hidden" class="form-control" name="idmanipulador" id="idmanipulador"/>
                <input type="hidden" class="form-control" name="fecha" id="fecha"/>
            </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick ="reasignarLinea();">Reasignar</button>
      </div>
    </div>
  </div>
</div>

    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>    
    <script type="text/javascript" src="js/lib/moment.min.js"></script>
    <script type="text/javascript" src="js/lib/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/lib/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>  
    <script type="text/javascript" src="js/reasignar_linea.js"></script>  
<script>
$(function(){
    $("#busqueda_manipulador").ajaxlivesearch({
        loaded_at: <?php echo time(); ?>,
        token: <?php echo "'" . $handler->getToken() . "'"; ?>,
        max_input: <?php echo Config::getConfig('maxInputLength'); ?>,
        onResultClick: function(e, data) {
            // get the index 0 (first column) value
            var selectedOne = $(data.selected).find('td').eq('0').text();
            var selectedName = $(data.selected).find('td').eq('1').text();
            var selectedApe = $(data.selected).find('td').eq('2').text();

            // set the input value
            $('#manipulador').val(selectedOne);
            $('#nombreInfoInput').val(selectedName + " " +selectedApe);

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