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
        $arrayLineasSP = array();
        $arrayLineas = array();
        $sqlOrderFiabilidad = "SELECT * FROM reparto ORDER BY fiabilidad ASC";
        $sqlOrderVelocidad  = "SELECT * FROM reparto ORDER BY velocidad  ASC";

        for($a=0;$a<count($parametrosLineas);$a++){
            if($parametrosLineas[$a]['opFiablidad'] == 'false' && $parametrosLineas[$a]['opVelocidad'] =='false'){
                $temp = array(
                    'idlinea' => $parametrosLineas[$a]['id_linea'],
                    'max_puestos' => $parametrosLineas[$a]['puestos_max'],
                    'listaManipuladores' => array(),
                );
                array_push($arrayLineasSP,$temp);
            }
            else {
                $temp = array(
                    'idlinea' => $parametrosLineas[$a]['id_linea'],
                    'max_puestos' => $parametrosLineas[$a]['puestos_max'],
                    'listaManipuladores' => array(),
                );
                array_push($arrayLineas,$temp);
            }
        }
        for($f=0; $f<count();$f++){

        }
        print_r($arrayLineasSP);
        // $response['sql']=array();
        // for($i=0;$i<count($parametrosLineas);$i++){
            
        //     if($parametrosLineas[$i]['fiabilidad']>=$parametrosLineas[$i]['velocidad'] && $parametrosLineas[$i]['velocidad']>=$parametrosLineas[$i]['disponibilidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY fiabilidad ASC,velocidad ASC, disponibilidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }
        //     else if($parametrosLineas[$i]['fiabilidad']>=$parametrosLineas[$i]['disponibilidad'] && $parametrosLineas[$i]['disponibilidad']>=$parametrosLineas[$i]['velocidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY fiabilidad ASC,disponibilidad ASC, velocidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }
        //     else if($parametrosLineas[$i]['velocidad']>=$parametrosLineas[$i]['fiabilidad'] && $parametrosLineas[$i]['fiabilidad']>=$parametrosLineas[$i]['disponibilidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY velocidad ASC,fiabilidad ASC, disponibilidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }   
        //     else if($parametrosLineas[$i]['velocidad']>=$parametrosLineas[$i]['disponibilidad'] && $parametrosLineas[$i]['disponibilidad']>=$parametrosLineas[$i]['fiabilidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY velocidad ASC,disponibilidad ASC, fiabilidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }
        //     else if($parametrosLineas[$i]['disponibilidad']>=$parametrosLineas[$i]['fiabilidad'] && $parametrosLineas[$i]['fiabilidad']>=$parametrosLineas[$i]['velocidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY disponibilidad ASC,fiabilidad ASC, velocidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }
        //     else if($parametrosLineas[$i]['disponibilidad']>=$parametrosLineas[$i]['velocidad'] && $parametrosLineas[$i]['velocidad']>=$parametrosLineas[$i]['fiabilidad']){
        //         $sqlParam = "SELECT * FROM reparto ORDER BY disponibilidad ASC,velocidad ASC, fiabilidad ASC";
        //         array_push($response['sql'],$sqlParam);
        //     }
            
           
        // }
        
        echo json_encode($response);
    }
?>
