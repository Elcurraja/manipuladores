<?php
$servername = "192.168.0.46";
$username = "practica";
$password = "a.1234";
$db = "manipuladores";

// Crea la conexion y la checkea
$conn = mysqli_connect($servername, $username, $password,$db);
if (!$conn) 
    die("Connection failed: " . mysqli_connect_error());

?>