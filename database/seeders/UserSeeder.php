<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   
        // Exemple : création d'un utilisateur
        User::create([
            'nm_id' => 'BSWTVVCV',
            'name' => 'Ludwig Sauer',
            'email' => 'dayne33@example.com',
            'password' => Hash::make('password'), // Hasher le mot de passe
            'is_confirmed' => true,
            'is_admin' => true,
            'is_desabled' => false,
            'have_complete' => true,
            'is_online' => true,
            'fcm_token' => 'some_token',
            'double_auth_code' => '2345',
            'devise' => 'EUR',
            'double_auth_code_confirmed' => true,
            'last_connexion' => now(),
        ]);
    }
}
