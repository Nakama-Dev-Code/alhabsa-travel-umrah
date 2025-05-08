<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = Hotel::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%")
                ->orWhere('rating', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $hotels = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/hotel/index', [
            'hotels' => $hotels->items(),
            'meta' => [
                'total' => $hotels->total(),
                'per_page' => $hotels->perPage(),
                'current_page' => $hotels->currentPage(),
                'last_page' => $hotels->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = Hotel::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%")
                ->orWhere('rating', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $hotels = $query->get();

        $pdf = PDF::loadView('exports.hotels', [
            'hotels' => $hotels,
            'search' => $search
        ]);

        return $pdf->download('hotels.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = Hotel::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%")
                ->orWhere('rating', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $hotels = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Hotel');
        $sheet->setCellValue('C1', 'Kota');
        $sheet->setCellValue('D1', 'Rating');
        $sheet->setCellValue('E1', 'Lokasi');
        $sheet->setCellValue('F1', 'Deskripsi');

        // Isi data
        $row = 2;
        foreach ($hotels as $index => $hotel) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $hotel->name);
            $sheet->setCellValue('C' . $row, $hotel->city);
            $sheet->setCellValue('D' . $row, $hotel->rating);
            $sheet->setCellValue('E' . $row, $hotel->location);
            $sheet->setCellValue('F' . $row, $hotel->description ?? 'Tidak ada deskripsi');
            $row++;
        }

        // Styling header
        $sheet->getStyle('A1:F1')->getFont()->setBold(true);
        $sheet->getStyle('A1:F1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');

        // Atur lebar kolom agar sesuai dengan konten
        foreach (range('A', 'F') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Buat file Excel
        $writer = new Xlsx($spreadsheet);
        $filename = 'hotel-data-' . date('YmdHis') . '.xlsx';
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
        $request->validate([
            'name' => 'required|string|max:255|unique:hotels,name',
            'rating' => 'required|numeric|min:0|max:5',
            'location' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama hotel harus diisi !',
            'name.max' => 'Nama hotel maksimal 255 karakter !',
            'name.unique' => 'Nama hotel sudah digunakan, gunakan nama lain !',
            'rating.required' => 'Rating hotel harus diisi !',
            'rating.max' => 'Rating hotel maksimal 5 !',
            'location.required' => 'Lokasi hotel harus diisi !',
            'location.max' => 'Lokasi hotel maksimal 255 karakter !',
        ]);

        $data = $request->only(['name', 'city', 'rating', 'location', 'latitude', 'longitude', 'description']);

        // Ekstrak city dari location
        $locationParts = explode(',', $request->location);
        $data['city'] = isset($locationParts[4]) ? trim($locationParts[4]) : null;

        Hotel::create($data);

        return redirect()->route('hotel.index')->with('success', 'Hotel berhasil ditambahkan !');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:hotels,name,' . $hotel->id,
            'rating' => 'required|numeric|min:0|max:5',
            'location' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama hotel harus diisi !',
            'name.max' => 'Nama hotel maksimal 255 karakter !',
            'name.unique' => 'Nama hotel sudah digunakan, gunakan nama lain !',
            'rating.required' => 'Rating hotel harus diisi !',
            'rating.max' => 'Rating hotel maksimal 5 !',
            'location.required' => 'Lokasi hotel harus diisi !',
            'location.max' => 'Lokasi hotel maksimal 255 karakter !',
        ]);

        $data = $request->only(['name', 'city', 'rating', 'location', 'latitude', 'longitude', 'description']);

        // Ekstrak city dari location
        $locationParts = explode(',', $request->location);
        $data['city'] = isset($locationParts[4]) ? trim($locationParts[4]) : null;

        $hotel->update($data);

        return redirect()->route('hotel.index')->with('success', 'Hotel berhasil diperbarui !');
    }

    public function destroy(Hotel $hotel)
    {
        // Hapus data dari database
        $hotel->delete();

        return redirect()->route('hotel.index')->with('success', 'Hotel berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:hotels,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $hotels = Hotel::find($id);

            if ($hotels) {
                // Hapus data dari database
                $hotels->delete();
                $count++;
            }
        }

        return redirect()->route('hotel.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
