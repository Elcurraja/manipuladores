<div id="cont" class="sticky-top">
<nav class="menu navbar navbar-expand navbar-primary">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="menu_li nav-item">
            <a class="nav-link" href="#">Planificar dia</a>
            <div id="divlow1"></div>
        </li>
        <li class="menu_li nav-item">
            <a class="nav-link" href="./registro_manipuladores.php">Registro Manipuladores</a>
            <div id="divlow2"></div>
        </li>
        <li class="menu_li nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Manipuladores
              </a>
              <div id="divlow3"></div>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="./manipuladores.php">Manipuladores</a>
                <a class="dropdown-item" href="./descansos.php">Descansos</a>
                <a class="dropdown-item" href="./ausencias.php">Ausencias</a>
              </div>
        </li>
        <li class="menu_li nav-item dropdown ">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Configuracion
              </a>
              <div id="divlow4"></div>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="./naves.php">Naves</a>
                <a class="dropdown-item" href="./lineas.php">Lineas</a>
                <a class="dropdown-item" href="./tipolineas.php">Tipo Linea</a>
                <a class="dropdown-item" href="./turnos.php">Turnos</a>
              </div>
        </li>
      </ul>
    </div>
  </nav>
<script>
    //SCRIPT PARA AÑADIR UNA CLASE A UN DIV EN EL MENU PARA SABER DONDE ESTAMOS
  $(document).ready(function() {
    var url= (window.location.pathname).split("/")
    if(url[3]=='manipuladores.php' || url[3]=='ausencias.php' || url[3]=='descansos.php'){
        $("#divlow3").addClass("subdiv")
    }
    else if(url[3]=='naves.php'|| url[3]=='lineas.php' || url[3]=='tipolineas.php' || url[3]=='turnos.php'){
        $("#divlow4").addClass("subdiv")
    }
    else if(url[3]=='registro_manipuladores.php'){
        $("#divlow2").addClass("subdiv")
    }
    else{
        $("#divlow1").addClass("subdiv")
    }
  })
</script>
 