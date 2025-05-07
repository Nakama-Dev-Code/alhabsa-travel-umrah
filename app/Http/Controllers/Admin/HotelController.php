<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::all();
        return Inertia::render('Hotels/Index', ['hotels' => $hotels]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'city' => 'required']);
        Hotel::create($request->only('name', 'city'));
        return redirect()->back();
    }

    public function update(Request $request, Hotel $hotel)
    {
        $request->validate(['name' => 'required', 'city' => 'required']);
        $hotel->update($request->only('name', 'city'));
        return redirect()->back();
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return redirect()->back();
    }
}
