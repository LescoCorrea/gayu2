<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'realisation_id',
        'user_id',
        'artisan_id',
        'parent_comment_id',
        'commentaire',
        'is_reply',
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

    public function parentComment()
    {
        return $this->belongsTo(Commentaire::class, 'parent_comment_id');
    }

    public function replies()
    {
        return $this->hasMany(Commentaire::class, 'parent_comment_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}

