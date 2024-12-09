<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   
        // Vérifiez si l'utilisateur par défaut existe déjà
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            User::create([
                'nm_id' => 'NM001',
                'name' => 'Utilisateur Test',
                'email' => 'test@example.com',
                'password' => Hash::make('password'), // Hasher le mot de passe
                'is_confirmed' => true,
                'is_admin' => false,
                'is_desabled' => false,
                'have_complete' => true,
                'double_auth_code_confirmed' => true,
                'devise' => 'USD',
                'last_connexion' => now(),
            ]);
        }
    }
}
