<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'artisan_id', 'type', 'message', 'realisation_image'
    ];

    // Relation avec l'utilisateur (destinataire de la notification)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function realisation()
    {
        return $this->belongsTo(Realisation::class, 'realisation_id');
    }
}
