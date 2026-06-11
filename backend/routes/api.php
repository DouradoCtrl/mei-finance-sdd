<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rotas de Extratos
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions/parse', [TransactionController::class, 'parse']);
    Route::post('/transactions/confirm', [TransactionController::class, 'confirm']);
});
