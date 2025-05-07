<?php

namespace App\Http\Controllers;

use App\Models\PackageSchedule;
use App\Models\Package;
use App\Models\Hotel;
use App\Models\Airport;
use App\Models\Airline;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageScheduleController extends Controller
{
    public function index()
    {
        $schedules = PackageSchedule::with([
            'package.category.type',
            'hotelMadinah',
            'hotelMakkah',
            'airport',
            'airline'
        ])->get();

        $packages = Package::with('category')->get();
        $hotels = Hotel::all();
        $airports = Airport::all();
        $airlines = Airline::all();

        return Inertia::render('PackageSchedules/Index', compact('schedules', 'packages', 'hotels', 'airports', 'airlines'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'hotel_madinah_id' => 'required|exists:hotels,id',
            'hotel_makkah_id' => 'required|exists:hotels,id',
            'airport_id' => 'required|exists:airports,id',
            'airline_id' => 'required|exists:airlines,id',
            'departure_date' => 'required|date',
            'price' => 'required|numeric',
            'seat_available' => 'required|integer',
        ]);

        PackageSchedule::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, PackageSchedule $schedule)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'hotel_madinah_id' => 'required|exists:hotels,id',
            'hotel_makkah_id' => 'required|exists:hotels,id',
            'airport_id' => 'required|exists:airports,id',
            'airline_id' => 'required|exists:airlines,id',
            'departure_date' => 'required|date',
            'price' => 'required|numeric',
            'seat_available' => 'required|integer',
        ]);

        $schedule->update($request->all());
        return redirect()->back();
    }

    public function destroy(PackageSchedule $schedule)
    {
        $schedule->delete();
        return redirect()->back();
    }
}
