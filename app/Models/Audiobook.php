<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audiobook extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'cover_image',
        'audio_file',
        'category',
        'is_public',
        'is_favorite',
        'user_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_favorite' => 'boolean',
        'cover_image' => 'array',
    ];

    protected $attributes = [
        'cover_image' => '[]',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 