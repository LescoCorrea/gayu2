<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aime extends Model
{
    use HasFactory;

    protected $fillable = [
        'realisation_id', 'user_id', 'artisan_id'
    ];

    public function realisation()
    {
        return $this->belongsTo(Realisation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
}
