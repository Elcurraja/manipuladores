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
    <title>Manipuladores</title>
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/tempusdominus-bootstrap-4.min.css"/>
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/lib/fontello.css" />
    <link rel="stylesheet" href="css/lib/animation.css" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">

    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>    
    <script type="text/javascript" src="js/lib/moment.min.js"></script>
    <script type="text/javascript" src="js/lib/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/lib/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>
    <script type="text/javascript" src="js/ausencias.js"></script>
    
</head>
<body>
    <?php
    
        require("php/mysqlConexion.php");
        include("html/menu.php");
        include("php/ausencias_f.php");
        if(isset($_POST['op'])){
            switch($_POST['op']){
                case 'add':
                    addAusencia();
                    break;
                case 'update': 
                    editarAusencias();
                    break;
                case 'delete':
                    borrarAusencias();
                    break;
            }
        }
    ?>
    
    <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#exampleModal">Añadir Nueva</button>
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="updateAusencias();" disabled="disabled">Guardar</button>
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar</button>
    </div>
    <div id="tabla">
        <table class="table table-striped table-bordered"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID ausencia</th>
                    <th scope="col">ID manipulador</th>
                    <th scope="col">fecha</th>
                    <th scope="col">Dia Completo</th>
                    <th scope="col">Hora Inicio</th>
                    <th scope="col">Hora Fin</th>
                    <th scope="col">Observaciones</th>
                </tr>
            </thead>
                <tbody>
                <?php 
                if(!$_POST){
                    mostrarAusencias();
                }
                ?>
            
            </tbody>
        </table>
    </div>
    
    

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Añadir Ausencia</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <table class="table table-striped table-bordered" id="add_manip">
            <tbody>
                <tr>
                    <td>
                        <label for="idManipulador">ID Manipulador: </label>
                    </td>
                    <td>
                        <label for="busqueda_manipulador">Búsqueda por <strong>Documento Identificativo</strong> o por <strong>Apellidos</strong>: </label>
                        <input type="text" class="form-control" id="busqueda_manipulador" placeholder="Escribe para buscar..." />
                        <input type="text" class="form-control" name="manipulador" id="manipulador" readonly />
                    
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
                                <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="esdiacompleto">Dia completo: </label>
                    </td>
                    <td>
                    <select id="esdiacompleto">
                        <option value="1" >Si</option>
                        <option value="0" selected>No</option>
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
                                <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
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
                                <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
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

    
    <script>
        $(function(){

            $("#busqueda_manipulador").ajaxlivesearch({
                loaded_at: <?php echo time(); ?>,
                token: <?php echo "'" . $handler->getToken() . "'"; ?>,
                max_input: <?php echo Config::getConfig('maxInputLength'); ?>,
                onResultClick: function(e, data) {
                    // get the index 0 (first column) value
                    var selectedOne = $(data.selected).find('td').eq('0').text();

                    // set the input value
                    $('#manipulador').val(selectedOne);

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

            /* $("input[type=radio][name=opciones_busqueda]").change(function() {
                if (this.value == "por_dni") {
                    console.log("evento por dni");
                }
                else if (this.value == 'por_apellido') {
                    console.log("evento por apellido");
                }
            }); */
        });
    </script>
    
</body>
</html>