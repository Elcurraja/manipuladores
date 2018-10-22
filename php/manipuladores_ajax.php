<?php
    include("mysqlConexion.php");
    if (isset($_POST['accion']) && !empty($_POST['accion'])) {
        $accion = $_POST['accion'];
        switch ($accion) {
            case 'exist_datos_manip':
                comprobarManipuladores();
                break;
            case 'cargarManip':
                obtenerManipuladores();
                break;
            case 'anyadirManip':
                nuevoManipulador();
                break;
            case 'editarManip':
                actualizarManipuladores();
                break;
            case 'borrarManip':
                borrarManipuladores();
                break;
        }
    }

    function obtenerManipuladores(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT * FROM manipuladores");
            if (!$resultado) {
                $respuesta['error'] = 1;
                $respuesta['mensaje'] = "Error en la consulta de cargar manipuladores: " + $conexion->error;
            } else {
                $respuesta['error'] = 0;
                $respuesta['datos'] = array();
                while ($row = $resultado->fetch_assoc()) {
                    $fila = array(
                        'idmanipulador' => $row['idmanipulador'],
                        'nombre' => $row['nombre'],
                        'apellidos' => $row['apellidos'],
                        'dni' => $row['dni'],
                        'telefono' => $row['telefono'],
                        'direccion' => $row['direccion'],
                        'dias_seguidos_trabajados' => $row['dias_seguidos_trabajados'],
                        'email' => $row['email'],
                        'tlf_familiar' => $row['tlf_familiar'],
                        'fiabilidad' => $row['fiabilidad'],
                        'velocidad' => $row['velocidad'],
                        'disponibilidad' => $row['disponibilidad'],
                        'observaciones' => $row['observaciones']
                    );
                    array_push($respuesta['datos'], $fila);
                }
            }
        $conexion->close();
        echo json_encode($respuesta);
    }

    function nuevoManipulador(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        try {
            $datos = json_decode($_POST['datos']);
            $resultado = $conexion->query("INSERT INTO manipuladores (nombre, apellidos, dni, telefono, direccion, email, tlf_familiar, fiabilidad, velocidad, disponibilidad, observaciones) 
                                           VALUES ('".$datos->{'nombre'}."', '".$datos->{'apellidos'}."', '".$datos->{'dni'}."', '".$datos->{'telefono'}."', '".$datos->{'direccion'}."', '".$datos->{'email'}."', '".$datos->{'tlf_familiar'}."', '".$datos->{'fiabilidad'}."', '".$datos->{'velocidad'}."', '".$datos->{'disponibilidad'}."', '".$datos->{'observaciones'}."')");
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

    function comprobarManipuladores(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $resultado = $conexion->query("SELECT EXISTS (SELECT 1 FROM manipuladores) AS respuesta");
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

    function actualizarManipuladores(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("UPDATE manipuladores 
                                               SET nombre='".$datos[$i]->{'nombre'}."', apellidos='".$datos[$i]->{'apellidos'}."', dni='".$datos[$i]->{'dni'}."', telefono='".$datos[$i]->{'telefono'}."', direccion='".$datos[$i]->{'direccion'}."', dias_seguidos_trabajados='".$datos[$i]->{'dst'}."', email='".$datos[$i]->{'email'}."', tlf_familiar='".$datos[$i]->{'tlf_familiar'}."', fiabilidad='".$datos[$i]->{'fiabilidad'}."', velocidad='".$datos[$i]->{'velocidad'}."', disponibilidad='".$datos[$i]->{'disponibilidad'}."', observaciones='".$datos[$i]->{'observaciones'}."' 
                                               WHERE idmanipulador='".$datos[$i]->{'id'}."'");
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

    function borrarManipuladores(){
        header('Content-Type: application/json; charset=utf-8');
        $conexion = mysql_manipuladores();
        $conexion->begin_transaction();
        $datos = json_decode($_POST['datos']);
        try {
            for ($i=0; $i < count($datos); $i++) { 
                $resultado = $conexion->query("DELETE FROM manipuladores WHERE idmanipulador='".$datos[$i]->{'id'}."'");
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