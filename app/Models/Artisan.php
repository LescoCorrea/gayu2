<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artisan extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'password',
        'addréss',
        'atélier',
        'region',
        'metier',
        'téléphone',
        'image',
        'status',
        'rating',
    ];

    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'artisan_role', 'artisan_id', 'role_id');
    }

    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function details()
    {
        return $this->hasOne(ArtisanDetail::class);
    }

    public function metiers()
    {
        return $this->belongsToMany(Metiers::class, 'artisan_metier', 'artisan_id', 'metier_id');
    }

    public function regions()
    {
        return $this->belongsToMany(Regions::class, 'artisan_region', 'artisan_id', 'region_id');
    }

    public function realisations(): HasMany
    {
        return $this->hasMany(Realisation::class, 'artisan_id');
    }

    public function favoris()
    {
        return $this->hasMany(Favoris::class);
    }

    public function usersFavoris()
    {
        return $this->belongsToMany(User::class, 'favoris', 'artisan_id', 'user_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }

    public function commentaire()
    {
        return $this->hasMany(Commentaire::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function like(): HasMany
    {
        return $this->hasMany(Aime::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function averageRating()
    {
        return $this->ratings()->avg('rating');
    }

    public function ratingCount()
    {
        return $this->ratings()->count();
    }
}
