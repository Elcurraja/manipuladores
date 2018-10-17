<?php
    function mysql_manipuladores(){
        $connection = new mysqli("192.168.0.46", "practica", "a.1234", "manipuladores");
        $connection ->set_charset("utf-8");
        $connection->autocommit(FALSE);
        return $connection;
    }
?>