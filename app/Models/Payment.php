<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'amount',
        'mode',
        'transaction_id',
    ];

    /**
     * Un paiement appartient à une facture.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}

