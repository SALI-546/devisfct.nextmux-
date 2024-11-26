<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ParametresController extends Controller
{
    public function index()
    {
        return view('parametres.config');
    }
}
