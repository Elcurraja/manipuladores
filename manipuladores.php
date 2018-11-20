<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" type="text/css" href="css/lib/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous" />
    <link rel="stylesheet" type="text/css" href="css/lib/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script type="text/javascript" src="js/lib/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/lib/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/lib/datatables.min.js"></script>
    <script type="text/javascript" src="js/manip_script.js"></script>
    <title>Acciones sobre Manipuladores</title>
</head>
<body>
    <?php 
        include("html/menu.php");
    ?>
            
            <div class="row align-items-end" id="cabecera">
                <div class="col-3">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal_anyadir_manip" ><i class="far fa-address-card"></i> Añadir nuevo</button>
                </div>
                <div class="col-6">
                    <h3 class="msg text-center">Manipuladores</h3>
                </div>
                <div class="col-3">
                    <div class="btn-group" role="group" id="grupo_actualizar_borrar_btns">
                        <button type="button" class="btn btn-warning" id="guardar_cambios_btn" ><i class="far fa-save"></i> Guardar cambios</button>
                        <button type="button" class="btn btn-danger" id="aviso_borrar_btn" data-toggle="modal" data-target="#modal_confirm_borrar_manip" ><i class="far fa-trash-alt"></i> Borrar Seleccionado</button>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="text-center" id="mensaje_manip"></h4>
        <div class="table-responsive">
            <table class="table table-bordered table-hover" id="mostrar_manip">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col" class="no_ordenable">Selecciona</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellidos</th>
                        <th scope="col">DNI / Pasaporte</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Dias Seguidos Trabajados</th>
                        <th scope="col">Email</th>
                        <th scope="col">Teléfono Familiar</th>
                        <th scope="col">Fiabilidad</th>
                        <th scope="col">Velocidad</th>
                        <th scope="col">Disponibilidad</th>
                        <th scope="col">Observaciones</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <table id="dt">
        </table>
        <!-- MODAL DE AÑADIR NUEVO MANIPULADOR 
             https://getbootstrap.com/docs/4.1/components/modal/ -->
        <div class="modal fade" id="modal_anyadir_manip" tabindex="-1" role="dialog" aria-labelledby="modal_anyadir_manip" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Añadir nuevo trabajador</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
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
                                        <small class="form-text text-muted">Campo obligatorio</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="apellidos">Apellidos: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="apellidos" id="apellidos" />
                                        <small class="form-text text-muted">Campo obligatorio</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="dni">DNI: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="dni" id="dni" />
                                        <small class="form-text text-muted">Campo obligatorio</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="telefono">Teléfono: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="telefono" id="telefono" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="direccion">Dirección: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="direccion" id="direccion" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="email">Email: </label>
                                    </td>
                                    <td>
                                        <input type="email" class="form-control" name="email" id="email" />   
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="tlf_fami" title="Teléfono de contacto de algún familiar">Teléfono Familiar: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="tlf_fami" id="tlf_familiar" title="Teléfono de contacto de algún familiar" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="fiabilidad">Fiabilidad: </label>
                                    </td>
                                    <td>
                                        <select name="fiabilidad" class="form-control" id="fiabilidad">
                                            <option value="0" selected>0</option>
                                            <option value="1">1</option>
                                            <option value="0">2</option>
                                            <option value="0">3</option>
                                            <option value="0">4</option>
                                            <option value="0">5</option>
                                            <option value="0">6</option>
                                            <option value="0">7</option>
                                            <option value="0">8</option>
                                            <option value="0">9</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="velocidad">Velocidad: </label>
                                    </td>
                                    <td>
                                        <select name="velocidad" class="form-control" id="velocidad">
                                            <option value="0" selected>0</option>
                                            <option value="1">1</option>
                                            <option value="0">2</option>
                                            <option value="0">3</option>
                                            <option value="0">4</option>
                                            <option value="0">5</option>
                                            <option value="0">6</option>
                                            <option value="0">7</option>
                                            <option value="0">8</option>
                                            <option value="0">9</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="disponibilidad">Disponibilidad: </label>
                                    </td>
                                    <td>
                                        <select name="disponibilidad" class="form-control" id="disponibilidad">
                                            <option value="0" selected>0</option>
                                            <option value="1">1</option>
                                            <option value="0">2</option>
                                            <option value="0">3</option>
                                            <option value="0">4</option>
                                            <option value="0">5</option>
                                            <option value="0">6</option>
                                            <option value="0">7</option>
                                            <option value="0">8</option>
                                            <option value="0">9</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="observaciones">Observaciones: </label>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="observaciones" id="observaciones" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="guardar_nuevo_manip_btn">Guardar</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL DE CONFIRMACION DE BORRADO
             https://getbootstrap.com/docs/4.1/components/modal/ -->
        <div class="modal fade" id="modal_confirm_borrar_manip" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_borrar_manip" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmación</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <p id="mensaje_confirm_borrar_manip"></p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  <button type="button" class="btn btn-danger" id="borrar_manip_btn">Confirmar Borrado</button>
                </div>
              </div>
            </div>
        </div>
    </div>
</body>
</html>