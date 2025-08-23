<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\ResultController;

// Public endpoints
Route::get('candidates', [CandidateController::class, 'publicIndex']);
Route::get('results', [ResultController::class, 'index']);

// Auth routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Voting endpoints
    Route::post('votes', [VoteController::class, 'store']);
    Route::get('votes/history', [VoteController::class, 'history']);
    Route::post('votes/purchase', [VoteController::class, 'purchase']);
});

// Admin only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Candidate management
    Route::post('candidates', [CandidateController::class, 'store']);
    Route::get('candidates/{candidate}', [CandidateController::class, 'show']);
    Route::post('candidates/{candidate}', [CandidateController::class, 'update']); // Using POST with _method for file uploads
    Route::delete('candidates/{candidate}', [CandidateController::class, 'destroy']);
    
    // Admin voting overview
    Route::get('admin/votes', [VoteController::class, 'adminVotes']);
});

// API Info endpoint
Route::get('/', function () {
    return response()->json([
        'message' => 'Pageant Voting System API',
        'status' => 'running',
        'version' => '1.0.0',
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
        'api_base' => url('/api'),
        'endpoints' => [
            'public' => [
                'candidates' => url('/api/candidates'),
                'results' => url('/api/results'),
            ],
            'auth' => [
                'register' => url('/api/register'),
                'login' => url('/api/login'),
                'logout' => url('/api/logout'),
            ],
            'voting' => [
                'cast_vote' => url('/api/votes'),
                'vote_history' => url('/api/votes/history'),
                'purchase_votes' => url('/api/votes/purchase'),
            ],
            'admin' => [
                'manage_candidates' => url('/api/candidates'),
                'admin_votes' => url('/api/admin/votes'),
            ]
        ],
        'database' => config('database.default'),
        'environment' => app()->environment()
    ]);
});