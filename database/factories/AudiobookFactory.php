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
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name,
            'description' => $this->faker->paragraph(),
            'audio_file' => '/audio/sample.mp3',
            'category' => $this->faker->randomElement(['Fantasy', 'Romance', 'Motivation', 'Horror', 'Non-Fiction', 'Memoir', 'Science Fiction', 'Mystery', 'Historical Fiction']),
            'is_public' => true,
        ];
    }
} 