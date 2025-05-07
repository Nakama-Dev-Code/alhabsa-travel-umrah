<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Airline;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AirlineController extends Controller
{
    public function index()
    {
        $airlines = Airline::all();
        return Inertia::render('Airlines/Index', ['airlines' => $airlines]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        Airline::create($request->only('name'));
        return redirect()->back();
    }

    public function update(Request $request, Airline $airline)
    {
        $request->validate(['name' => 'required']);
        $airline->update($request->only('name'));
        return redirect()->back();
    }

    public function destroy(Airline $airline)
    {
        $airline->delete();
        return redirect()->back();
    }
}
