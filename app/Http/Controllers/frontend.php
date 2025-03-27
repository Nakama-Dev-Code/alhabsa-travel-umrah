<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class Frontend extends Controller
{
    public function home() {
         return Inertia::render('frontend/HomePages');
    }
    public function card() {
         return Inertia::render('frontend/CardPages');
    }
}
