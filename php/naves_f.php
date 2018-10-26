<?php
include("mysqlConexion.php");

if(isset($_POST['op'])){
    switch($_POST['op']){
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
function mostrarNaves(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from naves";
    $resultQuery =$conn->query($query);
    while ($fila = $resultQuery->fetch_assoc()){
    ?>
    <tr class="fila">
        <td><input type="checkbox" name="edit" class="checkedit"></td>
        <td><span><?=$fila['idnave']?></span></td>
        <td><input type="text" name="designacion" class="form-control" value="<?=$fila['designacion']?>" disabled="disable"></td>
    </tr>
    <?php 
    }
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