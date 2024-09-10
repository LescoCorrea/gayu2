<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = ['commentaire_id', 'user_id', 'artisan_id'];

    public function commentaire()
    {
        return $this->belongsTo(Commentaire::class);
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
