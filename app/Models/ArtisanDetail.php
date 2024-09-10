<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtisanDetail extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'conseil'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
