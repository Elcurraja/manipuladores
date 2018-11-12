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
        $conexion->begin_transaction();
        //Vaciamos la tabla cada vez que planificamos el dia
        $query = "TRUNCATE TABLE reparto";
        $result=$conexion->query($query);
        
        //Insertamos en una tabla temporal todos los manipuladores que tienen menos de N dias trabajados
        $sql = "INSERT INTO reparto SELECT
                    idmanipulador,
                    nombre,
                    apellidos,
                    dias_seguidos_trabajados,
                    fiabilidad,
                    velocidad,
                    disponibilidad 
                FROM
                    manipuladores 
                WHERE
                    dias_seguidos_trabajados <= 15";
        $resultado = $conexion->query($sql);
        if (!$resultado) {
            $response['error'] = 1;
            $response['mensaje'] = "Error en el duplicado de registros: ".$conexion->error;
        } 
        else {
            $response['error'] = 0;
        }
        $conexion->commit();

        $parametrosLineas= $_POST['datosLineas'];
        //var_dump($parametrosLineas);
        
        $resultOrdenFiabilidad     = $conexion->query("SELECT * FROM reparto ORDER BY fiabilidad      ASC ");
        $resultOrdenVelocidad      = $conexion->query("SELECT * FROM reparto ORDER BY velocidad       ASC ");
        $resultOrdenDisponibildad  = $conexion->query("SELECT * FROM reparto ORDER BY disponibilidad  ASC ");
        
        $countPuestos= 0;
        $arrayLineasSP = [];
        $arrayLineas = [];
        for($a=0;$a<count($parametrosLineas);$a++){
            $countPuestos+=$parametrosLineas[$a]['puestos_max'];
            if($parametrosLineas[$a]['Fiablidad'] == 'false' && $parametrosLineas[$a]['Velocidad'] =='false' && $parametrosLineas[$a]['Disponibilidad'] =='false'){
                $temp = [
                    'idlinea'=>$parametrosLineas[$a]['id_linea'],
                    'max_puestos'=>$parametrosLineas[$a]['puestos_max'],
                    'contador_puestos'=>$parametrosLineas[$a]['puestos_max'],
                    'listaManipuladores'=>[]
                ];
                $arrayLineasSP[$parametrosLineas[$a]['id_linea']]=$temp;
            }
            else {
                $temp = [
                    'idlinea'=>$parametrosLineas[$a]['id_linea'],
                    'max_puestos'=>$parametrosLineas[$a]['puestos_max'],
                    'contador_puestos'=>$parametrosLineas[$a]['puestos_max'],
                    'listaManipuladores'=>[]
                ];
                $arrayLineas[$parametrosLineas[$a]['id_linea']]=$temp;
            }
        }

        //Mientras que la variable sea menor que el numero total de puestos 
        for($totalPuestos=0; $totalPuestos<$countPuestos;$totalPuestos++){
            //Recorremos cada fila
            for($nlineas=0;$nlineas<count($parametrosLineas);$nlineas++){
                echo(count($arrayLineas[$parametrosLineas[$nlineas]['id_linea']]['listaManipuladores']) . " " );
                while($arrayLineas[$parametrosLineas[$nlineas]]['contador_puestos'] < $arrayLineas[$parametrosLineas[$nlineas]]['max_puestos']){

                    if($parametrosLineas[$nlineas]['Fiablidad'] == 'true'){
                        while($row = $resultOrdenFiabilidad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$parametrosLineas[$nlineas]['id_linea']]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            --$arrayLineas[$parametrosLineas[$nlineas]['contador_puestos']];
                            break;
                        }
                    }
                    else if($parametrosLineas[$nlineas]['Velocidad'] == 'true'){
                        while($row = $resultOrdenVelocidad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$parametrosLineas[$nlineas]['id_linea']]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            --$arrayLineas[$parametrosLineas[$nlineas]['contador_puestos']];
                            break;
                        }
                    }
                    else if($parametrosLineas[$nlineas]['Disponibilidad'] == 'true'){
                        while($row = $resultOrdenDisponibildad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$parametrosLineas[$nlineas]['id_linea']]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            --$arrayLineas[$parametrosLineas[$nlineas]['contador_puestos']];
                            break;
                        }
                    }
                }
            }
        }
       
       print_r($arrayLineas);
        
        echo json_encode($response);
    }
?>
