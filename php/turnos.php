<?php
    include("mysqlConexion.php");

    if (isset($_POST['accion']) && !empty($_POST['accion'])){
        $accion = $_POST['accion'];
        switch ($accion) {
            case 'exist_datos_turnos':
                comprobarTurnos();
                break;
            case 'cargarTurnos':
                cargarTurnos();
                break;
            case 'anyadirTurno':
                nuevoTurno();
                break;
            case 'editarTurnos':
                actualizarTurnos();
                break;
            case 'borrarTurnos':
                borrarTurnos();
                break;
        }
    }

    function comprobarTurnos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT EXISTS (SELECT 1 FROM turnos) AS respuesta");
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

    function cargarTurnos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT * FROM turnos");
        if (!$resultado) {
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = "Error en la consulta de cargar Turnos: ".$conexion->error;
        } else {
            $respuesta['error'] = 0;
            $respuesta['datos'] = array();
            while ($row = $resultado->fetch_assoc()) {
                $fila = array(
                    "idturno" => $row['idturno'],
                    "franja" => $row['franja'],
                    "hora_inicio" => $row['hora_inicio'],
                    "hora_fin" => $row['hora_fin']
                );
                array_push($respuesta['datos'], $fila);
            }
        }
        echo json_encode($respuesta);
    }

    function nuevoTurno(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        try {
            $datos = json_decode($_POST['datos']);
            $resultado = $conexion->query("INSERT INTO turnos (franja, hora_inicio, hora_fin) 
                                           VALUES ('".$datos->{'franja'}."', '".$datos->{'hora_inicio'}."', '".$datos->{'hora_fin'}."')");
            if (!$resultado) {
                throw new Exception($conexion->error);
            } else {
                $respuesta['error'] = 0;
            }
            $conexion->commit();
        } catch(Exception $e){
            $conexion->rollback();
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        $conexion->close();
        echo json_encode($respuesta);
    }

    function actualizarTurnos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("UPDATE turnos 
                                               SET franja='".$datos[$i]->{'franja'}."', hora_inicio='".$datos[$i]->{'hora_inicio'}."', hora_fin='".$datos[$i]->{'hora_fin'}."' 
                                               WHERE idturno='".$datos[$i]->{'idturno'}."'");
                if (!$resultado) {
                    throw new Exception($conexion->error);
                }
            }
            $respuesta['error'] = 0;
            $conexion->commit();
        } catch (Exception $e) {
            $conexion->rollback();
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        $conexion->close();
        echo json_encode($respuesta);
    }

    function borrarTurnos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("DELETE FROM turnos WHERE idturno='".$datos[$i]->{'idturno'}."'");
                if (!$resultado) {
                    throw new Exception($conexion->error);
                }
            }
            $respuesta['error'] = 0;
            $conexion->commit();
        } catch(Exception $e) {
            $conexion->rollback();
            $respuesta['error'] = 1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        $conexion->close();
        echo json_encode($respuesta);
    }
?>