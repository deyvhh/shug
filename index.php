<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
require "functions.php";
require "autoload.php";
require "routes/routing.php";
//dd($_SERVER);
