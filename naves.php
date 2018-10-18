<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manipuladores</title>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/lib/jquery-3.3.1.min.js"></script>
</head>
<body>
    <?php
        include("php/mysqlConexion.php");
        include("html/menu.php");
        include("php/naves_f.php");
     
        if(isset($_POST['op'])){
            switch($_POST['op']){
                case 'add':
                    addNave();
                    break;
                case 'update': 
                    editarNaves();
                    break;
                case 'delete':
                    borrarNaves();
                    break;
            }
        }
    ?>
    
    <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#exampleModal">Añadir Nueva</button>
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="guardarCampos();" disabled="disabled">Guardar</button>
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar</button>
    </div>
    <div id="tabla">
        <table class="table table-striped table-bordered"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">IDnave</th>
                    <th scope="col">Designacion</th>
                </tr>
            </thead>
                <tbody>
                <?php 
                 mostrarNaves();
                ?>
            
            </tbody>
        </table>
    </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Añadir Nave</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <table class="table table-striped table-bordered" id="add_manip">
            <tbody>
                <tr>
                    <td>
                        <label for="designacion">Designacion: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="designacion" id="designacion" />
                    </td>
                </tr>
                
            </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick ="addNave();">Añadir Nave</button>
      </div>
    </div>
  </div>
</div>

<?php 
    include("html/confirBorrar.html");
?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
    <script src="js/naves.js"></script>
</body>
</html>