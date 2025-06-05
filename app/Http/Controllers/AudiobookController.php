<?php

namespace App\Http\Controllers;

use App\Models\Audiobook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AudiobookController extends Controller
{
    public function create()
    {
        return Inertia::render('upload');
    }

    public function store(Request $request)
    {
        try {
            Log::info('Starting audiobook upload', [
                'request_data' => $request->except(['cover_image', 'audio_file']),
                'has_cover' => $request->hasFile('cover_image'),
                'has_audio' => $request->hasFile('audio_file'),
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:2000',
                'cover_image' => 'required|image|max:2048', // 2MB max
                'audio_file' => 'required|file|mimes:mp3|max:51200', // 50MB max
                'category' => 'required|string|in:Fiction,Non-fiction,Biography,Children',
                'is_public' => 'boolean',
            ]);

            Log::info('Validation passed', ['validated_data' => $validated]);

            // Store cover image
            $coverPath = $request->file('cover_image')->store('audiobooks/covers', 'public');
            Log::info('Cover image stored', ['path' => $coverPath]);
            
            // Store audio file
            $audioPath = $request->file('audio_file')->store('audiobooks/audio', 'public');
            Log::info('Audio file stored', ['path' => $audioPath]);

            $audiobook = Audiobook::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'cover_image' => $coverPath,
                'audio_file' => $audioPath,
                'category' => $validated['category'],
                'is_public' => $validated['is_public'],
                'user_id' => auth()->id(),
            ]);

            Log::info('Audiobook created', ['audiobook_id' => $audiobook->id]);

            return redirect()->back()->with('success', 'Audiobook uploaded successfully!');
        } catch (\Exception $e) {
            Log::error('Error uploading audiobook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Failed to upload audiobook. Please try again.',
            ]);
        }
    }

    public function show(Audiobook $audiobook)
    {
        // Check if the audiobook is public or belongs to the current user
        if (!$audiobook->is_public && $audiobook->user_id !== auth()->id()) {
            abort(403);
        }

        return response()->json([
            'audiobook' => $audiobook->load('user'),
        ]);
    }

    public function toggleFavorite(Audiobook $audiobook)
    {
        // Check if the audiobook is public or belongs to the current user
        if (!$audiobook->is_public && $audiobook->user_id !== auth()->id()) {
            abort(403);
        }

        $audiobook->update([
            'is_favorite' => !$audiobook->is_favorite
        ]);

        return response()->json([
            'success' => true,
            'is_favorite' => $audiobook->is_favorite
        ]);
    }
} 