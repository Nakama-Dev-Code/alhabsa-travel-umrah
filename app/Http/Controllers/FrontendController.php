<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Package;
use App\Models\PackageSchedule;
use App\Models\Hotel;
use App\Models\Airport;
use App\Models\Airline;

class FrontendController extends Controller
{
    public function home()
    {
        return Inertia::render('frontend/HomePages');
    }

    public function umrahpackages()
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
        return Inertia::render('frontend/CardPages', [
            'packageSchedules' => $packageSchedules,
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'airlines' => $airlines
        ]);
    }
}
