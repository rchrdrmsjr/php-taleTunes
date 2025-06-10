<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Room $room): bool
    {
        return $room->isMember($user);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Room $room): bool
    {
        return $room->isOwner($user) || $room->isModerator($user);
    }

    public function delete(User $user, Room $room): bool
    {
        return $room->isOwner($user);
    }

    public function restore(User $user, Room $room): bool
    {
        return $room->isOwner($user);
    }

    public function forceDelete(User $user, Room $room): bool
    {
        return $room->isOwner($user);
    }
} 