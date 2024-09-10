<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artisan_metier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')->constrained('artisans'); // Assurez-vous de préciser le nom de la table des artisans
            $table->foreignId('metier_id')->constrained('metiers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artisan_metier');
    }
};
