<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Utilisation de l'authentification Laravel

class User extends Authenticatable
{
    use HasFactory;
   

    protected $fillable = [
        'nm_id',
        'name',
        'email',
        'password', // Ajout de 'password' aux attributs fillable
        'is_confirmed',
        'is_admin',
        'is_desabled',
        'have_complete',
        'is_online',
        'fcm_token',
        'double_auth_code',
        'devise',
        'double_auth_code_confirmed',
        'last_connexion',
    ];

    /**
     * Les attributs qui doivent être cachés pour les tableaux.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Un utilisateur peut avoir plusieurs clients.
     */
    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
