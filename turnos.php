<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- ES NECESARIO CARGAR LOS PLUGINS EN ESTE ORDEN, DE LO CONTRARIO PUEDEN NO FUNCIONAR CORRECTAMENTE -->
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/tempusdominus-bootstrap-4.min.css" />
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/moment.min.js"></script>
    <script type="text/javascript" src="js/moment_locale_es.js"></script>
    <script type="text/javascript" src="js/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="js/turnos_script.js"></script>
    <style>
        #mensaje_turnos, #mostrar_turnos {
            display: none;
        }
        #grupo_actualizar_borrar_btns {
            float: right;
        }
        .table-responsive{
            overflow-x: visible;
        }
    </style>
    <title>Acciones sobre Turnos</title>
</head>
<body>
	<?php 
        include("html/menu.php");
    ?>
    <div class="container-fluid">
        <div id="tabla_mostrar_turnos">
            <input type="button" class="btn btn-primary boton" value="Añadir Nuevo" data-toggle="modal" data-target="#modal_anyadir_turno" />
            <div class="btn-group" role="group" id="grupo_actualizar_borrar_btns">
                <input type="button" class="btn btn-primary boton" value="Guardar cambios" id="guardar_cambios_btn" disabled />
                <input type="button" class="btn btn-warning boton" value="Borrar Seleccionados" id="aviso_borrar_btn" data-toggle="modal" data-target="#modal_confirm_borrar_turnos" disabled />
        </div>
        <h4 class="text-center" id="mensaje_turnos"></h4>
        <div class="table-responsive">
            <table class="table table-bordered table-hover" id="mostrar_turnos">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Selecciona</th>
                        <th scope="col">Id</th>
                        <th scope="col">Franja</th>
                        <th scope="col">Hora de Inicio</th>
                        <th scope="col">Hora de Fin</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <!-- MODAL DE AÑADIR TURNO -->
        <div class="modal fade" id="modal_anyadir_turno" tabindex="-1" role="dialog" aria-labelledby="modal_anyadir_turno" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Añadir turno nuevo</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped table-bordered" id="add_turno">
                            <tbody>
                                <tr>
                                    <td>
                                        <label for="franja">Franja: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="franja" id="franja" />
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="hora_inicio">Hora de Inicio: </label>
                                    </td>
                                    <td>
                                        <!-- ELEMENTOS DEL INPUT "HORA INICIO" PARA TEMPUS DOMINUS
                                             https://tempusdominus.github.io/bootstrap-4/Usage/#time-only -->
                                        <div class="input-group date" id="hora_inicio" data-target-input="nearest">
                                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_inicio" />
                                            <div class="input-group-append" data-target="#hora_inicio" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
                                            </div>
                                        </div>
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="hora_fin">Hora de Fin: </label>
                                    </td>
                                    <td>
                                        <!-- ELEMENTOS DEL INPUT "HORA FIN" PARA TEMPUS DOMINUS
                                             https://tempusdominus.github.io/bootstrap-4/Usage/#time-only -->
                                        <div class="input-group date" id="hora_fin" data-target-input="nearest">
                                            <input type="text" class="form-control datetimepicker-input" data-target="#hora_fin" />
                                            <div class="input-group-append" data-target="#hora_fin" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="fa fa-clock-o"></i></div>
                                            </div>
                                        </div>
                                        <!-- <small class="form-text text-muted">Campo obligatorio</small> -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p id="mensaje_anyadir_turno"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="guardar_nuevo_turno_btn" disabled>Guardar</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL DE CONFIRMACION DE BORRADO -->
        <div class="modal fade" id="modal_confirm_borrar_turnos" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_borrar_turnos" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmación</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <p id="mensaje_confirm_borrar_turnos"></p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  <button type="button" class="btn btn-danger" id="borrar_turnos_btn">Confirmar Borrado</button>
                </div>
              </div>
            </div>
        </div>
    </div>
</body>
</html>