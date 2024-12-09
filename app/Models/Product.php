<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'default_quantity',
        'unit_price',
        'tva',
    ];

    /**
     * Un produit peut appartenir à plusieurs items.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
