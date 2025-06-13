<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Audiobook;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show($username)
    {
        $user = User::where('username', $username)->firstOrFail();
        $audiobooks = Audiobook::where('user_id', $user->id)
            ->with('user')
            ->latest()
            ->get();

        // Count of rooms the user is a member of
        $roomCount = $user->joinedRooms()->count();
        // Count of favorite audiobooks for the user
        $favoritesCount = $user->favoriteAudiobooks()->count();

        return Inertia::render('profile/show', [
            'user' => $user,
            'audiobooks' => $audiobooks,
            'roomCount' => $roomCount,
            'favoritesCount' => $favoritesCount,
        ]);
    }
}
