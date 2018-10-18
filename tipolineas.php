<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manipuladores</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
</head>
<body>
<?php
    
    require("php/mysqlConexion.php");
    include("html/menu.php");

    if(isset($_POST['op'])){
        switch($_POST['op']){
            case 'add':
                require("php/tipo_lineas_f.php");
                addTipoLinea();
                break;
            case 'update': 
                require("php/tipo_lineas_f.php");
                editarTipoLineas();

                break;
            case 'delete':
                require("php/tipo_lineas_f.php");
                borrarTipoLineas();
                break;
        }
    }
?>
    
    <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#exampleModal">Añadir Nuevo</button>
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="guardarCampos();" disabled="disabled">Guardar</button>
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar</button>
    </div>
    <div id="tabla">
        <table class="table table-striped table-bordered"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">IDTipoLinea</th>
                    <th scope="col">Nombre</th>
                </tr>
            </thead>
                <tbody>
                <?php 
                if(!$_POST){
                    include("php/tipo_lineas_f.php");
                    mostrarTipoLineas();
                }
                ?>
            
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
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>    
    <script src="js/tipolinea.js"></script>
</body>
</html>