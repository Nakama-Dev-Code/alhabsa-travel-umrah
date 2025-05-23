<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PackageType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class PackageTypeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = PackageType::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $packageTypes = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/package-type/index', [
            'packageTypes' => $packageTypes->items(),
            'meta' => [
                'total' => $packageTypes->total(),
                'per_page' => $packageTypes->perPage(),
                'current_page' => $packageTypes->currentPage(),
                'last_page' => $packageTypes->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = PackageType::query();

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%");
        }

        $packageTypes = $query->get();

        $pdf = PDF::loadView('exports.package-types', [
            'packageTypes' => $packageTypes,
            'search' => $search
        ]);

        return $pdf->download('package-types.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = PackageType::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $packageTypes = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Paket');
        $sheet->setCellValue('C1', 'Deksripsi');

        // Isi data
        $row = 2;
        foreach ($packageTypes as $index => $packageType) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $packageType->name);
            $sheet->setCellValue('C' . $row, $packageType->description ?? 'Tidak ada deskripsi');
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
        $filename = 'package-type-data-' . date('YmdHis') . '.xlsx';
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
            'name' => 'required|string|max:255|unique:package_types,name',
        ], [
            'name.required' => 'Nama paket harus diisi !',
            'name.max' => 'Nama paket maksimal 255 karakter !',
            'name.unique' => 'Nama paket sudah digunakan, gunakan nama lain !',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];

        PackageType::create($data);

        return redirect()->route('package-type.index')->with('success', 'Tipe paket berhasil ditambahkan !');
    }

    public function update(Request $request, PackageType $packageType)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:package_types,name,' . $packageType->id,
        ], [
            'name.required' => 'Nama paket harus diisi !',
            'name.max' => 'Nama paket maksimal 255 karakter !',
            'name.unique' => 'Nama paket sudah digunakan, gunakan nama lain !',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description
        ];

        $packageType->update($data);

        return redirect()->route('package-type.index')->with('success', 'Tipe paket berhasil diubah !');
    }

    public function destroy(PackageType $packageType)
    {
        // Hapus data dari database
        $packageType->delete();

        return redirect()->route('package-type.index')->with('success', 'Tipe paket berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:package_types,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $packageTypes = PackageType::find($id);

            if ($packageTypes) {
                // Hapus data dari database
                $packageTypes->delete();
                $count++;
            }
        }

        return redirect()->route('package-type.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
