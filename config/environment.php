<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Environment Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains environment-specific configurations for different
    | deployment scenarios including local development and cross-device testing.
    |
    */

    'app' => [
        'name' => env('APP_NAME', 'Pageant Voting System'),
        'env' => env('APP_ENV', 'local'),
        'debug' => env('APP_DEBUG', true),
        'url' => env('APP_URL', 'http://localhost:8000'),
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'database' => [
        'connection' => env('DB_CONNECTION', 'mysql'),
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '3306'),
        'database' => env('DB_DATABASE', 'pageant_voting'),
        'username' => env('DB_USERNAME', 'root'),
        'password' => env('DB_PASSWORD', ''),
    ],

    'cors' => [
        'allowed_origins' => env('CORS_ALLOWED_ORIGINS', '*'),
        'allowed_methods' => env('CORS_ALLOWED_METHODS', '*'),
        'allowed_headers' => env('CORS_ALLOWED_HEADERS', '*'),
        'exposed_headers' => env('CORS_EXPOSED_HEADERS', ''),
        'max_age' => env('CORS_MAX_AGE', 0),
        'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', true),
    ],

    'sanctum' => [
        'stateful_domains' => env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:3000,127.0.0.1:5173,::1,*,*.*'),
        'expiration' => env('SANCTUM_EXPIRATION', null),
        'middleware' => [
            'verify_csrf_token' => env('SANCTUM_VERIFY_CSRF_TOKEN', false),
        ],
    ],

    'api' => [
        'prefix' => env('API_PREFIX', 'api'),
        'version' => env('API_VERSION', 'v1'),
        'rate_limit' => env('API_RATE_LIMIT', 60),
        'throttle' => env('API_THROTTLE', '60,1'),
    ],

    'security' => [
        'session_domain' => env('SESSION_DOMAIN', null),
        'session_secure' => env('SESSION_SECURE_COOKIES', false),
        'session_same_site' => env('SESSION_SAME_SITE', 'lax'),
    ],
];
