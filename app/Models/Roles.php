<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;
    protected $table = 'roles';
    protected $fillable = [
        'name',
    ];

    public function artisans()
    {
        return $this->belongsToMany(Artisan::class, 'artisan_role', 'role_id', 'artisan_id');
    }
}
