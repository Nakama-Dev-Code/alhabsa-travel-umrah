<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\PackageSchedule;
use App\Models\Hotel;
use App\Models\Airport;
use App\Models\Airline;

class FrontendController extends Controller
{
    public function home()
    {
        // Mengambil semua data yang diperlukan untuk halaman paket umrah
        $packageSchedules = PackageSchedule::with(['package', 'package.category', 'package.category.type', 'hotelMakkah', 'hotelMadinah', 'airport', 'airline'])->get();

        $packages = Package::with(['category', 'category.type'])
            ->select('id', 'title', 'image', 'package_category_id')
            ->get();

        $hotels = Hotel::select('id', 'name')->get();
        $airports = Airport::select('id', 'name')->get();
        $airlines = Airline::select('id', 'name')->get();

        // Mengirim data ke view Inertia
        return Inertia::render('frontend/HomePages', [
            'packageSchedules' => $packageSchedules,
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'airlines' => $airlines
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
