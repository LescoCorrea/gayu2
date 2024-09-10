<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Realisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'artisan_id', 'titre', 'prix', 'status', 'rating', 'aime'
    ];

    protected $casts = [
        'aime' => 'integer',
    ];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class, 'artisan_id');
    }

    public function images()
    {
        return $this->hasMany(RealisationImage::class);
    }

    public function comments()
    {
        return $this->hasMany(Commentaire::class);
    }

    public function mainImage()
    {
        return $this->images()->first();
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function like(): HasMany
    {
        return $this->hasMany(Aime::class);
    }
}
