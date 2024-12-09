<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Appeler le seeder des utilisateurs et des clients
        $this->call([
            UserSeeder::class,
            ClientSeeder::class,
            ProductSeeder::class,
            DefaultUserSeeder::class,
            // Ajoutez d'autres seeders ici si nécessaire
        ]);
    }
}