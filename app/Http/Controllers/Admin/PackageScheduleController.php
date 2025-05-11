<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PackageSchedule;
use App\Models\Package;
use App\Models\Hotel;
use App\Models\Airport;
use App\Models\Airline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


class PackageScheduleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = PackageSchedule::with(['package.category.type', 'hotelMakkah', 'hotelMadinah', 'airport', 'airline']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('departure_date', 'like', "%{$search}%")
                    ->orWhere('price', 'like', "%{$search}%")
                    ->orWhere('seat_available', 'like', "%{$search}%")
                    ->orWhereHas('package', function ($q2) use ($search) {
                        $q2->where('title', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    })
                    ->orWhereHas('hotelMakkah', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('hotelMadinah', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('airport', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('airline', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $packageSchedules = $query->paginate($perPage)
            ->withQueryString();

        // Get all package types for the dropdown
        $packages = Package::all();
        $hotels = Hotel::all();
        $airports = Airport::all();
        $airlines = Airline::all();

        return Inertia::render('admin/package-schedule/index', [
            'packageSchedules' => $packageSchedules->items(),
            'packages' => $packages,
            'hotels' => $hotels,
            'airports' => $airports,
            'airlines' => $airlines,
            'meta' => [
                'total' => $packageSchedules->total(),
                'per_page' => $packageSchedules->perPage(),
                'current_page' => $packageSchedules->currentPage(),
                'last_page' => $packageSchedules->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'hotel_madinah_id' => 'required|exists:hotels,id',
            'hotel_makkah_id' => 'required|exists:hotels,id',
            'airport_id' => 'required|exists:airports,id',
            'airline_id' => 'required|exists:airlines,id',
            'departure_date' => 'required|date',
            'price' => 'required',
            'seat_available' => 'required|numeric',
        ], [
            'package_id.exists' => 'Paket tidak ditemukan !',
            'hotel_madinah_id.exists' => 'Hotel Madinah tidak ditemukan !',
            'hotel_makkah_id.exists' => 'Hotel Makkah tidak ditemukan !',
            'airport_id.exists' => 'Bandara tidak ditemukan !',
            'airline_id.exists' => 'Maskapai tidak ditemukan !',
            'departure_date.required' => 'Tanggal keberangkatan umrah harus diisi !',
            'departure_date.date' => 'Tanggal keberangkatan harus berupa tanggal !',
            'price.required' => 'Harga harus diisi !',
            'seat_available.numeric' => 'Kursi harus berupa angka !',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = [
            'package_id' => $request->package_id,
            'hotel_madinah_id' => $request->hotel_madinah_id,
            'hotel_makkah_id' => $request->hotel_makkah_id,
            'airport_id' => $request->airport_id,
            'airline_id' => $request->airline_id,
            'departure_date' => $request->departure_date,
            'price' => $request->price,
            'seat_available' => $request->seat_available,
        ];

        PackageSchedule::create($data);
        return redirect()->route('package-schedule.index')->with('success', 'Jadwal umrah berhasil ditambahkan !');
    }

    public function update(Request $request, PackageSchedule $packageSchedule)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'hotel_madinah_id' => 'required|exists:hotels,id',
            'hotel_makkah_id' => 'required|exists:hotels,id',
            'airport_id' => 'required|exists:airports,id',
            'airline_id' => 'required|exists:airlines,id',
            'departure_date' => 'required|date',
            'price' => 'required',
            'seat_available' => 'required|numeric',
        ], [
            'package_id.exists' => 'Paket tidak ditemukan !',
            'hotel_madinah_id.exists' => 'Hotel Madinah tidak ditemukan !',
            'hotel_makkah_id.exists' => 'Hotel Makkah tidak ditemukan !',
            'airport_id.exists' => 'Bandara tidak ditemukan !',
            'airline_id.exists' => 'Maskapai tidak ditemukan !',
            'departure_date.required' => 'Tanggal keberangkatan umrah harus diisi !',
            'departure_date.date' => 'Tanggal keberangkatan harus berupa tanggal !',
            'price.required' => 'Harga harus diisi !',
            'seat_available.numeric' => 'Kursi harus berupa angka !',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = [
            'package_id' => $request->package_id,
            'hotel_madinah_id' => $request->hotel_madinah_id,
            'hotel_makkah_id' => $request->hotel_makkah_id,
            'airport_id' => $request->airport_id,
            'airline_id' => $request->airline_id,
            'departure_date' => $request->departure_date,
            'price' => $request->price,
            'seat_available' => $request->seat_available,
        ];

        $packageSchedule->update($data);

        return redirect()->route('package-schedule.index')->with('success', 'Jadwal umrah berhasil diperbarui !')->with('updatedData', $data);;
    }

    public function destroy(PackageSchedule $packageSchedule)
    {
        $packageSchedule->delete();

        return redirect()->route('package-schedule.index')->with('success', 'Jadwal umrah berhasil dihapus !');
    }
}
