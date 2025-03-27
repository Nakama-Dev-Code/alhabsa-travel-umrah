<?php

use Inertia\Inertia;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialController;

// Untuk Front End
Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/card', [FrontendController::class, 'card']);

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('login/google', [SocialController::class, 'redirectToGoogle'])->name('login.google');
Route::get('login/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('login.google.callback');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
