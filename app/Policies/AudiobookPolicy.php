<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Audiobook;
use Illuminate\Auth\Access\HandlesAuthorization;

class AudiobookPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Audiobook $audiobook)
    {
        return $user->id === $audiobook->user_id;
    }

    public function delete(User $user, Audiobook $audiobook)
    {
        return $user->id === $audiobook->user_id;
    }
}
