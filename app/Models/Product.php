<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_without_content',
        'price_with_content',
        'parent_id',
    ];

    /**
     * Récupère les fonctionnalités d'un pack.
     */
    public function features()
    {
        return $this->hasMany(Product::class, 'parent_id');
    }

    /**
     * Récupère le pack parent d'une fonctionnalité.
     */
    public function pack()
    {
        return $this->belongsTo(Product::class, 'parent_id');
    }

    /**
     * Un produit peut appartenir à plusieurs items.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function invoiceItems()
{
    return $this->hasMany(InvoiceItem::class);
}

}
