<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function home()
    {
        return Inertia::render('frontend/HomePages');
    }

    public function umrahpackages()
    {
        return Inertia::render('frontend/CardPages');
    }
}
