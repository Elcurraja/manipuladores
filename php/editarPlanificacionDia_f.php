<?php
require("mysqlConexion.php");

if(isset($_POST['op'])){
    switch($_POST['op']){
        case "mostrarPlanificacionDia":
            mostrarRegistros();
            break;
        case 'update': 
            updatePlanificacionDia();
            break;
    }
}
function mostrarRegistros(){
    $conn=mysql_manipuladores();
    $temp= str_replace("/","-",$_POST['fecha']);
    $fecha=date("Y-m-d",strtotime($temp));
    $query = "SELECT r.idregistro_manipulador,r.idmanipulador,m.nombre, m.apellidos,r.idlinea FROM registro_manipuladores as r,manipuladores as m 
                WHERE fecha='$fecha' AND r.idmanipulador = m.idmanipulador ORDER BY m.nombre";
    
    $resultQuery =$conn->query($query);
    $response['datosPlanificacionDia'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila = array(
            'idregistro' => $fila['idregistro_manipulador'],
            'idmanipulador' => $fila['idmanipulador'],
            'nombre'=>$fila['nombre'],
            'apellidos'=>$fila['apellidos'],
            'idlinea' => $fila['idlinea']
        );
        array_push($response['datosPlanificacionDia'], $fila);
    }

    //QUERY PARA SACAR LAS LINEAS Y MOSTRARLAS EN EL SELECT LUEGO
    $query= "SELECT idlinea,nombre FROM lineas";
    $resultQuery =$conn->query($query);
    $response['lineas'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila=array('idlinea'=> $fila['idlinea'],
                    'nombre'=> $fila['nombre']);
        array_push($response['lineas'],$fila);
    }
    $conn->close();
    echo json_encode($response);
}
//FUNCION PARA ACTUALIZAR EL REGISTRO
function updatePlanificacionDia(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    try {
        foreach($_POST['datos'] as $fila){
            $idregistro=$fila['idregistro'];
            //$idpuesto= $fila['idpuesto'];
            $idturno=$fila['idturno'];
            $fecha=date("Y-m-d",strtotime(str_replace("/","-",$fila['fecha'])));
            $horainicio=$fila['horainicio'];
            $horafin=$fila['horafin'];
            $idlinea=$fila['idlinea'];
            
            $sql= "UPDATE registro_manipuladores 
                SET idturno=$idturno,fecha='$fecha',
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