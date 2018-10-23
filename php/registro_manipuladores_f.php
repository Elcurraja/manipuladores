<?php
require("mysqlConexion.php");
if(isset($_POST['op'])){
    switch($_POST['op']){
        case "mostrarRegistros":
            mostrarRegistros($_POST['fecha']);
            break;
        case 'update': 
            updateReg();
            break;
        case 'delete':
            //borrarRegistroManipuladores();
            break;
        case 'buscarReg': 
        mostrarRegistros($_POST['fecha'],$_POST['id']);
        break;
    }
}

function mostrarRegistros($fecha,$id=0){
    $conn=mysql_manipuladores();
    if($id!=0){
        $var= str_replace("/","-",$fecha);
        $fechaF=date("Y-m-d",strtotime($var));
        $query= "SELECT * FROM registro_manipuladores WHERE fecha='$fechaF' AND idmanipulador=$id";
    }
    else{

        if($fecha=="todos"){
            $query= "SELECT * FROM registro_manipuladores";
        }
        else{
            $var= str_replace("/","-",$fecha);
            $fechaF=date("Y-m-d",strtotime($var));
            $query= "SELECT * FROM registro_manipuladores WHERE fecha='$fechaF'";
        }
    }
    $resultQuery =$conn->query($query);
    $response['datosReg'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila = array(
            'idregistro' => $fila['idregistro_manipulador'],
            'idmanipulador' => $fila['idmanipulador'],
            'idpuesto' => $fila['idpuesto'],
            'idturno' => $fila['idturno'],
            'fecha' => $fila['fecha'],
            'hora_inicio' => $fila['hora_inicio'],
            'hora_fin' => $fila['hora_fin'],
            'idlinea' => $fila['idlinea']
        );
        array_push($response['datosReg'], $fila);
    }
    if($id==0){
        $query= "SELECT idturno FROM turnos";
        $resultQuery =$conn->query($query);
        $response['turnos'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            array_push($response['turnos'],$fila['idturno']);
        }
        
        $query= "SELECT idlinea FROM lineas";
        $resultQuery =$conn->query($query);
        $response['lineas'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            array_push($response['lineas'],$fila['idlinea']);
        }
    }

    $conn->close();
    echo json_encode($response);
}

function updateReg(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    try {
        foreach($_POST['datos'] as $fila){
            $idregistro=$fila['idregistro'];
            $idpuesto= $fila['idpuesto'];
            $idturno=$fila['idturno'];
            $fecha=date("Y-m-d",strtotime(str_replace("/","-",$fila['fecha'])));
            $horainicio=$fila['horainicio'];
            $horafin=$fila['horafin'];
            $idlinea=$fila['idlinea'];
            
            $sql= "UPDATE registro_manipuladores 
                SET idpuesto=$idpuesto,idturno=$idturno,fecha='$fecha',
                hora_inicio='$horainicio',hora_fin='$horafin',idlinea=$idlinea
                where idregistro_manipulador=$idregistro";
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
?>