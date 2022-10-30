<?php

namespace Route;
class Route{
    private static function route($route, $callback): void
    {
        if (!is_callable($callback)) {
            echo "Callback not found";
            exit();
        }
        $uri = parse_url($_SERVER['REQUEST_URI']);
        $uriExploded = explode("/", $uri['path']);
        $routeExploded = explode("/", $route);
        if(count($uriExploded) != count($routeExploded)) return;
        if(count($uriExploded) != 1){
            for($i = 1; $i < count($uriExploded); $i++){
                if(str_starts_with($routeExploded[$i], "{")){
                    $uriParams[str_replace("{", "", str_replace("}", "", $routeExploded[$i]))] = $uriExploded[$i];
                } else {
                    if($uriExploded[$i] != $routeExploded[$i]) return;
                }
            }
        }
        if(array_key_exists("query", $uri)){
            parse_str($uri["query"], $params);
        }
        $parameters = [
            "params" => [...($params ?? []), ...($_POST ?? [])],
            "uriParams" => $uriParams ?? []
        ];
        $callback($parameters);
        exit();
    }
    static function get($route, $callback): void
    {
        if( $_SERVER['REQUEST_METHOD'] == 'GET' ){ self::route($route, $callback); }
    }
    static function post($route, $callback): void
    {
        if( $_SERVER['REQUEST_METHOD'] == 'POST' ){ self::route($route, $callback); }
    }
}