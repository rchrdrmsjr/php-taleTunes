<?php

namespace Database\Factories;

use App\Models\Audiobook;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AudiobookFactory extends Factory
{
    protected $model = Audiobook::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'audio_file' => '/audio/sample.mp3',
            'category' => $this->faker->randomElement(['Fiction', 'Non-fiction', 'Biography', 'Children']),
            'is_public' => true,
            'is_favorite' => false,
        ];
    }
} 