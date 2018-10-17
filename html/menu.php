<nav class="menu navbar navbar-expand navbar-primary bg-primary">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="menu nav-item">
            <a class="nav-link" href="#">Planificar dia</a>
        </li>
        <li class="menu nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Manipuladoras
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="./manipuladores.php">Manipuladoras</a>
                <a class="dropdown-item" href="./descansos.php">Descansos</a>
                <a class="dropdown-item" href="./ausencias.php">Ausencias</a>
              </div>
        </li>
        
        <li class="menu nav-item dropdown ">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Configuracion
              </a>
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
  <h1 class="display-4"> 
    <?php
      $var= (explode("/" , $_SERVER['PHP_SELF'])[2]);
      echo ucfirst(explode(".",$var)[0]);
    ?>
  </h1>
 