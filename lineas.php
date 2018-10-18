<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manipuladores</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/jquery-3.3.1.min.js"></script>
</head>
<body>
    <?php
        include("php/mysqlConexion.php");
        include("html/menu.php");
        include("php/lineas_f.php");
        
        // echo $_SERVER['REQUEST_URI'];

        if(isset($_POST['op'])){
            switch($_POST['op']){
                case 'add':
                    addlinea();
                    break;
                case 'update': 
                    editarLineas();
                    break;
                case 'delete':
                    borrarLineas();
                    break;
            }
        }
    ?>
    
    <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#exampleModal" data-focus="true">Añadir Nueva</button>
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="guardarCampos();" disabled="disabled">Guardar</button>
     
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar</button>
    </div>
    <div id="tabla">
        <table class="table table-striped table-bordered"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">IDlinea</th>
                    <th scope="col">nombre</th>
                    <th scope="col">IDnave</th>
                    <th scope="col">IDtipolinea</th>
                    <th scope="col">Disponible</th>
                    <th scope="col">Puestos_Maximos</th>
                </tr>
            </thead>
                <tbody>
                <?php 
                 mostrarLineas();
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
                <tr>
                    <td>
                        <label for="idnave">IDnave: </label>
                    </td>
                    <td>
                        <select id="idnave">
                        <?php
                            $conn=mysql_manipuladores();
                            $resultQuery =$conn->query("SELECT idnave from naves");
                            while ($fila = $resultQuery->fetch_assoc()) {
                                echo '<option value="'.$fila['idnave'].'">'.$fila['idnave'].'</option>';
                            }
                        ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="idtipolinea">IDtipolinea: </label>
                    </td>
                    <td>
                        <select id="idtipolinea">
                        <?php
                            $conn=mysql_manipuladores();
                            $resultQuery =$conn->query("SELECT idtipolinea from tipo_linea");
                            while ($fila = $resultQuery->fetch_assoc()) {
                                echo '<option value="'.$fila['idtipolinea'].'">'.$fila['idtipolinea'].'</option>';
                            }
                        ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="disponible">Disponible: </label>
                    </td>
                    <td>
                        <select id="disponible">
                            <option value="0">No</option>
                            <option value="1">Si</option>
                        </select>
                    </td>
                    <tr>
                    <td>
                        <label for="nombre">Puestosmax: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="puestosmax" id="puestosmax" />
                    </td>
                </tr>
                </tr>
            </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick ="addlinea();">Añadir Linea</button>
      </div>
    </div>
  </div>
</div>

<?php 
    include("html/confirBorrar.html");
?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>    
    <script src="js/lineas.js"></script>
</body>
</html>