<?php

namespace Database\Seeders;

use App\Models\Audiobook;
use App\Models\User;
use Illuminate\Database\Seeder;

class AudiobookSeeder extends Seeder
{
    public function run(): void
    {
        // Create some test users
        $users = User::factory(3)->create();

        // Create audiobooks for each user
        foreach ($users as $user) {
            Audiobook::factory()->count(5)->create([
                'user_id' => $user->id,
                'is_public' => true,
                'cover_image' => json_encode(['/images/default-cover.png']),
            ]);
        }
    }
} 