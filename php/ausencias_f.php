<?php
include("mysqlConexion.php");
  if(isset($_POST['op'])){
    switch($_POST['op']){
        case 'show':
            showAusencias($_POST['fecha']);
            break;
        case 'add':
            addAusencia();
            break;
        case 'update': 
            editarAusencias();
            break;
        case 'delete':
            borrarAusencias();
            break;
    }
}

function showAusencias($fecha){
    $conn=mysql_manipuladores();
    $select= "SELECT
            a.idausencia,
            a.idmanipulador,
            a.fecha,
            a.esdiacompleto,
            a.hora_inicio,
            a.hora_fin,
            a.observaciones,
            m.nombre,
            m.apellidos
            FROM
                ausencias AS a,
                manipuladores AS m";
    if($fecha=="todos"){
        $query= "$select WHERE m.idmanipulador = a.idmanipulador ORDER BY a.fecha ASC";
    }
    else{
        $var= str_replace("/","-",$fecha);
        $fechaF=date("Y-m-d",strtotime($var));
        $query= "$select WHERE fecha='$fechaF' AND m.idmanipulador = a.idmanipulador ORDER BY a.fecha ASC";
    }
    
    $resultQuery =$conn->query($query);
    if (!$resultQuery) {
        $response['error'] = 1;
        $response['mensaje'] = "Error en la consulta: " + $conexion->error;
    } else {
        $response['error'] = 0;
        $response['datosAusencia'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            $fila = array(
                'idausencia' => $fila['idausencia'],
                'idmanipulador' => $fila['idmanipulador'],
                'nombre' => $fila['nombre'],
                'apellidos' => $fila['apellidos'],
                'fecha'=>$fila['fecha'],
                'esdiacompleto' => $fila['esdiacompleto'],
                'hora_inicio' => $fila['hora_inicio'],
                'hora_fin' => $fila['hora_fin'],
                'observaciones' => $fila['observaciones']
            );
            array_push($response['datosAusencia'], $fila);
        }
    }
    $conn->close();
    echo json_encode($response);
    
}

function addAusencia(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    $idmanipulador=$_POST['idmanipulador'];
    $fechaF = explode("/",$_POST['fecha']);
    $fecha =$fechaF[2]."-".$fechaF[1]."-".$fechaF[0];
    $esdiacompleto=$_POST['esdiacompleto'];
    $observaciones=$_POST['observaciones'];
    //En el caso de que hora de inicio y hora fin existan (es porque no es dia completo)
    if(isset($_POST['horainicio'])&& isset($_POST['horafin'])){
        $horainicio=$_POST['horainicio'];
        $horafin=$_POST['horafin'];
        $sql="INSERT INTO ausencias (idmanipulador,fecha,esdiacompleto,hora_inicio,hora_fin,observaciones) 
            VALUES ($idmanipulador,'$fecha',$esdiacompleto,'$horainicio','$horafin','$observaciones')";
    }
    //No existe horafin
    elseif (isset($_POST['horainicio']) && !isset($_POST['horafin'])){
        $horainicio=$_POST['horainicio'];
        $sql="INSERT INTO ausencias (idmanipulador,fecha,esdiacompleto,hora_inicio,observaciones) 
        VALUES ($idmanipulador,'$fecha',$esdiacompleto,'$horainicio','$observaciones')";
    }
    //No existe ni hora de inicio ni hora de fin (porque es dia completo)
    else {
        $sql="INSERT INTO ausencias (idmanipulador,fecha,esdiacompleto,observaciones) 
        VALUES ($idmanipulador,'$fecha',$esdiacompleto,'$observaciones')";
    }
    $resultQuery = $conn->query($sql);
    $conn->commit();
}
function editarAusencias(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $idausencia=$fila['idausencia'];
        $fechaF = explode("/",$fila['fecha']);
        $fecha =$fechaF[2]."-".$fechaF[1]."-".$fechaF[0];
        $diacompleto=$fila['diacompleto'];
        $observaciones=$fila['observaciones'];
        if(isset($fila['horainicio']) && isset($fila['horafin'])){
            $horainicio=$fila['horainicio'];
            $horafin=$fila['horafin'];
            $sql= "UPDATE ausencias SET fecha='$fecha',esdiacompleto=$diacompleto,observaciones='$observaciones',hora_inicio='$horainicio',hora_fin='$horafin' where idausencia=$idausencia";
        }
        else{
            $sql= "UPDATE ausencias SET fecha='$fecha',esdiacompleto=$diacompleto,observaciones='$observaciones' where idausencia=$idausencia";
        }
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
function borrarAusencias(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $idausencia=$fila['idausencia'];
        $sql= "DELETE FROM ausencias where idausencia=$idausencia";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}