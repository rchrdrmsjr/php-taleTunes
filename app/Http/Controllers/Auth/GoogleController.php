<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl(config('services.google.redirect'))
                ->user();
            
            \Log::info('Google user data:', [
                'email' => $googleUser->email,
                'name' => $googleUser->name,
                'id' => $googleUser->id,
                'avatar' => $googleUser->avatar
                
            ]);

            // Generate a username from the Google user's name
            $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $googleUser->name));
            // Ensure username is unique by appending a random number if needed
            $baseUsername = $username;
            $counter = 1;
            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter;
                $counter++;
            }

            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name,
                    'username' => $username,
                    'password' => Hash::make(Str::random(24)),
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                ]
            );

            \Log::info('User created/updated:', [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'username' => $user->username
            ]);

            Auth::login($user);

            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            \Log::error('Google authentication failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')->with('error', 'Google authentication failed: ' . $e->getMessage());
        }
    }
} 