<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SocialController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('login/google', [SocialController::class, 'redirectToGoogle']);
Route::get('login/google/callback', [SocialController::class, 'handleGoogleCallback']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
