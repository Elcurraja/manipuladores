<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manipuladores</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/lib/jquery-3.3.1.min.js"></script>
</head>
<body>
    <?php
        include("html/menu.php");
    ?>
        <h3 class="msg text-center">Lineas</h3>
    </div>
    <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#exampleModal" data-focus="true"><i class="far fa-plus-square"></i> Añadir Nueva</button>
    <div class="btn-group" id="opciones">
        <button type="button" class="btn boton btn-primary" onclick ="guardarCampos();" disabled="disabled">Guardar <i class="far fa-save"></i></button>
     
        <button type="button" class="btn boton btn-warning" data-toggle="modal" data-target="#modal_confirm_borrar" disabled="disabled">Borrar <i class="far fa-trash-alt"></i></button>
    </div>
    <div id="table-responsive">
        <table class="table table-striped table-bordered" id="tabla_datos"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Nave</th>
                    <th scope="col">Tipo linea</th>
                    <th scope="col">Disponible</th>
                    <th scope="col">Puestos Maximos</th>
                    <th scope="col">Fiabilidad</th>
                    <th scope="col">Velocidad</th>
                    <th scope="col">Disponibilidad</th>
                </tr>
            </thead>
                <tbody id="tabla_datos">
                <?php
                     include("php/lineas_f.php");
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
                        <select id="idnave" class="form-control">
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
                        <select id="idtipolinea" class="form-control">
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
                        <select id="disponible" class="form-control">
                            <option value="0">No</option>
                            <option value="1">Si</option>
                        </select>
                    </td>
                    <tr>
                    <td>
                        <label for="nombre">Puestos Maximos: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="puestosmax" id="puestosmax" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="nombre">Fiabilidad: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="fiabilidad" id="fiabilidad" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="nombre">Velocidad: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="velocidad" id="velocidad" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="nombre">Disponibilidad: </label>
                    </td>
                    <td>
                        <input type="text" class="form-control" name="disponibilidad" id="disponibilidad" />
                    </td>
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
    <script src="js/lib/bootstrap.min.js"></script>    
    <script src="js/lineas.js"></script>
</body>
</html>