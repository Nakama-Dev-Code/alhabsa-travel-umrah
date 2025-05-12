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
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;


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

    public function export_pdf(Request $request)
    {
        $search = $request->search;
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

        $packageSchedule = $query->get();

        $pdf = PDF::loadView('exports.package-schedules', [
            'packageSchedule' => $packageSchedule,
            'search' => $search
        ]);

        return $pdf->download('package-schedules.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

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

        $packageSchedule = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Paket');
        $sheet->setCellValue('C1', 'Hotel Makkah');
        $sheet->setCellValue('D1', 'Hotel Madinah');
        $sheet->setCellValue('E1', 'Airport');
        $sheet->setCellValue('F1', 'Airline');
        $sheet->setCellValue('G1', 'Tanggal Keberangkatan');
        $sheet->setCellValue('H1', 'Harga');
        $sheet->setCellValue('I1', 'Sisa Seat');

        // Isi data
        $row = 2;
        foreach ($packageSchedule as $index => $packageSchedules) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $packageSchedules->package->title ?? 'Tidak ada paket');
            $sheet->setCellValue('C' . $row, $packageSchedules->hotelMakkah->name ?? 'Tidak ada hotel');
            $sheet->setCellValue('D' . $row, $packageSchedules->hotelMadinah->name ?? 'Tidak ada hotel');
            $sheet->setCellValue('E' . $row, $packageSchedules->airport->name ?? 'Tidak ada bandar udara');
            $sheet->setCellValue('F' . $row, $packageSchedules->airline->name ?? 'Tidak ada maskapai');
            $sheet->setCellValue('G' . $row, $packageSchedules->departure_date);
            $sheet->setCellValue('H' . $row, $packageSchedules->price);
            $sheet->setCellValue('I' . $row, $packageSchedules->seat_available);
            $row++;
        }

        // Styling header
        $sheet->getStyle('A1:I1')->getFont()->setBold(true);
        $sheet->getStyle('A1:I1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');

        // Atur lebar kolom agar sesuai dengan konten
        foreach (range('A', 'I') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Buat file Excel
        $writer = new Xlsx($spreadsheet);
        $filename = 'package-schedule-data-' . date('YmdHis') . '.xlsx';
        $path = storage_path('app/public/exports/' . $filename);

        // Pastikan direktori ada
        if (!file_exists(storage_path('app/public/exports'))) {
            mkdir(storage_path('app/public/exports'), 0755, true);
        }

        $writer->save($path);

        return response()->download($path, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
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

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:package_schedules,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $packageSchedule = PackageSchedule::find($id);

            if ($packageSchedule) {
                // Hapus data dari database
                $packageSchedule->delete();
                $count++;
            }
        }

        return redirect()->route('package-schedule.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
