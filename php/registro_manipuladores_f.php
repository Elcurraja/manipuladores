<?php
function mostrarRegistroManipuladores(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from registro_manipuladores";
    $resultQuery =$conn->query($query);
    while ($fila = $resultQuery->fetch_assoc()){
    ?>
    <tr class="fila">
        <td><input type="checkbox" name="edit" class="checkedit"></td>
        <td><span><?=$fila['idregistro_manipulador']?></span></td>
        <td><span><?=$fila['idmanipulador']?></span></td>
        <td><input type="text" name="idpuesto" value="<?=$fila['idpuesto']?>" class="input_s form-control" disabled="disable"></td>
        <td><input type="text" name="idturno" value="<?=$fila['idturno']?>" class="input_s form-control" disabled="disable"></td>
        <td><input type="text" name="fecha" value="<?=$fila['fecha']?>" disabled="disable"></td>
        <td><input type="text" name="hora_inicio" value="<?=$fila['hora_inicio']?>" disabled="disable"></td>
        <td><input type="text" name="hora_fin" value="<?=$fila['hora_fin']?>" disabled="disable"></td>
        <td><input type="text" name="idlinea" value="<?=$fila['idlinea']?>" class="input_s form-control" disabled="disable"></td>
    </tr>
    <?php 
    }
}
?>