<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'entreprise',
        'nom',
        'email',
        'telephone',
        'adresse',
        'user_id', // Nouveau champ ajouté
    ];

    /**
     * Un client appartient à un utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un client peut avoir plusieurs devis.
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }
}