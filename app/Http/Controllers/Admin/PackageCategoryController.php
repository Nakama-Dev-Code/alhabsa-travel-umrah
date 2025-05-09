<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PackageCategory;
use App\Models\PackageType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class PackageCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = PackageCategory::with('type');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhereHas('type', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $packageCategories = $query->paginate($perPage)
            ->withQueryString();

        // Get all package types for the dropdown
        $packageTypes = PackageType::all();

        return Inertia::render('admin/package-category/index', [
            'packageCategories' => $packageCategories->items(),
            'packageTypes' => $packageTypes,
            'meta' => [
                'total' => $packageCategories->total(),
                'per_page' => $packageCategories->perPage(),
                'current_page' => $packageCategories->currentPage(),
                'last_page' => $packageCategories->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = PackageCategory::with('type');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhereHas('type', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $packageCategories = $query->get();

        $pdf = PDF::loadView('exports.package-categories', [
            'packageCategories' => $packageCategories,
            'search' => $search
        ]);

        return $pdf->download('package-categories.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = PackageCategory::with('type');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhereHas('type', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $packageCategories = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Jenis Paket');
        $sheet->setCellValue('C1', 'Tipe Paket');
        $sheet->setCellValue('D1', 'Deskripsi');

        // Isi data
        $row = 2;
        foreach ($packageCategories as $index => $packageCategory) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $packageCategory->name);
            $sheet->setCellValue('C' . $row, $packageCategory->type->name ?? 'Tidak ada tipe');
            $sheet->setCellValue('D' . $row, $packageCategory->description ?? 'Tidak ada deskripsi');
            $row++;
        }

        // Styling header
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);
        $sheet->getStyle('A1:D1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');

        // Atur lebar kolom agar sesuai dengan konten
        foreach (range('A', 'D') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Buat file Excel
        $writer = new Xlsx($spreadsheet);
        $filename = 'package-category-data-' . date('YmdHis') . '.xlsx';
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
            'package_type_id' => 'required|exists:package_types,id',
            'name' => 'required|string|max:255|unique:package_categories,name',
        ], [
            'package_type_id.required' => 'Tipe paket harus dipilih !',
            'package_type_id.exists' => 'Tipe paket tidak ditemukan !',
            'name.required' => 'Jenis Paket harus diisi !',
            'name.max' => 'Jenis Paket maksimal 255 karakter !',
            'name.unique' => 'Jenis Paket sudah digunakan, gunakan nama lain !',
        ]);

        PackageCategory::create($request->only('package_type_id', 'name'));
        return redirect()->route('package-category.index')->with('success', 'Kategori paket berhasil ditambahkan !');
    }

    public function update(Request $request, PackageCategory $packageCategory)
    {
        $request->validate([
            'package_type_id' => 'required|exists:package_types,id',
            'name' => 'required|string|max:255|unique:package_categories,name,' . $packageCategory->id,
        ], [
            'package_type_id.required' => 'Tipe paket harus dipilih !',
            'package_type_id.exists' => 'Tipe paket tidak ditemukan !',
            'name.required' => 'Jenis Paket harus diisi !',
            'name.max' => 'Jenis Paket maksimal 255 karakter !',
            'name.unique' => 'Jenis Paket sudah digunakan, gunakan nama lain !',
        ]);

        $packageCategory->update($request->only('package_type_id', 'name', 'description'));

        return redirect()->route('package-category.index')->with('success', 'Kategori paket berhasil diperbarui !');
    }

    public function destroy(PackageCategory $packageCategory)
    {
        // Periksa apakah ada paket yang terkait dengan kategori ini
        if ($packageCategory->packages()->count() > 0) {
            return redirect()->route('package-category.index')->with('error', 'Tidak dapat menghapus kategori yang digunakan oleh paket !');
        }

        $packageCategory->delete();

        return redirect()->route('package-category.index')->with('success', 'Kategori paket berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:package_categories,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $packageCategories = PackageCategory::find($id);

            if ($packageCategories) {
                // Hapus data dari database
                $packageCategories->delete();
                $count++;
            }
        }

        return redirect()->route('package-category.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
