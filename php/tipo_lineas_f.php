<?php
require("mysqlConexion.php");
if(isset($_POST['op'])){
    switch($_POST['op']){
        case 'show':
            showTipoLineas();
            break;
        case 'add':
            addTipoLinea();
            break;
        case 'update': 
            editarTipoLineas();
            break;
        case 'delete':
            borrarTipoLineas();
            break;
    }
}
function showTipoLineas(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from tipo_linea";
    $resultQuery =$conn->query($query);
    if (!$resultQuery) {
        $response['error'] = 1;
        $response['mensaje'] = "Error en la consulta: " + $conexion->error;
    } else {
        $response['error'] = 0;
        $response['datosTipoLinea'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            $fila = array(
                'idtipolinea' => $fila['idtipolinea'],
                'nombre' => $fila['nombre']
            );
            array_push($response['datosTipoLinea'], $fila);
        }
    }
    $conn->close();
    echo json_encode($response);
}

function editarTipoLineas(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    try {
        foreach($_POST['datos'] as $fila){
            $id=$fila['idtipolinea'];
            $nombre= $fila['nombre'];
            $sql= "UPDATE tipo_linea SET nombre='$nombre' where idtipolinea=$id";
            $resultQuery = $conn->query($sql);
            if (!$resultQuery) {
                throw new Exception($conn->error);
            }
            else{
                $response['error'] = 0;
            }
        }
        $conn->commit();
    } 
    catch (Exception $e) {
        $conn->rollback();
        $response['error'] = 1;
        $response['mensaje'] = $e->getMessage();
    }
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($response);
}

function borrarTipoLineas(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['idtipolinea'];
        $sql= "DELETE FROM tipo_linea where idtipolinea=$id";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function addTipoLinea(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    $nombre=$_POST['nombre'];
    $sql="INSERT INTO tipo_linea (nombre) 
            VALUES ('$nombre')";
    $resultQuery = $conn->query($sql);
    $conn->commit();

}
?>