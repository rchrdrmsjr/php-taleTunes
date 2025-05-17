<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('upload', function () {
        return Inertia::render('upload');
    })->name('upload');
});

Route::get('profile/{username}', function ($username) {
    $user = \App\Models\User::where('username', $username)->firstOrFail();
    // You can also load posts, etc. here
    return Inertia::render('profile/show', [
        'user' => $user,
        // 'posts' => $user->posts, // if you want to pass posts
    ]);
})->name('profile.public');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
