<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AirportController extends Controller
{
    public function index()
    {
        $airports = Airport::all();
        return Inertia::render('Airports/Index', ['airports' => $airports]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'code' => 'required']);
        Airport::create($request->only('name', 'code'));
        return redirect()->back();
    }

    public function update(Request $request, Airport $airport)
    {
        $request->validate(['name' => 'required', 'code' => 'required']);
        $airport->update($request->only('name', 'code'));
        return redirect()->back();
    }

    public function destroy(Airport $airport)
    {
        $airport->delete();
        return redirect()->back();
    }
}
