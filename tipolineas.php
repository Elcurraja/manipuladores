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
    include("php/tipo_lineas_f.php");
?>
    <div class="row align-items-end" id="test">
        <div class="col-3" id="opciones-l">
            <button type="button" class="btn boton btn-primary" data-toggle="modal" data-target="#modalTipoLinea"><i class="far fa-plus-square"></i> Añadir Nuevo</button>
        </div>
        <div class="col-6">
            <h3 class="msg text-center">Tipo Lineas</h3>
        </div>
        <div class="col-3" id="opciones-r">
            <div class="btn-group" role="group" id="opciones" >
            <button type="button" class="btn boton btn-primary" id="guardar_cambios_btn" onclick ="guardarCampos();">Guardar <i class="far fa-save"></i></button>
        <button type="button" class="btn boton btn-danger" id="aviso_borrar_btn" data-toggle="modal" data-target="#modal_confirm_borrar">Borrar <i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    </div>   
</div>
    <div id="tabla">
        <table class="table table-striped table-bordered" id="tabla_tipo_lineas"> 
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">IDTipoLinea</th>
                    <th scope="col">Nombre</th>
                </tr>
            </thead>
                <tbody>
           
            </tbody>
        </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalTipoLinea" tabindex="-1" role="dialog" aria-labelledby="modalTipoLineaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="modalTipoLineaLabel">Añadir Linea</h5>
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
    
    <script src="js/lib/bootstrap.min.js"></script>    
    <script src="js/tipolinea.js"></script>
</body>
</html>