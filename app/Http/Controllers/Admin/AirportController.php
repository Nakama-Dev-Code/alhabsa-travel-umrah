<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class AirportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = Airport::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('link_website', 'like', "%{$search}%");
        }

        $airports = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/airport/index', [
            'airports' => $airports->items(),
            'meta' => [
                'total' => $airports->total(),
                'per_page' => $airports->perPage(),
                'current_page' => $airports->currentPage(),
                'last_page' => $airports->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = Airport::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('link_website', 'like', "%{$search}%");
        }

        $airports = $query->get();

        $pdf = PDF::loadView('exports.airports', [
            'airports' => $airports,
            'search' => $search
        ]);

        return $pdf->download('airports.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = Airport::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('link_website', 'like', "%{$search}%");
        }

        $airports = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Bandara');
        $sheet->setCellValue('C1', 'Kode Bandara');
        $sheet->setCellValue('D1', 'Lokasi');
        $sheet->setCellValue('E1', 'Deskripsi');
        $sheet->setCellValue('F1', 'Link Website');

        // Isi data
        $row = 2;
        foreach ($airports as $index => $airport) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $airport->name);
            $sheet->setCellValue('C' . $row, $airport->code);
            $sheet->setCellValue('D' . $row, $airport->location);
            $sheet->setCellValue('E' . $row, $airport->description ?? 'Tidak ada deskripsi');
            $sheet->setCellValue('F' . $row, $airport->link_website ?? 'Tidak ada alamat link website');
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
        $filename = 'airport-data-' . date('YmdHis') . '.xlsx';
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
            'name' => 'required|string|max:255|unique:airports,name',
            'code' => 'required|string|max:4|',
            'location' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama airport harus diisi !',
            'name.max' => 'Nama airport maksimal 255 karakter !',
            'name.unique' => 'Nama airport sudah digunakan, gunakan nama lain !',
            'code.required' => 'Kode airport harus diisi !',
            'code.max' => 'Kode maksimal 4 karakter !',
            'location.required' => 'Lokasi airport harus diisi !',
            'location.max' => 'Lokasi airport maksimal 255 karakter !',
        ]);

        $data = [
            'name' => $request->name,
            'code' => $request->code,
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'description' => $request->description,
            'link_website' => $request->link_website
        ];

        Airport::create($data);

        return redirect()->route('airport.index')->with('success', 'Airport berhasil ditambahkan !');
    }

    public function update(Request $request, Airport $airport)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:airports,name,' . $airport->id,
            'code' => 'required|string|max:4',
            'location' => 'required|string|max:255',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
        ], [
            'name.required' => 'Nama airport harus diisi !',
            'name.max' => 'Nama airport maksimal 255 karakter !',
            'name.unique' => 'Nama airport sudah digunakan, gunakan nama lain !',
            'code.required' => 'Kode airport harus diisi !',
            'code.max' => 'Kode maksimal 4 karakter !',
            'location.required' => 'Lokasi airport harus diisi !',
            'location.max' => 'Lokasi airport maksimal 255 karakter !',
        ]);

        $data = [
            'name' => $request->name,
            'code' => $request->code,
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'description' => $request->description,
            'link_website' => $request->link_website
        ];

        $airport->update($data);

        return redirect()->route('airport.index')->with('success', 'Airport berhasil diperbarui !');
    }

    public function destroy(Airport $airport)
    {
        // Hapus data dari database
        $airport->delete();

        return redirect()->route('airport.index')->with('success', 'Airport berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:airports,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $airports = Airport::find($id);

            if ($airports) {
                // Hapus data dari database
                $airports->delete();
                $count++;
            }
        }

        return redirect()->route('airport.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
