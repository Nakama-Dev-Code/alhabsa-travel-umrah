<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('category.type')->get();
        $categories = PackageCategory::with('type')->get();

        return Inertia::render('Packages/Index', compact('packages', 'categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_category_id' => 'required|exists:package_categories,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        Package::create($request->only('package_category_id', 'title', 'description', 'image'));
        return redirect()->back();
    }

    public function update(Request $request, Package $package)
    {
        $request->validate([
            'package_category_id' => 'required|exists:package_categories,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $package->update($request->only('package_category_id', 'title', 'description', 'image'));
        return redirect()->back();
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return redirect()->back();
    }
}
