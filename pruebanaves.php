<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Naves</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/lib/jquery-3.3.1.min.js"></script>

    <style>
        /* thead th{
            width:100px;
        } */
         #tabla1 input,#tabla2 input,#tabla3 input {
            width:100%;
        }

        .table ul li {
            min-width: 200px;
        }
        .dragging li.ui-state-hover {
            min-width: 240px;
        }
        .dragging .ui-state-hover a {
            color:green !important;
            font-weight: bold;
        }
        .table th,td {
            text-align: center;
        }
        .t_sortable tr, .ui-sortable-helper {
            cursor: move;
        }
        .ui-sortable-helper{
            font-weight: bold;
            background-color:#FFF3DB;
            border:1px solid black;
        }
        .t_sortable tr:first-child {
            cursor: default;
        }
        .ui-sortable-placeholder {
            background: yellow;
        }
    </style>
</head>
<body>
    <?php
        include("html/menu.php");
        include("php/naves_f.php");
    ?>

    <div class="row align-items-end" id="cabecera">
        <div class="col-3">
        <button type="button" class="btn boton btn-primary" id="" onclick ="planificarDia();">Guardar <i class="far fa-save"></i></button>
        </div>
        <div class="col-6">
            <h3 class="msg text-center">Naves</h3>
        </div>
        
    </div>   
</div>

    <div class="table-responsive ">
        <!-- <div class="col-3 float-left">
            <h3>Linea 1</h3>
            <table class="table table-striped table-bordered"  id="tabla1"> 
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Manipulador</th>
                    </tr>
                </thead>
                <tbody class="tabla_datos t_sortable">            
                </tbody>
            </table>
        </div>
        <div class="col-3 float-left">
            <h3>Linea 2</h3>
            <table class="table table-striped table-bordered"  id="tabla2"> 
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Manipulador</th>
                    </tr>
                </thead>
                <tbody class="tabla_datos t_sortable">            
                </tbody>
            </table>
        </div>
        <div class="col-3 float-left">
            <h3>Linea 3</h3>
            <table class="table table-striped table-bordered"  id="tabla3"> 
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Manipulador</th>
                    </tr>
                </thead>
                <tbody class="tabla_datos t_sortable">            
                </tbody>
            </table>
        </div> -->
    </div>

<?php 
    include("html/confirBorrar.html");
?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables.min.js"></script>
    <script type="text/javascript" src="js/pruebanaves.js"></script>
</body>
</html>