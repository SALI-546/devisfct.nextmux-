<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'name' => 'Pack Site Vitrine',
            'default_quantity' => 1,
            'unit_price' => 170000,
            'tva' => 20,
        ]);

        Product::create([
            'name' => 'Pack Site Institutionnel',
            'default_quantity' => 1,
            'unit_price' => 245000,
            'tva' => 15,
        ]);

        Product::create([
            'name' => 'Pack Site E-commerce',
            'default_quantity' => 1,
            'unit_price' => 475000,
            'tva' => 10,
        ]);
    }
}
