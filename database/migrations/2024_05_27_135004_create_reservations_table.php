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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Si chaque réservation est associée à un utilisateur
            $table->foreignId('artisan_id')->constrained('artisans'); // Ajout de la référence à l'artisan.
            $table->date('date');
            $table->time('heure');
            $table->text('message')->nullable();
            $table->string('image')->nullable(); // Ajout du champ pour le nom du fichier de l'image
            $table->enum('status', ['En attente', 'Rejeter', 'Valider'])->default('En attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
