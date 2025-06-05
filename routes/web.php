<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AudiobookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('upload', [AudiobookController::class, 'create'])->name('upload');
    Route::post('upload', [AudiobookController::class, 'store'])->name('audiobooks.store');
    Route::get('audiobooks/{audiobook}', [AudiobookController::class, 'show'])->name('audiobooks.show');
    Route::post('audiobooks/{audiobook}/toggle-favorite', [AudiobookController::class, 'toggleFavorite'])->name('audiobooks.toggle-favorite');
});

Route::get('profile/{username}', [ProfileController::class, 'show'])->name('profile.public');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
