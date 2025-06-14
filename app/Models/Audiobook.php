<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Audiobook extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'cover_image',
        'audio_file',
        'duration',
        'category',
        'is_public',
        'user_id',
        'generated_code',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'cover_image' => 'array',
    ];

    protected $attributes = [
        'cover_image' => '[]',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'audiobook_user')
            ->withTimestamps();
    }
} 