
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
        <td><input type="text" name="esdiacompleto" value="<?=($fila['esdiacompleto'])? 'Si' : 'No'?>" class="form-control" disabled="disable"></td>
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
        <td><input type="text" name="observaciones" value="<?=$fila['observaciones']?>" class="form-control" disabled="disable"></td>
    </tr>
    <?php 
    $i++;
    }