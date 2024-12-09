<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
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
     * Un devis peut avoir plusieurs items.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    /**
     * (Optionnel) Un devis utilise un mode de paiement.
     */
    // public function paymentMethod()
    // {
    //     return $this->belongsTo(PaymentMethod::class, 'paiement', 'name');
    // }

    /**
     * (Optionnel) Un devis a un statut.
     */
    // public function status()
    // {
    //     return $this->belongsTo(Status::class);
    // }
}
