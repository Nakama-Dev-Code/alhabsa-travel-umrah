<?php

use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\WebOptionController;
use App\Http\Controllers\Admin\PaketUmrahController;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialController;

// Untuk Front End
Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/card', [FrontendController::class, 'card']);

// Untuk Admin
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('paket-umrah', [PaketUmrahController::class, 'paket_umrah'])->name('paket-umrah');
});

Route::middleware(['auth'])->group(function () {
    // Web Option
    Route::resource('web-option', WebOptionController::class);
    Route::get('web-option-export', [WebOptionController::class, 'export'])->name('web-option.export');
    Route::get('web-option-export-pdf', [WebOptionController::class, 'export_pdf'])->name('web-option.export-pdf');
    Route::post('web-option/bulk-delete', [WebOptionController::class, 'bulkDelete'])->name('web-option.bulk-delete');
});

Route::get('login/google', [SocialController::class, 'redirectToGoogle'])->name('login.google');
Route::get('login/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('login.google.callback');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
