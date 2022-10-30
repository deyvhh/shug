<?php


use Helper\Functions;
use Route\Route;
use Session\Session;
use Database\DB;

//$req => [
//    "uriParams" -> dynamic params from route uri,
//    "params" -> GET, POST params
//]

Route::get("/elo/{siema}", function($req) {
    echo $req["uriParams"]["siema"];
});
Route::get("/ee", function() {
    return Functions::view("index", [
        "test" => "chuj"
    ]);
});
Route::get("/", function($req) {
    if(Session::get("loggedIn")){
        echo "hello <br> <a href='/logout'>logout</a>";
    } else {
        echo "spierdalaj <br> <a href='/login'>login</a>";
    }
});
Route::get("/login", function($req) {
    return Functions::view("login", $req['params']);
});
Route::post("/login", function($req) {
    if(Session::get("loggedIn")){
        Functions::redirect("/");
    } else {
        if(isset($req['params']['login']) && isset($req['params']['password'])){
            $login = $req['params']['login'];
            $pass = $req['params']['password'];
            $checker = DB::query("SELECT * from `test` WHERE `login` = '$login' AND `password` = '$pass'");
            if(count($checker) > 0){
                Session::set("loggedIn", true);
                Functions::redirect("/");
            } else {
                Functions::redirect("/login?error=Zle%20haslo%20lub%20nazwa");
            }
        } else {
            Functions::redirect("/login");
        }
    }
});
Route::get("/logout", function($req) {
    Session::delete("loggedIn");
    Functions::redirect("/");
});