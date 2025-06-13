<?php

namespace App\Http\Controllers;
use App\Models\Audiobook;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // get all audiobooks with from current user
        $user = auth()->user();
        $audiobooks = Audiobook::where('user_id', $user->id)
            ->with('user')
            ->latest()
            ->get();    

        // get all public audiobooks from all users
        $otherAudiobooks = Audiobook::where('is_public', true)
            ->with('user')
            ->inRandomOrder()
            ->get();    

        // get the current user's favorite audiobooks
        $favoriteAudiobooks = $user->favoriteAudiobooks()->with('user')->get();

        return Inertia::render('dashboard', [
            'userAudiobooks' => $audiobooks,
            'otherAudiobooks' => $otherAudiobooks,
            'favoriteAudiobooks' => $favoriteAudiobooks,
        ]);
    }
}
