<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: __DIR__)
    ->withRouting(
        web: __DIR__.'/routes/web.php',
        api: __DIR__.'/routes/api.php',
        commands: __DIR__.'/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

$app->make('db')->connection()->getPdo();

echo "Testing database connection...\n";

try {
    $pdo = $app->make('db')->connection()->getPdo();
    echo "Database connected successfully!\n";
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT id, email, role FROM users WHERE role = 'admin'");
    $stmt->execute();
    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($adminUser) {
        echo "Admin user found:\n";
        echo "ID: " . $adminUser['id'] . "\n";
        echo "Email: " . $adminUser['email'] . "\n";
        echo "Role: " . $adminUser['role'] . "\n";
    } else {
        echo "No admin user found!\n";
        
        // Check all users
        $stmt = $pdo->prepare("SELECT id, email, role FROM users");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "All users:\n";
        foreach ($users as $user) {
            echo "ID: " . $user['id'] . ", Email: " . $user['email'] . ", Role: " . $user['role'] . "\n";
        }
    }
    
    // Check candidates table
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM candidates");
    $stmt->execute();
    $candidateCount = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Candidates count: " . $candidateCount['count'] . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
