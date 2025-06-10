<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'room_code',
        'owner_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function moderators(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->wherePivot('role', 'moderator')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    public function isMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function isModerator(User $user): bool
    {
        return $this->moderators()->where('user_id', $user->id)->exists();
    }

    public function isOwner(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    public function audiobooks()
    {
        return $this->belongsToMany(Audiobook::class)
            ->withTimestamps();
    }
} 