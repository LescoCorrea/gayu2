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
        Schema::create('aimes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('realisation_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable(); // ID de l'utilisateur, peut être nul si c'est un artisan
            $table->unsignedBigInteger('artisan_id')->nullable(); // ID de l'artisan, peut être nul si c'est un utilisateur
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('artisan_id')->references('id')->on('artisans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aimes');
    }
};
