<?php
    include("mysqlConexion.php");

    if (isset($_POST['accion']) && !empty($_POST['accion'])){
        $accion = $_POST['accion'];
        switch ($accion) {
            case 'exist_datos_lineas':
                comprobarLineas();
                break;
            case 'cargarLineas':
                cargarLineas();
                break;
            case 'cargarManipuladores':
                cargarManipuladores();
                break;
            case '':
                //nuevoTurno();
                break;
            case '':
                //actualizarTurnos();
                break;
            case '':
                //borrarTurnos();
                break;
        }
    }

    function comprobarLineas(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT EXISTS (SELECT 1 FROM lineas) AS respuesta");
        if (!$resultado) {
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = $conexion->error;
        } else {
            $temp = $resultado->fetch_assoc();
            $respuesta['error'] = 0;
            $respuesta['respuesta'] = $temp['respuesta'];
        }
        $conexion->close();
        echo json_encode($respuesta);
    }

    function cargarLineas(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT designacion, idlinea, l.nombre AS nombre_de_linea, tl.nombre AS nombre_de_tipolinea, puestos_maximos, fiabilidad, velocidad, disponibilidad 
                                       FROM lineas l 
                                       JOIN naves n ON n.idnave=l.idnave 
                                       JOIN tipo_linea tl ON l.idtipolinea=tl.idtipolinea 
                                       WHERE estadisponible=1");
        if (!$resultado) {
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = "Error en la consulta de cargar Lineas: ".$conexion->error;
        } else {
            $respuesta['error'] = 0;
            $respuesta['datos'] = array();
            while ($row = $resultado->fetch_assoc()) {
                $fila = array(
                    "designacion" => $row['designacion'],
                    "idlinea" => $row['idlinea'],
                    "nombre_de_linea" => $row['nombre_de_linea'],
                    "nombre_de_tipolinea" => $row['nombre_de_tipolinea'],
                    "puestos_maximos" => $row['puestos_maximos'],
                    "fiabilidad" => $row['fiabilidad'],
                    "velocidad" => $row['velocidad'],
                    "disponibilidad" => $row['disponibilidad']
                );
                array_push($respuesta['datos'], $fila);
            }
        }
        echo json_encode($respuesta);
    }
    function cargarManipuladores(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $sql = "SELECT idmanipulador,nombre,fiabilidad,velocidad,disponibilidad FROM manipuladores";
        $resultado = $conexion->query($sql);
    }
?>