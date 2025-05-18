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

        return Inertia::render('profile/show', [
            'user' => $user,
            'audiobooks' => $audiobooks,
        ]);
    }
}
