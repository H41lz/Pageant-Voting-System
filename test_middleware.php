<?php

require_once 'vendor/autoload.php';

echo "Testing AdminMiddleware class loading...\n";

try {
    $middleware = new \App\Http\Middleware\AdminMiddleware();
    echo "✅ AdminMiddleware class loaded successfully!\n";
    
    // Test if it's callable
    if (is_callable([$middleware, 'handle'])) {
        echo "✅ AdminMiddleware handle method is callable!\n";
    } else {
        echo "❌ AdminMiddleware handle method is NOT callable!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error loading AdminMiddleware: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}

echo "\nChecking if file exists:\n";
$filePath = __DIR__ . '/app/Http/Middleware/AdminMiddleware.php';
if (file_exists($filePath)) {
    echo "✅ File exists: $filePath\n";
    echo "File size: " . filesize($filePath) . " bytes\n";
} else {
    echo "❌ File does not exist: $filePath\n";
}

echo "\nChecking autoloader:\n";
$autoloader = require_once 'vendor/autoload.php';
if ($autoloader) {
    echo "✅ Autoloader loaded successfully\n";
} else {
    echo "❌ Autoloader failed to load\n";
}
