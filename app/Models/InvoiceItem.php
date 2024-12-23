<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'product_id',
        'description',
        'quantite',
        'prix',
        'tva',
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix' => 'float',
        'tva' => 'integer',
    ];

    /**
     * Un item appartient à une facture.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Un item peut être lié à un produit (facultatif).
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
