<?php
    include("mysqlConexion.php");
    if (isset($_POST['accion']) && !empty($_POST['accion'])) {
        $accion = $_POST['accion'];
        switch ($accion) {
            case 'exist_datos_descansos':
                comprobarDescansos();
                break;
            case 'mostrarDescansos':
                cargarDescansos();
                break;
            case 'anyadirDescanso':
                nuevoDescanso();
                break;
            case 'editarDescansos':
                actualizarDescansos();
                break;
            case 'borrarDescansos':
                borrarDescansos();
                break;
        }
    }

    function comprobarDescansos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT EXISTS (SELECT 1 FROM descansos) AS respuesta");
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

    function cargarDescansos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT iddescanso, d.idmanipulador AS idmanipulador, nombre, apellidos, dni, fecha_inicio, fecha_fin, tipo 
                                       FROM descansos d JOIN manipuladores m 
                                       ON d.idmanipulador=m.idmanipulador
                                       ORDER BY iddescanso");
            if (!$resultado) {
                $respuesta['error'] = 1;
                $respuesta['mensaje'] = "Error en la consulta de cargar descansos: " + $conexion->error;
            } else {
                $respuesta['error'] = 0;
                $respuesta['datos'] = array();
                while ($row = $resultado->fetch_assoc()) {
                    $fila = array(
                        'iddescanso' => $row['iddescanso'],
                        'idmanipulador' => $row['idmanipulador'],
                        'nombre' => $row['nombre'],
                        'apellidos' => $row['apellidos'],
                        'dni' => $row['dni'],
                        'fecha_inicio' => $row['fecha_inicio'],
                        'fecha_fin' => $row['fecha_fin'],
                        'tipo' => $row['tipo']
                    );
                    array_push($respuesta['datos'], $fila);
                }
            }
        $conexion->close();
        echo json_encode($respuesta);
    }

    function nuevoDescanso(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        try {
            $datos = json_decode($_POST['datos']);
            $resultado = $conexion->query("INSERT INTO descansos (idmanipulador, fecha_inicio, fecha_fin, tipo) 
                                           VALUES ('".$datos->{'idmanipulador'}."', '".$datos->{'fecha_inicio'}."', '".$datos->{'fecha_fin'}."', '".$datos->{'tipo'}."')");
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

    function actualizarDescansos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("UPDATE descansos 
                                               SET fecha_inicio='".$datos[$i]->{'fecha_inicio'}."', fecha_fin='".$datos[$i]->{'fecha_fin'}."', tipo='".$datos[$i]->{'tipo'}."' 
                                               WHERE iddescanso='".$datos[$i]->{'iddescanso'}."'");
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

    function borrarDescansos(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("DELETE FROM descansos WHERE iddescanso='".$datos[$i]->{'iddescanso'}."'");
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