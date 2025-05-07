<?php

namespace App\Http\Controllers;

use App\Models\PackageCategory;
use App\Models\PackageType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageCategoryController extends Controller
{
    public function index()
    {
        $categories = PackageCategory::with('type')->get();
        $types = PackageType::all();
        return Inertia::render('PackageCategories/Index', compact('categories', 'types'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_type_id' => 'required|exists:package_types,id',
            'name' => 'required|string'
        ]);

        PackageCategory::create($request->only('package_type_id', 'name'));
        return redirect()->back();
    }

    public function update(Request $request, PackageCategory $packageCategory)
    {
        $request->validate([
            'package_type_id' => 'required|exists:package_types,id',
            'name' => 'required|string'
        ]);

        $packageCategory->update($request->only('package_type_id', 'name'));
        return redirect()->back();
    }

    public function destroy(PackageCategory $packageCategory)
    {
        $packageCategory->delete();
        return redirect()->back();
    }
}
