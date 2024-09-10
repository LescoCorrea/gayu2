<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metiers extends Model
{
    use HasFactory;
    protected $table = 'metiers';
    protected $fillable = [
        'name',
    ];

    public function artisans()
    {
        return $this->belongsToMany(Artisan::class, 'artisan_metier', 'metier_id', 'artisan_id');
    }
}
