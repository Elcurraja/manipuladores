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
    <script type="text/javascript" src="js/lib/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="js/reparto_1.js"></script>
    <title>Reparto</title>
</head>
<body>
    <?php 
        include("html/menu.php");
    ?>
            <div class="row align-items-end" id="cabecera">
                <div class="col-3">
                    <button type="button" id="repartir" class="btn btn-primary"><i class="fas fa-users"></i> Hacer Reparto</button>
                </div>
                <div class="col-6">
                    <h3 class="msg text-center">Configuración Reparto</h3>
                </div>
                <div class="col-3">
                </div>
            </div>
        </div>
        <h4 class="text-center" id="mensaje_opciones_lineas"></h4>
        <div class="table-responsive">
            <table class="table table-bordered" id="mostrar_opciones_lineas" >
                <thead class="thead-dark">
                    <th scope="col">Editar</th>
                    <th scope="col">Nave</th>
                    <th scope="col">Nombre de la Línea</th>
                    <th scope="col">Tipo de Linea</th>
                    <th scope="col">Puestos a cubrir</th>
                    <th scope="col">Establecer Opciones</th>
                    <th scope="col">Orden</th>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
</body>
</html>