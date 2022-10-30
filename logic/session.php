<?php

namespace Session;
session_start();
class Session{
    static function get($key){
        return $_SESSION[$key] ?? null;
    }
    static function set($key, $value): void {
        $_SESSION[$key] = $value;
    }
    static function delete($key): void {
        unset($_SESSION[$key]);
    }
}


