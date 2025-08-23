<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\ResultController;

// Auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);

// Candidates (admin only)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('candidates', [CandidateController::class, 'index']);
    Route::post('candidates', [CandidateController::class, 'store']);
    Route::get('candidates/{candidate}', [CandidateController::class, 'show']);
    Route::put('candidates/{candidate}', [CandidateController::class, 'update']); // Using POST with _method for Laravel
    Route::delete('candidates/{candidate}', [CandidateController::class, 'destroy']);
    Route::get('admin/votes', [VoteController::class, 'adminVotes']);
});

// Voting (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('votes', [VoteController::class, 'store']);
    Route::get('votes/history', [VoteController::class, 'history']);
    Route::post('votes/purchase', [VoteController::class, 'purchase']);
});

// Public endpoints
Route::get('candidates', [CandidateController::class, 'publicIndex']);
Route::get('results', [ResultController::class, 'index']);

Route::get('/', function () {
    return response()->json([
        'message' => 'Pageant Voting System API',
        'status' => 'running',
        'frontend_url' => 'http://localhost:3000',
        'api_base' => url('/api'),
        'endpoints' => [
            'register' => url('/api/register'),
            'login' => url('/api/login'),
            'candidates' => url('/api/candidates'),
            'results' => url('/api/results')
        ],
        'database' => config('database.default'),
        'environment' => app()->environment()
    ]);
});