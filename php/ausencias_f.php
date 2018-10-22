<?php
include("mysqlConexion.php");
  if(isset($_POST['op'])){
    switch($_POST['op']){
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

function mostrarAusencias(){
    $conn=mysql_manipuladores();
    $query= "SELECT * from ausencias";
    $resultQuery =$conn->query($query);
    $i=1;
    while ($fila = $resultQuery->fetch_assoc()){
    ?>
    <tr class="fila">
        <td><input type="checkbox" name="edit" class="checkedit"></td>
        <td><span><?=$fila['idausencia']?></span></td>
        <td><span><?=$fila['idmanipulador']?></span></td>
        
        <td><div class="input-group date" id="fecha<?=$i ?>" data-target-input="nearest" >
                <input type="text" class="form-control datetimepicker-input" data-target="#fecha<?=$i?>" disabled="disable">
                <div class="input-group-append" data-target="#fecha<?=$i?>" data-toggle="datetimepicker">
                <div class="input-group-text"><i class="far fa-calendar-alt"></i></div>
                </div>
            </div>
            <script type="text/javascript">
            $(function () {
                var fecha= "<?=$fila['fecha']; ?>"
                var indice ="<?=$i;?>"
                $('#fecha'+indice).datetimepicker({
                    locale: 'es',
                    format: 'L',
                    date:fecha
                });
            });
            </script>
        </td>
        <td><input type="text" name="esdiacompleto" value="<?=($fila['esdiacompleto'])? 'Si' : 'No'?>" class="border rounded" disabled="disable"></td>
        <td><div class="input-group date" id="hora_inicio_table<?=$i ?>" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#hora_inicio_table<?=$i?>" disabled="disable">
                <div class="input-group-append" data-target="#hora_inicio_table<?=$i?>" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="far fa-clock"></i></div>
                </div>
            </div>
            <script type="text/javascript">
            $(function () {
                var horai= "<?=$fila['hora_inicio']; ?>"
                var indice ="<?=$i;?>"
                $('#hora_inicio_table'+indice).datetimepicker({
                    locale: 'es',
                    format: 'LT',
                    date:moment(horai,"HH:mm:ss")
                });
            });
            </script>
        </td>
        <td><div class="input-group date" id="hora_fin_table<?=$i?>" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#hora_fin_table<?=$i?>" disabled="disable">
                <div class="input-group-append" data-target="#hora_fin_table<?=$i?>" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="far fa-clock"></i></div>
            </div>
            </div>
            <script type="text/javascript">
            $(function () {
                var horaf= "<?=$fila['hora_fin'];?>"
                var indice ="<?=$i;?>"
                $('#hora_fin_table'+indice).datetimepicker({
                    locale: 'es',
                    format: 'LT',
                    date:moment(horaf,"HH:mm:ss")
                });
            });
            </script> 
        </td>
        <td><input type="text" name="observaciones" value="<?=$fila['observaciones']?>" class="border rounded" disabled="disable"></td>
    </tr>
    <?php 
    $i++;
    }
}

function addAusencia(){
    $conn=mysql_manipuladores();
    $conn->begin_transaction();
    $idmanipulador=$_POST['idmanipulador'];
    $fechaF = explode("/",$_POST['fecha']);
    $fecha =$fechaF[2]."-".$fechaF[1]."-".$fechaF[0];
    $esdiacompleto=$_POST['esdiacompleto'];
    $observaciones=$_POST['observaciones'];
    if(isset($_POST['horainicio'])&& isset($_POST['horafin'])){
        $horainicio=$_POST['horainicio'];
        $horafin=$_POST['horafin'];
        $sql="INSERT INTO ausencias (idmanipulador,fecha,esdiacompleto,hora_inicio,hora_fin,observaciones) 
            VALUES ($idmanipulador,'$fecha',$esdiacompleto,'$horainicio','$horafin','$observaciones')";
    }
    else{
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
        if($fila['diacompleto']=='si')
            $diacompleto=1;
        else
            $diacompleto=0;
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