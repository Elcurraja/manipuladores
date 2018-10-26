<?php
include("mysqlConexion.php");
if(isset($_POST['op'])){
    switch($_POST['op']){
        case 'showLineas':
            showLineas();
            break;
        case 'add':
            addlinea();
            break;
        case 'update': 
            editarLineas();
            break;
        case 'delete':
            borrarLineas();
            break;
    }
}
function showLineas(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from lineas";
    
    $resultQuery =$conn->query($query);
    $response['lineas'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila = array(
            'idlinea' => $fila['idlinea'],
            'nombre' => $fila['nombre'],
            'idnave' => $fila['idnave'],
            'idtipolinea' => $fila['idtipolinea'],
            'estadisponible' => $fila['estadisponible'],
            'puestosmax' => $fila['puestos_maximos'],
            'fiabilidad' => $fila['fiabilidad'],
            'velocidad' => $fila['velocidad'],
            'disponibilidad' => $fila['disponibilidad'],
        );
        array_push($response['lineas'], $fila);
    }
    $query= "SELECT idnave,designacion FROM naves";
    $resultQuery =$conn->query($query);
    $response['nave'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila=array('idnave'=> $fila['idnave'],
                    'designacion'=> $fila['designacion']);
            array_push($response['nave'],$fila);
    }

    $query= "SELECT idtipolinea,nombre FROM tipo_linea";
    $resultQuery =$conn->query($query);
    $response['tipolinea'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila=array('idtipolinea'=> $fila['idtipolinea'],
                    'nombre'=> $fila['nombre']);
            array_push($response['tipolinea'],$fila);
    }

    $conn->close();
    echo json_encode($response);
}
function editarLineas(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['IDlineas'];
        $nombre= $fila['nombre'];
        $idnave=$fila['IDnave'];
        $idtipolinea=$fila['IDtipolinea'];
        $disponible=$fila['disponible'];
        $puestosmax=$fila['puestosmax'];
        $fiabilidad = $fila['fiabilidad'];
        $velocidad = $fila['velocidad'];
        $disponibilidad = $fila['disponibilidad'];
        $sql= "UPDATE lineas 
        SET nombre='$nombre',idnave=$idnave,idtipolinea=$idtipolinea,estadisponible=$disponible,
            puestos_maximos=$puestosmax,fiabilidad=$fiabilidad,velocidad=$velocidad,disponibilidad=$disponibilidad
            where idlinea=$id";
        echo $sql;
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function borrarLineas(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['IDlineas'];
        $sql= "DELETE FROM lineas where idlinea=$id";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function addlinea(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    $nombre=$_POST['nombre'];
    $idnave=$_POST['idnave'];
    $idtipolinea=$_POST['idtipolinea'];
    $disponible=$_POST['disponible'];
    $puestosmax=$_POST['puestosmax'];
    $fiabilidad=$_POST['fiabilidad'];
    $velocidad=$_POST['velocidad'];
    $disponibilidad=$_POST['disponibilidad'];
    $sql="INSERT INTO lineas (nombre,idnave,idtipolinea,estadisponible,puestos_maximos,fiabilidad,velocidad,disponibilidad) 
            VALUES ('$nombre',$idnave,$idtipolinea,$disponible,$puestosmax,$fiabilidad,$velocidad,$disponibilidad)";
    $resultQuery = $conn->query($sql);
    echo $sql;
    $conn->commit();

}
?>