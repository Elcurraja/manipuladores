<?php
include("mysqlConexion.php");
if(isset($_POST['op'])){
    switch($_POST['op']){
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
function mostrarLineas(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from lineas";
    $resultQuery =$conn->query($query);
    while ($fila = $resultQuery->fetch_assoc()){
    ?>
    <tr class="fila">
        <td><input type="checkbox" name="edit" class="checkedit"></td>
        <td><span><?=$fila['idlinea']?></span></td>
        <td><input type="text" name="nombre" value="<?=$fila['nombre']?>" class="border rounded" disabled="disable"></td>
        <td><input type="text" name="idnave" value="<?=$fila['idnave']?>" class="border rounded" disabled="disable"></td>
        <td><input type="text" name="idtipolinea" value="<?=$fila['idtipolinea']?>" class="border rounded" disabled="disable"></td>
        <td><input type="text" name="disponible" value="<?=$fila['estadisponible']?>" class="border rounded" disabled="disable"></td>
        <td><input type="text" name="puestosmax" value="<?=$fila['puestos_maximos']?>" class="border rounded" disabled="disable"></td>

    </tr>
    <?php 
    }
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
        $sql= "UPDATE lineas SET nombre='$nombre',idnave=$idnave,idtipolinea=$idtipolinea,estadisponible=$disponible,puestos_maximos=$puestosmax where idlinea=$id";
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
    $sql="INSERT INTO lineas (nombre,idnave,idtipolinea,estadisponible,puestos_maximos) 
            VALUES ('$nombre',$idnave,$idtipolinea,$disponible,$puestosmax)";
    $resultQuery = $conn->query($sql);
    $conn->commit();

}
?>