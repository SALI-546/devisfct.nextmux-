<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emetteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'adresse',
    ];

    /**
     * Un émetteur peut avoir plusieurs factures.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

     /**
     * Un émetteur peut avoir plusieurs devis.
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }
}
