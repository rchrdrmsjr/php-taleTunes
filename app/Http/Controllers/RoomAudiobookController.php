<?php

namespace App\Http\Controllers;

use App\Models\Audiobook;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RoomAudiobookController extends Controller
{
    public function index(Room $room)
    {
        // Check if user is a member of the room
        if (!$room->isMember(auth()->user())) {
            abort(403);
        }

        $audiobooks = $room->audiobooks()
            ->with('user')
            ->latest()
            ->get();

        return Inertia::render('rooms/audiobooks/index', [
            'room' => $room,
            'audiobooks' => $audiobooks,
        ]);
    }

    public function store(Request $request, Room $room)
    {
        // Check if user is a member of the room
        if (!$room->isMember(auth()->user())) {
            abort(403);
        }

        try {
            Log::info('Starting room audiobook upload', [
                'room_id' => $room->id,
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
                'is_public' => false, // Always false for room audiobooks
                'user_id' => auth()->id(),
            ]);

            // Attach the audiobook to the room
            $room->audiobooks()->attach($audiobook->id);

            Log::info('Room audiobook created', [
                'audiobook_id' => $audiobook->id,
                'room_id' => $room->id
            ]);

            return redirect()->back()->with('success', 'Audiobook added to room successfully!');
        } catch (\Exception $e) {
            Log::error('Error uploading room audiobook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Failed to upload audiobook: ' . $e->getMessage(),
            ]);
        }
    }

    public function show(Room $room, Audiobook $audiobook)
    {
        // Check if user is a member of the room
        if (!$room->isMember(auth()->user())) {
            abort(403);
        }

        // Check if audiobook belongs to the room
        if (!$room->audiobooks()->where('audiobook_id', $audiobook->id)->exists()) {
            abort(404);
        }

        return response()->json([
            'audiobook' => $audiobook->load('user'),
        ]);
    }

    public function destroy(Room $room, Audiobook $audiobook)
    {
        // Check if user is the owner of the audiobook or a room moderator
        if ($audiobook->user_id !== auth()->id() && !$room->isModerator(auth()->user())) {
            abort(403);
        }

        // Check if audiobook belongs to the room
        if (!$room->audiobooks()->where('audiobook_id', $audiobook->id)->exists()) {
            abort(404);
        }

        // Delete the files
        if ($audiobook->cover_image) {
            $coverPaths = json_decode($audiobook->cover_image, true);
            foreach ($coverPaths as $path) {
                Storage::disk('public')->delete($path);
            }
        }
        if ($audiobook->audio_file) {
            Storage::disk('public')->delete($audiobook->audio_file);
        }

        // Detach from room and delete
        $room->audiobooks()->detach($audiobook->id);
        $audiobook->delete();

        return redirect()->back()->with('success', 'Audiobook removed from room successfully!');
    }
} 