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
        
        // $resultOrdenFiabilidad     = $conexion->query("SELECT * FROM reparto ORDER BY fiabilidad      ASC LIMIT 1");
        // $resultOrdenVelocidad      = $conexion->query("SELECT * FROM reparto ORDER BY velocidad       ASC LIMIT 1");
        // $resultOrdenDisponibildad  = $conexion->query("SELECT * FROM reparto ORDER BY disponibilidad  ASC LIMIT 1");
        
        $countPuestosLineas= 0;
        $countPuestosLineasSP = 0;
        $arrayLineasSP = [];
        $arrayLineas = [];
        
        for($a=0;$a<count($parametrosLineas);$a++){
            if($parametrosLineas[$a]['Fiabilidad'] === 'false' && $parametrosLineas[$a]['Velocidad'] ==='false' && $parametrosLineas[$a]['Disponibilidad'] ==='false'){
                $countPuestosLineasSP+=$parametrosLineas[$a]['puestos_max'];
                $temp = [
                    'idlinea'=>$parametrosLineas[$a]['id_linea'],
                    'fiabilidad'=>$parametrosLineas[$a]['Fiabilidad'],
                    'velocidad'=>$parametrosLineas[$a]['Velocidad'],
                    'disponibilidad'=>$parametrosLineas[$a]['Disponibilidad'],
                    'max_puestos'=>intval($parametrosLineas[$a]['puestos_max']),
                    'contador_puestos'=>intval($parametrosLineas[$a]['puestos_max']),
                    'orden_fiabilidad'=>$parametrosLineas[$a]['Fiabilidad'],
                    'orden_velocidad'=>$parametrosLineas[$a]['Velocidad'],
                    'orden_disponibilidad'=>$parametrosLineas[$a]['Disponibilidad'],
                    'listaManipuladores'=>[]
                ];
                $arrayLineasSP[$parametrosLineas[$a]['id_linea']]=$temp;
            }
            else {
                $countPuestosLineas+=$parametrosLineas[$a]['puestos_max'];
                $temp = [
                    'idlinea'=>$parametrosLineas[$a]['id_linea'],
                    'fiabilidad'=>$parametrosLineas[$a]['Fiabilidad'],
                    'velocidad'=>$parametrosLineas[$a]['Velocidad'],
                    'disponibilidad'=>$parametrosLineas[$a]['Disponibilidad'],
                    'max_puestos'=>intval($parametrosLineas[$a]['puestos_max']),
                    'contador_puestos'=>intval($parametrosLineas[$a]['puestos_max']),
                    'orden_fiabilidad'=>$parametrosLineas[$a]['Fiabilidad'],
                    'orden_velocidad'=>$parametrosLineas[$a]['Velocidad'],
                    'orden_disponibilidad'=>$parametrosLineas[$a]['Disponibilidad'],
                    'listaManipuladores'=>[]
                ];
                $arrayLineas[$parametrosLineas[$a]['id_linea']]=$temp;
            }
        }
        // var_dump($arrayLineas);
        // echo ($arrayLineas[11]['contador_puestos']);
        
        //Mientras que la variable sea menor que el numero total de puestos 
     
        echo $countPuestosLineas . " " . $countPuestosLineasSP;
        for($totalPuestos=0; $totalPuestos<$countPuestosLineas;$totalPuestos++){
            //Recorremos cada fila
            foreach ($arrayLineas as $index => $item){
                if($item['contador_puestos']>0){
                    if($item['fiabilidad'] === 'true'){
                        $resultOrdenFiabilidad = $conexion->query("SELECT * FROM reparto ORDER BY fiabilidad ASC LIMIT 1");
                        while($row = $resultOrdenFiabilidad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$index]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            $arrayLineas[$index]['contador_puestos']--;            
                        }
                    }
                    if($item['velocidad'] === 'true'){
                        $resultOrdenVelocidad = $conexion->query("SELECT * FROM reparto ORDER BY velocidad ASC LIMIT 1");
                        while($row = $resultOrdenVelocidad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$index]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            $arrayLineas[$index]['contador_puestos']--;            
                        }
                    }
                    if($item['disponibilidad'] === 'true'){
                        $resultOrdenDisponibilidad = $conexion->query("SELECT * FROM reparto ORDER BY disponibilidad ASC LIMIT 1");
                        while($row = $resultOrdenDisponibilidad->fetch_assoc() ){
                            $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                            array_push($arrayLineas[$index]['listaManipuladores'],$manipulador);
                            $id= $row["idmanipulador"];
                            $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                            $conexion->commit();
                            $arrayLineas[$index]['contador_puestos']--;            
                        }
                    }
                }                         
            }
        }
        for($totalPuestosB=0; $totalPuestosB<$countPuestosLineasSP;$totalPuestosB++){
            foreach ($arrayLineasSP as $index => $item){
                if($item['contador_puestos']>0){
                    $result = $conexion->query("SELECT * FROM reparto LIMIT 1");
                    while($row = $result->fetch_assoc()){
                        $manipulador  = (['idmanipulador'=>$row['idmanipulador'],'nombre'=>$row['nombre'],'apellidos'=>$row['apellidos']]);
                        array_push($arrayLineasSP[$index]['listaManipuladores'],$manipulador);
                        $id= $row["idmanipulador"];
                        $sqlExtraer = $conexion->query("DELETE FROM reparto WHERE idmanipulador=$id");
                        $conexion->commit();
                        $arrayLineasSP[$index]['contador_puestos']--;
                    }
                }
            }
        }
        
       var_dump($arrayLineas);
       var_dump($arrayLineasSP);
        
        echo json_encode($response);
    }
?>
