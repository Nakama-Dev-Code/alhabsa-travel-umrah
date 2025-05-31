<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PackageSchedule;

class FrontendController extends Controller
{
    public function home()
    {
        // Mengambil data schedule dengan relasi lengkap
        $packageSchedules = PackageSchedule::with([
            'package',
            'package.category',
            'package.category.type',
            'hotelMakkah',
            'hotelMadinah',
            'airport',
            'airline'
        ])
            ->where('seat_available', '>', 0) // Filter hanya yang masih ada seat
            ->get();

        // OPSI 1: Menggunakan array tanpa ID (yang paling simple)
        $umrahPackages = $packageSchedules->map(function ($schedule) {
            // Format harga
            $formattedPrice = 'IDR ' . number_format($schedule->price, 0, ',', '.');

            // Format tanggal
            $formattedDate = \Carbon\Carbon::parse($schedule->departure_date)
                ->locale('id')
                ->translatedFormat('d F Y');

            return [
                $schedule->package->title ?? 'PAKET UMRAH',                      // 0
                $schedule->package->category->name ?? 'Paket Umrah Reguler',     // 1
                $schedule->airline->name ?? 'Airline',                           // 2
                $schedule->airport->name ?? 'Airport',                           // 3
                $schedule->airport->code ?? 'Airport Code',                      // 4
                $formattedPrice,                                                 // 5
                $schedule->hotelMakkah->name ?? 'Hotel Makkah',                 // 6
                $schedule->hotelMadinah->name ?? 'Hotel Madinah',               // 7
                $schedule->package->category->type->name ?? 'Umrah Reguler',     // 8
                $formattedDate,                                                  // 9
                $schedule->seat_available . ' Seat Tersedia',                    // 10
                $schedule->package->image ?? '/img/no-image.jpg',                // 11
                $schedule->price                                                 // 12
            ];
        })->values();

        // Mengirim data ke frontend
        return Inertia::render('frontend/HomePages', [
            'umrahPackages' => $umrahPackages
        ]);
    }

    public function contact()
    {
        return Inertia::render('frontend/ContactPages');
    }

    public function umrahpackages()
    {
        $packageSchedules = PackageSchedule::with([
            'package',
            'package.category',
            'package.category.type',
            'hotelMakkah',
            'hotelMadinah',
            'airport',
            'airline'
        ])
            ->where('seat_available', '>', 0)
            ->get();

        $umrahPackages = $packageSchedules->map(function ($schedule) {
            $formattedPrice = 'IDR ' . number_format($schedule->price, 0, ',', '.');
            $formattedDate = \Carbon\Carbon::parse($schedule->departure_date)
                ->locale('id')
                ->translatedFormat('d F Y');

            return [
                $schedule->package->title ?? 'PAKET UMRAH',                     // 0
                $schedule->package->category->name ?? 'Paket Umrah Reguler',    // 1
                $schedule->airline->name ?? 'Airline',                          // 2
                $schedule->airport->name ?? 'Airport',                          // 3
                $schedule->airport->code ?? 'Airport Code',                     // 4
                $formattedPrice,                                               // 5
                $schedule->hotelMakkah->name ?? 'Hotel Makkah',                // 6
                $schedule->hotelMadinah->name ?? 'Hotel Madinah',              // 7
                $schedule->package->category->type->name ?? 'Umrah Reguler',    // 8
                $formattedDate,                                               // 9
                $schedule->seat_available . ' Seat Tersedia',                  // 10
                $schedule->package->image ?? '/img/no-image.jpg',              // 11
                $schedule->price,                                             // 12

                // Hotel Makkah data (index 13-19)
                $schedule->hotelMakkah->city ?? 'Makkah',                     // 13
                $schedule->hotelMakkah->rating ?? '5',                        // 14
                $schedule->hotelMakkah->location ?? 'Makkah, Saudi Arabia',   // 15
                $schedule->hotelMakkah->latitude ?? '',                       // 16
                $schedule->hotelMakkah->longitude ?? '',                      // 17
                $schedule->hotelMakkah->description ?? '',                    // 18

                // Hotel Madinah data (index 19-24)
                $schedule->hotelMadinah->city ?? 'Madinah',                   // 19
                $schedule->hotelMadinah->rating ?? '5',                       // 20
                $schedule->hotelMadinah->location ?? 'Madinah, Saudi Arabia', // 21
                $schedule->hotelMadinah->latitude ?? '',                      // 22
                $schedule->hotelMadinah->longitude ?? '',                     // 23
                $schedule->hotelMadinah->description ?? '',                   // 24

                // Airport data (index 25-28)
                $schedule->airport->location ?? '',                           // 25
                $schedule->airport->latitude ?? '',                           // 26
                $schedule->airport->longitude ?? '',                          // 27
                $schedule->airport->description ?? '',                        // 28

                // Airline data (index 29)
                $schedule->airline->link_website ?? '',                       // 29
            ];
        })->values();

        return Inertia::render('frontend/CardPages', [
            'umrahPackages' => $umrahPackages
        ]);
    }

    public function simulator()
    {
        $packageSchedules = PackageSchedule::with([
            'package',
            'package.category',
            'package.category.type',
            'hotelMakkah',
            'hotelMadinah',
            'airport',
            'airline'
        ])
            ->where('seat_available', '>', 0)
            ->get();

        $umrahPackages = $packageSchedules->map(function ($schedule) {
            $formattedPrice = 'IDR ' . number_format($schedule->price, 0, ',', '.');
            $formattedDate = \Carbon\Carbon::parse($schedule->departure_date)
                ->locale('id')
                ->translatedFormat('d F Y');

            return [
                $schedule->package->title ?? 'PAKET UMRAH',                     // 0
                $schedule->package->category->name ?? 'Paket Umrah Reguler',    // 1
                $schedule->airline->name ?? 'Airline',                          // 2
                $schedule->airport->name ?? 'Airport',                          // 3
                $schedule->airport->code ?? 'Airport Code',                     // 4
                $formattedPrice,                                               // 5
                $schedule->hotelMakkah->name ?? 'Hotel Makkah',                // 6
                $schedule->hotelMadinah->name ?? 'Hotel Madinah',              // 7
                $schedule->package->category->type->name ?? 'Umrah Reguler',    // 8
                $formattedDate,                                               // 9
                $schedule->seat_available . ' Seat Tersedia',                  // 10
                $schedule->package->image ?? '/img/no-image.jpg',              // 11
                $schedule->price,                                             // 12
                // Hotel Makkah data (index 13-19)
                $schedule->hotelMakkah->city ?? 'Makkah',                     // 13
                $schedule->hotelMakkah->rating ?? '4',                        // 14
                $schedule->hotelMakkah->location ?? 'Makkah, Saudi Arabia',   // 15
                $schedule->hotelMakkah->latitude ?? '',                       // 16
                $schedule->hotelMakkah->longitude ?? '',                      // 17
                $schedule->hotelMakkah->description ?? 'Hotel di Makkah',     // 18
                // Hotel Madinah data (index 19-24)
                $schedule->hotelMadinah->city ?? 'Madinah',                   // 19
                $schedule->hotelMadinah->rating ?? '4',                       // 20
                $schedule->hotelMadinah->location ?? 'Madinah, Saudi Arabia', // 21
                $schedule->hotelMadinah->latitude ?? '',                      // 22
                $schedule->hotelMadinah->longitude ?? '',                     // 23
                $schedule->hotelMadinah->description ?? 'Hotel di Madinah',   // 24
                // Airport data (index 25-28)
                $schedule->airport->location ?? '',                           // 25
                $schedule->airport->latitude ?? '',                           // 26
                $schedule->airport->longitude ?? '',                          // 27
                $schedule->airport->description ?? '',                        // 28
                // Airline data (index 29)
                $schedule->airline->link_website ?? '',                       // 29
            ];
        })->values();

        return Inertia::render('frontend/TabunganUmrahPage', [
            'umrahPackages' => $umrahPackages
        ]);
    }

    public function cookie(Request $request)
    {
        $consent = $request->input('consent') ? 'accepted' : 'rejected';

        return response()->json(['message' => 'Consent saved.'])
            ->cookie('cookie_consent', $consent, 60 * 24 * 30); // 30 hari
    }

    public function cookiePolicy()
    {
        return Inertia::render('policy/cookie-policy');
    }

    public function privacyPolicy()
    {
        return Inertia::render('policy/privacy-policy');
    }
}
