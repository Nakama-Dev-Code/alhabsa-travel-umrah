<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Airline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class AirlineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = Airline::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $airlines = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/airline/index', [
            'airlines' => $airlines->items(),
            'meta' => [
                'total' => $airlines->total(),
                'per_page' => $airlines->perPage(),
                'current_page' => $airlines->currentPage(),
                'last_page' => $airlines->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = Airline::query();

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('link_website', 'LIKE', "%{$search}%");
        }

        $airlines = $query->get();

        $pdf = PDF::loadView('exports.airlines', [
            'airlines' => $airlines,
            'search' => $search
        ]);

        return $pdf->download('airlines.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = Airline::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('link_website', 'like', "%{$search}%");
        }

        $airlines = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Maskapai');
        $sheet->setCellValue('C1', 'Link Website Maskapai');

        // Isi data
        $row = 2;
        foreach ($airlines as $index => $airline) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $airline->name);
            $sheet->setCellValue('C' . $row, $airline->link_website ?? 'Tidak ada alamat link website');
            $row++;
        }

        // Styling header
        $sheet->getStyle('A1:C1')->getFont()->setBold(true);
        $sheet->getStyle('A1:C1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');

        // Atur lebar kolom agar sesuai dengan konten
        foreach (range('A', 'C') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Buat file Excel
        $writer = new Xlsx($spreadsheet);
        $filename = 'airline-data-' . date('YmdHis') . '.xlsx';
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
            'name' => 'required|string|max:255|unique:airlines,name',
        ], [
            'name.required' => 'Nama maskapai harus diisi !',
            'name.max' => 'Nama maskapai maksimal 255 karakter !',
            'name.unique' => 'Nama maskapai sudah digunakan, gunakan nama lain !',
        ]);

        $data = [
            'name' => $request->name,
            'link_website' => $request->link_website
        ];

        Airline::create($data);

        return redirect()->route('airline.index')->with('success', 'Maskapai berhasil ditambahkan !');
    }

    public function update(Request $request, Airline $airline)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:airlines,name,' . $airline->id,
        ], [
            'name.required' => 'Nama maskapai harus diisi !',
            'name.max' => 'Nama maskapai maksimal 255 karakter !',
            'name.unique' => 'Nama maskapai sudah digunakan, gunakan nama lain !',
        ]);

        $data = [
            'name' => $request->name,
            'link_website' => $request->link_website
        ];

        $airline->update($data);

        return redirect()->route('airline.index')->with('success', 'Maskapai berhasil diubah !');
    }

    public function destroy(Airline $airline)
    {
        // Hapus data dari database
        $airline->delete();

        return redirect()->route('airline.index')->with('success', 'Maskapai berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:airlines,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $airlines = Airline::find($id);

            if ($airlines) {
                // Hapus data dari database
                $airlines->delete();
                $count++;
            }
        }

        return redirect()->route('airline.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
