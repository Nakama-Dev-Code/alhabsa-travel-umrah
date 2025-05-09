<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WebOption;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;

class WebOptionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = 5; // Jumlah item per halaman

        $query = WebOption::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('value', 'like', "%{$search}%");
        }

        $webOptions = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/web-option/index', [
            'webOptions' => $webOptions->items(),
            'meta' => [
                'total' => $webOptions->total(),
                'per_page' => $webOptions->perPage(),
                'current_page' => $webOptions->currentPage(),
                'last_page' => $webOptions->lastPage(),
            ],
        ]);
    }

    public function export_pdf(Request $request)
    {
        $search = $request->search;
        $query = WebOption::query();

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                ->orWhere('value', 'LIKE', "%{$search}%");
        }

        $webOptions = $query->get();

        $pdf = PDF::loadView('exports.web-options', [
            'webOptions' => $webOptions,
            'search' => $search
        ]);

        return $pdf->download('web-options.pdf');
    }

    public function export(Request $request)
    {
        $search = $request->input('search');

        $query = WebOption::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('value', 'like', "%{$search}%");
        }

        $webOptions = $query->get();

        // Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Judul kolom
        $sheet->setCellValue('A1', 'No.');
        $sheet->setCellValue('B1', 'Name');
        $sheet->setCellValue('C1', 'Value');
        $sheet->setCellValue('D1', 'Path File');

        // Isi data
        $row = 2;
        foreach ($webOptions as $index => $webOption) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $webOption->name);
            $sheet->setCellValue('C' . $row, $webOption->value);
            $sheet->setCellValue('D' . $row, $webOption->path_file ?? 'Tidak ada file');
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
        $filename = 'web-option-data-' . date('YmdHis') . '.xlsx';
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
            'name' => 'required|string|max:255|unique:web_options,name',
            'value' => 'required|string',
            'path_file' => 'nullable|mimes:jpg,jpeg,png,gif,pdf|max:2048',
        ], [
            'name.required' => 'Nama harus diisi !',
            'name.max' => 'Nama maksimal 255 karakter !',
            'name.unique' => 'Nama sudah digunakan, gunakan nama lain !',
            'value.required' => 'Nilai harus diisi !',
            'path_file.mimes' => 'File harus berformat jpg, jpeg, png, gif, atau pdf !',
            'path_file.max' => 'Ukuran file maksimal 2MB !',
        ]);

        $data = [
            'name' => $request->name,
            'value' => $request->value
        ];

        if ($request->hasFile('path_file')) {
            $file = $request->file('path_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/web_options'), $filename);
            $data['path_file'] = 'storage/web_options/' . $filename;
        }

        WebOption::create($data);

        return redirect()->route('web-option.index')->with('success', 'Web option berhasil ditambahkan !');
    }

    public function update(Request $request, WebOption $WebOption)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:web_options,name,' . $WebOption->id,
            'value' => 'required|string',
            'path_file' => 'nullable|mimes:jpg,jpeg,png,gif,pdf|max:2048',
        ], [
            'name.required' => 'Nama harus diisi !',
            'name.max' => 'Nama maksimal 255 karakter !',
            'name.unique' => 'Nama sudah digunakan, gunakan nama lain !',
            'value.required' => 'Nilai harus diisi !',
            'path_file.mimes' => 'File harus berformat jpg, jpeg, png, gif, atau pdf !',
            'path_file.max' => 'Ukuran file maksimal 2MB !',
        ]);

        $data = [
            'name' => $request->name,
            'value' => $request->value
        ];

        if ($request->hasFile('path_file')) {
            // Hapus file lama jika ada
            if ($WebOption->path_file && file_exists(public_path($WebOption->path_file))) {
                unlink(public_path($WebOption->path_file));
            }

            // Upload file baru
            $file = $request->file('path_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/web_options'), $filename);
            $data['path_file'] = 'storage/web_options/' . $filename;
        }

        $WebOption->update($data);

        return redirect()->route('web-option.index')->with('success', 'Web option berhasil diubah !');
    }

    public function destroy(WebOption $WebOption)
    {
        // Hapus file dari directory jika ada
        if ($WebOption->path_file && file_exists(public_path($WebOption->path_file))) {
            unlink(public_path($WebOption->path_file));
        }

        // Hapus data dari database
        $WebOption->delete();

        return redirect()->route('web-option.index')->with('success', 'Web option berhasil dihapus !');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:web_options,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        foreach ($ids as $id) {
            $webOption = WebOption::find($id);

            if ($webOption) {
                // Hapus file dari directory jika ada
                if ($webOption->path_file && file_exists(public_path($webOption->path_file))) {
                    unlink(public_path($webOption->path_file));
                }

                // Hapus data dari database
                $webOption->delete();
                $count++;
            }
        }

        return redirect()->route('web-option.index')->with('success', $count . ' data berhasil dihapus.');
    }
}
