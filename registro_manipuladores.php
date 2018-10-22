<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manipuladores</title>
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/tempusdominus-bootstrap-4.min.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" href="css/lib/fontello.css" />
    <link rel="stylesheet" href="css/lib/animation.css" />
    <link rel="stylesheet" href="css/lib/ajaxlivesearch.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/lib/jquery-3.3.1.min.js"></script>
</head>
<body>
<?php
    include("html/menu.php");
?>
        <h3 class="msg text-center">Registro Manipuladores</h3>
    </div>
    
        <div class="input-group date" id="busqueda_fecha" data-target-input="nearest">
            <input type="text" class="form-control datetimepicker-input" data-target="#busqueda_fecha" >
            <div class="input-group-append" data-target="#busqueda_fecha" data-toggle="datetimepicker">
                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
            </div>
            <button type="button" class="btn btn-primary" onclick ="showReg();"><i class="fa fa-search"></i></button>
        </div>

        <button type="button" id="mostrarTodos" class="btn btn-primary">Mostrar Todos</button>
        
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="updateReg();" disabled="disabled"><i class="far fa-save"></i> Guardar </button>
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar <i class="far fa-trash-alt"></i></button>
    </div>
    
        <div id="table-responsive">
            <table class="table table-striped table-bordered" id="tabla_registro"> 
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">IDRegistro</th>
                        <th scope="col">IDManipulador</th>
                        <th scope="col">IDPuesto</th>
                        <th scope="col">IDTurno</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora inicio</th>
                        <th scope="col">Hora Fin</th>
                        <th scope="col">IDLinea</th>
                    </tr>
                </thead>
                <tbody>                
                </tbody>
            </table>
        </div>
    

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Añadir Linea</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <table class="table table-striped table-bordered" id="add_manip">
            <tbody>
                <tr>
                    <td>
                        <label for="nombre">Nombre: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="nombre" id="nombre" />
                    </td>
                </tr>
                
                
            </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick ="addTipoLinea();">Añadir Tipo Linea</button>
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
    <script type="text/javascript" src="js/lib/ajaxlivesearch.min.js"></script>  
    <script src="js/registro_manipuladores.js"></script>
</body>
</html>