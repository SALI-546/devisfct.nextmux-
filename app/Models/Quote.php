<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'emetteur_id',
        'numero',
        'date_emission',
        'logo_path',
        'include_tva',
        'paiement',
        'commentaires',
        'signature_path',
        'statut',
    ];

    /**
     * Un devis appartient à un client.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

     /**
     * Un devis appartient à un émetteur.
     */
    public function emetteur()
    {
        return $this->belongsTo(Emetteur::class);
    }


    /**
     * Un devis peut avoir plusieurs items.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    
}
