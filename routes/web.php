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
    Route::get('package-category-export', [PackageCategoryController::class, 'export'])->name('package-category.export');
    Route::get('package-category-export-pdf', [PackageCategoryController::class, 'export_pdf'])->name('package-category.export-pdf');
    Route::post('package-category/bulk-delete', [PackageCategoryController::class, 'bulkDelete'])->name('package-category.bulk-delete');

    // Paket Umrah
    Route::resource('package', PackageController::class);
    Route::get('package-export', [PackageController::class, 'export'])->name('package.export');
    Route::get('package-export-pdf', [PackageController::class, 'export_pdf'])->name('package.export-pdf');
    Route::post('package/bulk-delete', [PackageController::class, 'bulkDelete'])->name('package.bulk-delete');

    // Jadwal Paket Umrah
    Route::resource('package-schedule', PackageScheduleController::class);
    Route::get('package-schedule-export', [PackageScheduleController::class, 'export'])->name('package-schedule.export');
    Route::get('package-schedule-export-pdf', [PackageScheduleController::class, 'export_pdf'])->name('package-schedule.export-pdf');
    Route::post('package-schedule/bulk-delete', [PackageScheduleController::class, 'bulkDelete'])->name('package-schedule.bulk-delete');

    // Airlines
    Route::resource('airline', AirlineController::class);
    Route::get('airline-export', [AirlineController::class, 'export'])->name('airline.export');
    Route::get('airline-export-pdf', [AirlineController::class, 'export_pdf'])->name('airline.export-pdf');
    Route::post('airline/bulk-delete', [AirlineController::class, 'bulkDelete'])->name('airline.bulk-delete');

    // Airport
    Route::resource('airport', AirportController::class);
    Route::get('airport-export', [AirportController::class, 'export'])->name('airport.export');
    Route::get('airport-export-pdf', [AirportController::class, 'export_pdf'])->name('airport.export-pdf');
    Route::post('airport/bulk-delete', [AirportController::class, 'bulkDelete'])->name('airport.bulk-delete');

    // Hotel
    Route::resource('hotel', HotelController::class);
    Route::get('hotel-export', [HotelController::class, 'export'])->name('hotel.export');
    Route::get('hotel-export-pdf', [HotelController::class, 'export_pdf'])->name('hotel.export-pdf');
    Route::post('hotel/bulk-delete', [HotelController::class, 'bulkDelete'])->name('hotel.bulk-delete');
});

Route::get('login/google', [SocialController::class, 'redirectToGoogle'])->name('login.google');
Route::get('login/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('login.google.callback');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
