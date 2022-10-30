<?php

namespace Database;
use PDO;
use PDOException;


class DB{
    public static function query($sql){
        $json = file_get_contents("./config.json");
        $json = json_decode($json, TRUE);
        try {
            $pdo = new PDO("mysql:host=".$json['HOST'].";port=".$json['PORT'].";dbname=".$json['DBNAME'], $json['USER'], $json['PASSWORD']);
            $stmt = $pdo->query($sql);
            return $stmt->fetchAll();
        } catch(PDOException $e) {
            echo 'DB ERROR: ' . $e->getMessage();
            die();
        }
    }
}