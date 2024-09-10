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
        Schema::create('commentaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained(); // Clé étrangère vers la table users pour l'utilisateur normal
            $table->foreignId('artisan_id')->nullable()->constrained(); // Clé étrangère vers la table artisans pour l'artisan
            $table->foreignId('realisation_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_comment_id')->nullable()->constrained('commentaires'); // Clé étrangère vers lui-même pour les réponses aux commentaires
            $table->text('commentaire');
            $table->boolean('is_reply')->default(false); // Champ pour indiquer si c'est une réponse
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commentaires');
    }
};
