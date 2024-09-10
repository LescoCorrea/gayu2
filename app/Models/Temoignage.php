<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Temoignage extends Model
{
    use HasFactory;
    protected $table = 'temoignages';

    protected $fillable = [
        'nom_complet',
        'profession',
        'temoignage',
    ];
}
