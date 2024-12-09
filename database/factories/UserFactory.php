<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    // Spécifiez le modèle associé
    protected $model = \App\Models\User::class;

    /**
     * Définir l'état par défaut du modèle.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nm_id' => strtoupper(Str::random(8)), // Génère un nm_id unique de 8 caractères
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'is_confirmed' => $this->faker->boolean(80), // 80% des utilisateurs confirmés
            'is_admin' => $this->faker->boolean(20), // 20% des utilisateurs sont admins
            'is_desabled' => $this->faker->boolean(5), // 5% des utilisateurs désactivés
            'have_complete' => $this->faker->boolean(70), // 70% des utilisateurs ont complété leur profil
            'is_online' => $this->faker->boolean(50), // 50% des utilisateurs sont en ligne
            'fcm_token' => $this->faker->optional()->sha256(),
            'double_auth_code' => $this->faker->optional()->numerify('####'), // Code de double authentification à 4 chiffres
            'devise' => $this->faker->randomElement(['XOF','USD','EUR']),
            'double_auth_code_confirmed' => $this->faker->boolean(90), // 90% des codes de double auth confirmés
            'last_connexion' => $this->faker->optional()->dateTimeBetween('-1 years', 'now'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
