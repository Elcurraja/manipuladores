<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reparto Lineas</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/lib/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/lib/jquery-3.3.1.min.js"></script>

    <style>
        .reparto_lineas .col-3{
            padding:0px;
            margin-left:0.3%;
            max-width: 24.5%;
        }
        div.col-3 h3 {
            text-align:center;
        }
        div tbody.datos_reparto_lineas span{
            /* font-size:.9em; */
        }
       
        .table th,td {
            text-align: center;
        }
        .t_sortable tr, .ui-sortable-helper {
            cursor: move;
        }
        .ui-sortable-helper{
            font-weight: bold;
            /* font-size:.9em; */
            background-color:#FFD33C;
            color:black;
            border:1px solid black;
            width:90px;
        }
        .t_sortable tr:first-child {
            cursor: default;
        }
      
    </style>
</head>
<body>
    <?php
        include("html/menu.php");
    ?>

    <div class="row align-items-end" id="cabecera">
        <div class="col-3">
            <button type="button" class="btn boton btn-primary m-1" id="" onclick ="planificarDia();">Guardar <i class="far fa-save"></i></button>
        </div>
        <div class="col-6">
            <h3 class="msg text-center">Reparto Lineas</h3>
        </div>
        
    </div>   
</div>

    <div class="table-responsive reparto_lineas">
        
    </div>
    <div id="mensaje"></div>

<?php 
    include("html/confirBorrar.html");
?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables.min.js"></script>
    <script type="text/javascript" src="js/repartoLineas.js"></script>
</body>
</html>