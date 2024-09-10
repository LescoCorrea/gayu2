<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Regions extends Model
{
    use HasFactory;
    protected $table = 'regions';
    protected $fillable = [
        'name',
    ];

    public function artisans()
    {
        return $this->belongsToMany(Artisan::class, 'artisan_region', 'region_id', 'artisan_id');
    }
}
