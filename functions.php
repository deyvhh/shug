<?php

function dd($value){
    echo "<pre>";
    var_dump($value);
    echo "</pre>";
    die();
}

function getVar($key){
    return $_SESSION["temp_".$key] ?? null;
}