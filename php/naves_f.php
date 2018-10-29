<?php
include("mysqlConexion.php");

if(isset($_POST['op'])){
    switch($_POST['op']){
        case 'show':
            showNaves();
            break;
        case 'add':
            addNave();
            break;
        case 'update': 
            editarNaves();
            break;
        case 'delete':
            borrarNaves();
            break;
    }
}
function showNaves(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from naves";
    $resultQuery =$conn->query($query);
    if (!$resultQuery) {
        $response['error'] = 1;
        $response['mensaje'] = "Error en la consulta: " + $conexion->error;
    } else {
        $response['error'] = 0;
        $response['datosNaves'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            $fila = array(
                'idnave' => $fila['idnave'],
                'designacion' => $fila['designacion']
            );
            array_push($response['datosNaves'], $fila);
        }
    }
    $conn->close();
    echo json_encode($response);
}

function editarNaves(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['idnave'];
        $designacion= $fila['designacion'];
        $sql= "UPDATE naves SET designacion='$designacion' where idnave=$id";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function borrarNaves(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['idnave'];
        $sql= "DELETE FROM naves where idnave=$id";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function addNave(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    $designacion=$_POST['designacion'];
    $sql="INSERT INTO naves (designacion) 
            VALUES ('$designacion')";
    $resultQuery = $conn->query($sql);
    $conn->commit();
}
?>