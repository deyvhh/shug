<?php
class Autoloader {

    protected const PATTERNS = [
        '/*Interface.php',
        '/*.php'
    ];

    public static function loadFiles(string $path): void {
        foreach (self::PATTERNS as $pattern) {
            foreach (glob($path . $pattern, GLOB_BRACE) as $filename) {
                require_once $filename;
            }
        }
    }
}

foreach (['logic'] as $folder) {
    Autoloader::loadFiles(__DIR__ . '/' . $folder);
}