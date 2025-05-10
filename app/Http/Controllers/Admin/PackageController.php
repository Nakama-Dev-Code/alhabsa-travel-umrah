<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = Package::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $packages = $query->paginate($perPage)
            ->withQueryString();

        // Get all package types for the dropdown
        $packageCategories = PackageCategory::all();

        return Inertia::render('admin/package/index', [
            'packages' => $packages->items(),
            'packageCategories' => $packageCategories,
            'meta' => [
                'total' => $packages->total(),
                'per_page' => $packages->perPage(),
                'current_page' => $packages->currentPage(),
                'last_page' => $packages->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = Package::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $packages = $query->get();

        $pdf = PDF::loadView('exports.packages', [
            'packages' => $packages,
            'search' => $search
        ]);

        return $pdf->download('packages.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = Package::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $packages = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Nama Paket');
        $sheet->setCellValue('C1', 'Kategori Paket');
        $sheet->setCellValue('D1', 'Deskripsi');
        $sheet->setCellValue('E1', 'Path File');

        // Isi data
        $row = 2;
        foreach ($packages as $index => $packages) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $packages->title);
            $sheet->setCellValue('C' . $row, $packages->category->name ?? 'Tidak ada Kategori');
            $sheet->setCellValue('D' . $row, $packages->description ?? 'Tidak ada deskripsi');
            $sheet->setCellValue('E' . $row, $packages->image ?? 'Tidak ada file');
            $row++;
        }

        // Styling header
        $sheet->getStyle('A1:E1')->getFont()->setBold(true);
        $sheet->getStyle('A1:E1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');

        // Atur lebar kolom agar sesuai dengan konten
        foreach (range('A', 'E') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Buat file Excel
        $writer = new Xlsx($spreadsheet);
        $filename = 'package-data-' . date('YmdHis') . '.xlsx';
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
            'package_category_id' => 'required|exists:package_categories,id',
            'title' => 'required|string|max:255|unique:packages,title',
            'image' => 'nullable|mimes:jpg,jpeg,png,gif|max:2048',
            'description' => 'nullable|string',
        ], [
            'package_category_id.required' => 'Jenis paket harus dipilih !',
            'package_category_id.exists' => 'Jenis paket tidak ditemukan !',
            'title.required' => 'Judul paket harus diisi !',
            'title.max' => 'Judul paket maksimal 255 karakter !',
            'title.unique' => 'Judul paket sudah digunakan, gunakan nama lain !',
            'image.mimes' => 'File harus berformat jpg, jpeg, png, atau gif !',
            'image.max' => 'Ukuran file maksimal 2MB !',
        ]);

        $data = [
            'package_category_id' => $request->package_category_id,
            'title' => $request->title,
            'description' => $request->description,
        ];

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/package'), $filename);
            $data['image'] = 'storage/package/' . $filename;
        }

        Package::create($data);

        return redirect()->route('package.index')->with('success', 'Paket berhasil ditambahkan !');
    }

    public function update(Request $request, Package $Package)
    {
        $request->validate([
            'package_category_id' => 'required|exists:package_categories,id',
            'title' => 'required|string|max:255|unique:packages,title,' . $Package->id,
            'image' => 'nullable|mimes:jpg,jpeg,png,gif|max:2048',
        ], [
            'package_category_id.required' => 'Jenis paket harus dipilih !',
            'package_category_id.exists' => 'Jenis paket tidak ditemukan !',
            'title.required' => 'Judul paket harus diisi !',
            'title.max' => 'Judul paket maksimal 255 karakter !',
            'title.unique' => 'Judul paket sudah digunakan, gunakan nama lain !',
            'image.mimes' => 'File harus berformat jpg, jpeg, png, atau gif !',
            'image.max' => 'Ukuran file maksimal 2MB !',
        ]);

        $data = [
            'package_category_id' => $request->package_category_id,
            'title' => $request->title,
            'description' => $request->description,
        ];

        if ($request->hasFile('image')) {
            // Hapus file lama jika ada
            if ($Package->image && file_exists(public_path($Package->image))) {
                unlink(public_path($Package->image));
            }

            // Upload file baru
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/package'), $filename);
            $data['image'] = 'storage/package/' . $filename;
        }

        $Package->update($data);

        return redirect()->route('package.index')->with('success', 'Paket berhasil diubah !');
    }

    public function destroy(Package $Package)
    {
        // Hapus file dari directory jika ada
        if ($Package->image && file_exists(public_path($Package->image))) {
            unlink(public_path($Package->image));
        }

        // Hapus data dari database
        $Package->delete();

        return redirect()->route('package.index')->with('success', 'Paket berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:packages,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $package = Package::find($id);

            if ($package) {
                // Hapus file dari directory jika ada
                if ($package->image && file_exists(public_path($package->image))) {
                    unlink(public_path($package->image));
                }

                // Hapus data dari database
                $package->delete();
                $count++;
            }
        }

        return redirect()->route('package.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
