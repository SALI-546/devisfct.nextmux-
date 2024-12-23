<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
 
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
      
        $packs = Product::with('features')->whereNull('parent_id')->get();

        return response()->json($packs, 200);
    }
}
