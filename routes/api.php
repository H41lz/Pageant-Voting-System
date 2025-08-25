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

// Test route for debugging
Route::middleware('auth:sanctum')->get('test-auth', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'authenticated' => $request->user() !== null,
        'role' => $request->user()->role ?? 'none'
    ]);
});

// Candidates (admin) - simplified middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('candidates', CandidateController::class)->except(['show']);
    Route::post('candidates/{candidate}/image', [CandidateController::class, 'updateImage']);
    Route::get('admin/votes', [VoteController::class, 'adminVotes']);
});

// Voting (user)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('votes/can-vote', [VoteController::class, 'canVote']);
    Route::post('votes', [VoteController::class, 'store']);
    Route::get('votes/history', [VoteController::class, 'history']);
    Route::post('votes/purchase', [VoteController::class, 'purchase']);
});

// Public endpoints
Route::get('candidates', [CandidateController::class, 'publicIndex']);
Route::get('results', [ResultController::class, 'index']);
Route::get('candidates/{candidate}/votes', [ResultController::class, 'getCandidateVotes']);

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