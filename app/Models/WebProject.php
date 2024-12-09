<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebProject extends Model
{
    use HasFactory;

    // Nom de la table dans la base de données
    protected $table = 'web_projects';

    // La clé primaire
    protected $primaryKey = 'id';

    // Désactive l'incrémentation automatique de la clé primaire
    public $incrementing = false;

    // Liste des champs pouvant être remplis en masse (mass assignment)
    protected $fillable = [
        'name',
        'description',
        'estimated_time',
        'estimated_cost',
        'start_mode',
        'files',
        'phone',
        'phone_visible',
        'email',
        'email_visible',
        'address',
        'country',
        'prefix',
        'devise',
        'country_flag',
        'category',
        'skills',
        'requirements',
        'can_be_local',
        'user_id',
        'status',
        'created_at',
        'updated_at'
    ];

    // Liste des types de données JSON dans la base de données
    protected $casts = [
        'files' => 'array',
        'skills' => 'array',
    ];

    // Si vous souhaitez gérer les timestamps automatiquement
    public $timestamps = true;

    // Définir les règles de validation (si nécessaire)
    public static $rules = [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'estimated_time' => 'required|string',
        'estimated_cost' => 'required|string',
        'phone' => 'required|string',
        'email' => 'required|email',
        // Ajoutez d'autres règles de validation selon vos besoins
    ];
}

