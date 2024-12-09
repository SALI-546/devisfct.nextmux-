<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\User;

class ClientSeeder extends Seeder
{
    /**
     * Exécuter le seeder des clients.
     *
     * @return void
     */
    public function run()
    {
        // Récupérer tous les utilisateurs
        $users = User::all();

        // Vérifier s'il y a des utilisateurs
        if ($users->count() === 0) {
            $this->command->info('Aucun utilisateur trouvé. Exécutez d\'abord le seeder des utilisateurs.');
            return;
        }

        // Récupérer tous les clients
        $clients = Client::all();

        foreach ($clients as $client) {
            // Assigner un utilisateur aléatoire à chaque client
            $client->user_id = $users->random()->id;
            $client->save();
        }

        $this->command->info('Tous les clients ont été assignés à des utilisateurs.');
    }
}
