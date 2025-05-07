<?php

namespace App\Http\Controllers;

use App\Models\PackageType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageTypeController extends Controller
{
    public function index()
    {
        $types = PackageType::all();
        return Inertia::render('PackageTypes/Index', ['types' => $types]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        PackageType::create($request->only('name'));
        return redirect()->back();
    }

    public function update(Request $request, PackageType $packageType)
    {
        $request->validate(['name' => 'required|string']);
        $packageType->update($request->only('name'));
        return redirect()->back();
    }

    public function destroy(PackageType $packageType)
    {
        $packageType->delete();
        return redirect()->back();
    }
}
