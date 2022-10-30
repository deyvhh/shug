<?php

namespace Helper;
class Functions {
    static function view($path, $variables = null){
        if($variables != null){
            foreach($variables as $key=>$val){
                $_SESSION["temp_".$key] = $val;
            }
        }
        $file = include "./views/".$path.".view.php";
        if($variables != null){
            foreach($variables as $key=>$val){
                unset($_SESSION["temp_".$key]);
            }
        }
        return $file;
    }

    static function redirect($path): void {
        header("Location: ".$path);
    }
}