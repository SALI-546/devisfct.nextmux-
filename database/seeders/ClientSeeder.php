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
        
        $users = User::all();

        
        if ($users->count() === 0) {
            $this->command->info('Aucun utilisateur trouvé. Exécutez d\'abord le seeder des utilisateurs.');
            return;
        }

        
        $clients = Client::all();

        foreach ($clients as $client) {
           
            $client->user_id = $users->random()->id;
            $client->save();
        }

        $this->command->info('Tous les clients ont été assignés à des utilisateurs.');
    }
}
