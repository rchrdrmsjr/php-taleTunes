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
                'cover_image.*' => 'required|image|mimes:jpeg,jpg,png|max:51200', // 50MB max per image
                'cover_image' => 'required|array|min:1|max:10', // Max 10 images
                'audio_file' => 'required|file|mimes:mp3|max:51200', // 50MB max
                'category' => 'required|string|in:Fiction,Non-fiction,Biography,Children',
                'is_public' => 'boolean',
            ], [
                'cover_image.*.mimes' => 'The cover image must be a file of type: jpeg, jpg, png.',
                'cover_image.*.max' => 'The cover image may not be greater than 50MB.',
                'cover_image.required' => 'Please select at least one cover image.',
                'cover_image.array' => 'The cover image must be an array.',
                'cover_image.min' => 'Please select at least one cover image.',
                'cover_image.max' => 'You can upload maximum 10 images.',
            ]);

            Log::info('Validation passed', ['validated_data' => $validated]);

            // Store cover images
            $coverPaths = [];
            foreach ($request->file('cover_image') as $image) {
                try {
                    $path = $image->store('audiobooks/covers', 'public');
                    $coverPaths[] = $path;
                    Log::info('Cover image stored successfully', [
                        'path' => $path,
                        'original_name' => $image->getClientOriginalName(),
                        'mime_type' => $image->getMimeType(),
                        'size' => $image->getSize()
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error storing cover image', [
                        'error' => $e->getMessage(),
                        'file' => $image->getClientOriginalName(),
                        'mime_type' => $image->getMimeType(),
                        'size' => $image->getSize()
                    ]);
                    throw new \Exception('Failed to store cover image: ' . $e->getMessage());
                }
            }
            Log::info('Cover images stored', ['paths' => $coverPaths]);
            
            // Store audio file
            try {
                $audioPath = $request->file('audio_file')->store('audiobooks/audio', 'public');
                Log::info('Audio file stored', ['path' => $audioPath]);
            } catch (\Exception $e) {
                Log::error('Error storing audio file', [
                    'error' => $e->getMessage(),
                    'file' => $request->file('audio_file')->getClientOriginalName()
                ]);
                throw new \Exception('Failed to store audio file: ' . $e->getMessage());
            }

            $audiobook = Audiobook::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'cover_image' => json_encode($coverPaths),
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
                'error' => 'Failed to upload audiobook: ' . $e->getMessage(),
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