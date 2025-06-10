<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('room_code', 6)->unique();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('room_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['owner', 'member', 'moderator'])->default('member');
            $table->timestamp('joined_at');
            $table->timestamps();

            $table->unique(['room_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_user');
        Schema::dropIfExists('rooms');
    }
}; 