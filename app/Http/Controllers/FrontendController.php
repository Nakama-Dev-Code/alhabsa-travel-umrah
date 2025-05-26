<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PackageSchedule;
use App\Models\Package;
use App\Models\Hotel;
use App\Models\Airport;
use App\Models\Airline;

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

            // Return array tanpa ID - mulai dari index 0
            // Urutan: [0]namaPaket, [1]paket, [2]airline, [3]airport, [4]codeAirport,
            //         [5]price, [6]hotelMakkah, [7]hotelMadinah, [8]tipePaket, [9]tanggal,
            //         [10]sisaSeat, [11]image, [12]originalPrice
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

    public function umrahpackages()
    {
        // Mengambil semua data yang diperlukan untuk halaman paket umrah
        $packageSchedules = PackageSchedule::with(['package', 'package.category', 'package.category.type', 'hotelMakkah', 'hotelMadinah', 'airport', 'airline'])->get();

        $packages = Package::with(['category', 'category.type'])
            ->select('id', 'title', 'image', 'package_category_id')
            ->get();

        $hotels = Hotel::all();
        $airports = Airport::all();
        $airlines = Airline::all();

        // Mengirim data ke view Inertia
        return Inertia::render('frontend/CardPages', [
            'packageSchedules' => $packageSchedules,
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'airlines' => $airlines
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
