<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewdevisController extends Controller
{
    public function index()
    {
        return view('new-devis.index');
    }
}
