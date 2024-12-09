<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Récupérer la liste des utilisateurs.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email')->get();
        return response()->json($users, 200);
    }
}
