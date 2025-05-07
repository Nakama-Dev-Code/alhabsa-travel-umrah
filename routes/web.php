<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\WebOptionController;
use App\Http\Controllers\Admin\PackageTypeController;
use App\Http\Controllers\Admin\PackageCategoryController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PackageScheduleController;
use App\Http\Controllers\Admin\AirlineController;
use App\Http\Controllers\Admin\AirportController;
use App\Http\Controllers\Admin\HotelController;

// Untuk Front End
Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/umrah-packages', [FrontendController::class, 'umrahpackages']);

// Untuk Admin
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    // Web Option
    Route::resource('web-option', WebOptionController::class);
    Route::get('web-option-export', [WebOptionController::class, 'export'])->name('web-option.export');
    Route::get('web-option-export-pdf', [WebOptionController::class, 'export_pdf'])->name('web-option.export-pdf');
    Route::post('web-option/bulk-delete', [WebOptionController::class, 'bulkDelete'])->name('web-option.bulk-delete');

    // Tipe Paket
    Route::resource('package-type', PackageTypeController::class);
    Route::get('package-type-export', [PackageTypeController::class, 'export'])->name('package-type.export');
    Route::get('package-type-export-pdf', [PackageTypeController::class, 'export_pdf'])->name('package-type.export-pdf');
    Route::post('package-type/bulk-delete', [PackageTypeController::class, 'bulkDelete'])->name('package-type.bulk-delete');

    // Kategori Paket
    Route::resource('package-category', PackageCategoryController::class);

    // Paket Umrah
    Route::resource('package', PackageController::class);

    // Jadwal Paket Umrah
    Route::resource('package-schedule', PackageScheduleController::class);

    // Airlines
    Route::resource('airlines', AirlineController::class);

    // Airport
    Route::resource('airports', AirportController::class);

    // Hotel
    Route::resource('hotels', HotelController::class);
});

Route::get('login/google', [SocialController::class, 'redirectToGoogle'])->name('login.google');
Route::get('login/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('login.google.callback');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
