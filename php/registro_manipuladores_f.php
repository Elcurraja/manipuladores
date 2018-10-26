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
            deleteReg();
            break;
        case 'buscarReg': 
            mostrarRegistros($_POST['fecha'],$_POST['id']);
            break;
        case 'reasignarLinea':
            reasignarLinea();
        break;
    }
}

function mostrarRegistros($fecha,$id=0){
    $conn=mysql_manipuladores();
    //QUERY GENERAL CON LOS CAMPOS REQUERIDOS Y LAS TABLAS DONDE LOS SACAREMOS
    $query1 = "SELECT r.idregistro_manipulador,r.idmanipulador,concat(m.nombre, ' ', m.apellidos)as nombre,r.idturno,r.fecha,r.hora_inicio,r.hora_fin,r.idlinea FROM registro_manipuladores as r,manipuladores as m ";
    
    //BUSQUEDA POR ID_MANIPULADOR
    if($id!=0){
        $var= str_replace("/","-",$fecha);
        $fechaF=date("Y-m-d",strtotime($var));
        $query= "$query1 WHERE fecha='$fechaF' AND r.idmanipulador=$id AND  r.idmanipulador = m.idmanipulador ORDER BY hora_fin";
    }
    else{
        //BUSQUEDA DE TODOS
        if($fecha=="todos"){
            $query= "$query1 WHERE r.idmanipulador = m.idmanipulador";
        }
        else{//BUSQUEDA POR UNA FECHA CONCRETA
            $var= str_replace("/","-",$fecha);
            $fechaF=date("Y-m-d",strtotime($var));
            $query= "$query1 WHERE fecha='$fechaF' AND r.idmanipulador = m.idmanipulador";
        }
    }
    // echo $query;
    $resultQuery =$conn->query($query);
    $response['datosReg'] = array();
    while ($fila = $resultQuery->fetch_assoc()){
        $fila = array(
            'idregistro' => $fila['idregistro_manipulador'],
            'idmanipulador' => $fila['idmanipulador'],
            'nombre'=>$fila['nombre'],
            //'idpuesto' => $fila['idpuesto'],
            'idturno' => $fila['idturno'],
            'fecha' => $fila['fecha'],
            'hora_inicio' => $fila['hora_inicio'],
            'hora_fin' => $fila['hora_fin'],
            'idlinea' => $fila['idlinea']
        );
        array_push($response['datosReg'], $fila);
    }

    //QUERY PARA SACAR LOS TURNOS Y MOSTRARLAS EN EL SELECT LUEGO
    if($id==0){
        $query= "SELECT idturno,franja FROM turnos";
        $resultQuery =$conn->query($query);
        $response['turnos'] = array();
        while ($fila = $resultQuery->fetch_assoc()){
            $fila=array('idturno'=> $fila['idturno'],
                        'franja'=> $fila['franja']);
            array_push($response['turnos'],$fila);
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
    }

    $conn->close();
    echo json_encode($response);
}
//FUNCION PARA ACTUALIZAR EL REGISTRO
function updateReg(){
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

//BORRAR REGISTROS
function deleteReg(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    foreach($_POST['datos'] as $fila){
        $id=$fila['idRegistroManipulador'];
        $sql= "DELETE FROM registro_manipuladores where idregistro_manipulador=$id";
        $resultQuery = $conn->query($sql);
        $conn->commit();
    }
}
//SE EJECUTA EL INSERT DEL NUEVO REGISTRO Y HACEMOS UN UPDATE DEL ULTIMO REGISTRO
//DONDE CAMBIAMOS LA FECHA_FIN POR LA HORA_INICIO DEL NUEVO REGISTRO
function reasignarLinea(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();

    //INSERT
    try {
        $idmanipulador= $_POST['idmanipulador'];
        $fecha=date("Y-m-d",strtotime(str_replace("/","-",$_POST['fecha'])));
        $idturno = $_POST['idturno'];
        $horainicio = $_POST['horainicio'];
        $horafin = $_POST['horafin'];
        $idlinea = $_POST['idlinea'];
        $query = "INSERT INTO registro_manipuladores (idmanipulador,idturno,fecha,hora_inicio,hora_fin,idlinea) 
                    VALUES ($idmanipulador,$idturno,'$fecha','$horainicio','$horafin',$idlinea)";
        $resultQuery = $conn->query($query);
        if (!$resultQuery) {
            throw new Exception($conn->error);
        }
        else{
            $response['errorInsert'] = 0;
        }
        
        $conn->commit();
    } 
    catch (Exception $e) {
        $conn->rollback();
        $response['errorInsert'] = 1;
        $response['mensajeInsert'] = $e->getMessage();
    }

    //UPDATE
    try {
        $idregistro= $_POST['idregistro'];
        $horainicio = $_POST['horainicio'];
        $query = "UPDATE registro_manipuladores SET hora_fin='$horainicio' WHERE idregistro_manipulador=$idregistro";
        $resultQuery = $conn->query($query);
        if (!$resultQuery) {
            throw new Exception($conn->error);
        }
        else{
            $response['errorUpdate'] = 0;
        }
        
        $conn->commit();
    } 
    catch (Exception $e) {
        $conn->rollback();
        $response['errorUpdate'] = 1;
        $response['mensajeUpdate'] = $e->getMessage();
    }

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($response);
}
?>