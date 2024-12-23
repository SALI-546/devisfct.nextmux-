<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'quote_id',
        'emetteur_id',
        'numero',
        'date_emission',
        'include_tva',
        'paiement',
        'commentaires',
        'signature_path',
        'statut',
        'public_token',
        'due_date',
        'logo_url',
    ];

    /**
     * Une facture appartient à un client.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Une facture peut être issue d'un devis.
     */
    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Une facture a plusieurs items (lignes).
     */
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Une facture peut avoir plusieurs paiements.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    
    public function emetteur()
    {
        return $this->belongsTo(Emetteur::class);
    }

}

