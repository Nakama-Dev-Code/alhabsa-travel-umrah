<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function home()
    {
        return Inertia::render('frontend/HomePages');
    }

    public function card()
    {
        return Inertia::render('frontend/CardPages');
    }
}
