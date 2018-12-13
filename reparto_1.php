<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/reparto_1.js"></script>
    <title>Preferencias de Lineas</title>
</head>
<body>
    <?php 
        include("html/menu.php");
    ?>
            <div class="row align-items-end" id="cabecera">
                <div class="col-3">
                    <button type="button" id="repartir" class="btn btn-primary"><i class="fas fa-users"></i> Hacer Reparto</button>
                    <button type="button" id="confirmarReparto" class="btn btn-primary" style="display:none"><i class="fas fa-users"></i> Confirmar Reparto</button>
                    <button type='button' class='btn btn-danger borrarRepartoDia' style="display:none" data-toggle="modal" data-target="#modal_confirm_borrar"><i class='far fa-trash-alt'></i> Borrar Planificacion</button>

                </div>
                <div class="col-6">
                    <h3 class="msg text-center">Configuración Reparto</h3>
                </div>
                <div class="col-3">
                </div>
            </div>
        </div>
        <h4 class="text-center" id="mensaje_opciones_lineas"></h4>
        <div class="table-responsive" style="display:none">
            <table class="table table-bordered table-hover" id="mostrar_opciones_lineas" >
                <thead class="thead-dark">
                    <th scope="col">Editar</th>
                    <th scope="col">Nave</th>
                    <th scope="col">Nombre de la Línea</th>
                    <th scope="col">Tipo de Linea</th>
                    <th scope="col">Puestos a cubrir</th>
                    <th scope="col">Preferencias para la línea</th>
                    <th scope="col">Orden dentro de la línea</th>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
    <div class="mensaje" style="display:none"></div>

    
    <div class="modal fade" id="modalPlanificacion" tabindex="-1" role="dialog" aria-labelledby="modalPlanificacionLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="modalPlanificacionLabel">Planificacion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
    
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="window.location.href='./registro_manipuladores.php'">Aceptar</button>
            <button type='button' class='btn btn-danger borrarRepartoDia' data-toggle="modal" data-target="#modal_confirm_borrar"><i class='far fa-trash-alt'></i> Borrar planificacion</button>
        </div>
        </div>
    </div>
    </div>

    <div class="modal fade" id="modal_confirm_borrar" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_borrar" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Confirmación</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <p id="mensaje_confirm_borrar">
                    ¿Esta seguro de que desea borrar todos los registros del dia actual?
                </p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-danger" id="borrar_Reparto_Dia">Borrar</button>
            </div>
        </div>
        </div>
    </div>
</body>
</html>