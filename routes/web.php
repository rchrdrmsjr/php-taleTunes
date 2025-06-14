<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AudiobookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Models\Audiobook;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomAudiobookController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\HomeController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Audiobooks routes
    Route::prefix('audiobooks')->group(function () {
        Route::get('/all', [AudiobookController::class, 'all'])->name('audiobooks.all');
        Route::get('/search-by-code', [AudiobookController::class, 'searchByCode'])->name('audiobooks.searchByCode');
        Route::get('/{audiobook}', [AudiobookController::class, 'show'])->name('audiobooks.show');
        Route::post('/{audiobook}/toggle-favorite', [AudiobookController::class, 'toggleFavorite'])->name('audiobooks.toggle-favorite');
        Route::get('/{audiobook}/download', [AudiobookController::class, 'download'])->name('audiobooks.download');
        Route::delete('/{audiobook}', [AudiobookController::class, 'destroy'])->name('audiobooks.destroy');
    });

    Route::get('/upload', [AudiobookController::class, 'create'])->name('upload');
    Route::post('/upload', [AudiobookController::class, 'store'])->name('audiobooks.store');

    // Rooms routes
    Route::get('/rooms/mine', [RoomController::class, 'mine'])->name('rooms.mine');
    Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');
    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::post('/rooms/join', [RoomController::class, 'join'])->name('rooms.join');
    Route::post('/rooms/{room}/leave', [RoomController::class, 'leave'])->name('rooms.leave');
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');
    
    // Room audiobook routes
    Route::get('/rooms/{room}/audiobooks', [RoomAudiobookController::class, 'index'])->name('rooms.audiobooks.index');
    Route::post('/rooms/{room}/audiobooks', [RoomAudiobookController::class, 'store'])->name('rooms.audiobooks.store');
    Route::get('/rooms/{room}/audiobooks/{audiobook}', [RoomAudiobookController::class, 'show'])->name('rooms.audiobooks.show');
    Route::delete('/rooms/{room}/audiobooks/{audiobook}', [RoomAudiobookController::class, 'destroy'])->name('rooms.audiobooks.destroy');

    // Comment routes
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

Route::get('profile/{username}', [ProfileController::class, 'show'])->name('profile.public');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
