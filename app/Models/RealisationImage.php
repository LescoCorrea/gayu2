<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealisationImage extends Model
{
    use HasFactory;
    protected $fillable = ['realisation_id', 'image'];

    public function realisation()
    {
        return $this->belongsTo(Realisation::class);
    }
    
}
