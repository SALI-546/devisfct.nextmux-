<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Un statut peut être associé à plusieurs devis.
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }
}
