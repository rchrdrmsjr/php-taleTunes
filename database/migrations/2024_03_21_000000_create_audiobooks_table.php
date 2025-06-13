<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audiobooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('author');
            $table->text('description')->nullable();
            $table->longText('cover_image')->nullable();
            $table->string('audio_file');
            $table->string('category');
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop the pivot table first to avoid foreign key constraint errors
        if (Schema::hasTable('audiobook_room')) {
            Schema::dropIfExists('audiobook_room');
        }
        Schema::dropIfExists('audiobooks');
    }
}; 