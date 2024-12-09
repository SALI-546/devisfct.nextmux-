<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'product_id',
        'quantite',
        'prix',
        'tva',
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix' => 'float', // Cast 'prix' en float
        'tva' => 'integer',
    ];

    /**
     * Un item appartient à un devis.
     */
    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Un item appartient à un produit.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
