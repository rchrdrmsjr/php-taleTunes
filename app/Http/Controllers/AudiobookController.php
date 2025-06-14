<?php

namespace App\Http\Controllers;

use App\Models\Audiobook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AudiobookController extends Controller
{
    use AuthorizesRequests;

    public function create()
    {
        return Inertia::render('upload');
    }

    // public function edit(Audiobook $audiobook)
    // {
    //     $this->authorize('update', $audiobook);
    //     return Inertia::render('EditAudiobook', [
    //         'audiobook' => $audiobook
    //     ]);
    // }

    // public function update(Request $request, Audiobook $audiobook)
    // {
    //     try {
    //         $this->authorize('update', $audiobook);

    //         Log::info('Starting audiobook update', [
    //             'audiobook_id' => $audiobook->id,
    //             'request_data' => $request->except(['cover_image', 'audio_file', '_method']),
    //             'has_cover' => $request->hasFile('cover_image'),
    //             'has_audio' => $request->hasFile('audio_file'),
    //         ]);

    //         $validated = $request->validate([
    //             'title' => 'required|string|max:255',
    //             'author' => 'required|string|max:255',
    //             'description' => 'nullable|string|max:2000',
    //             'cover_image.*' => 'nullable|image|mimes:jpeg,jpg,png|max:51200',
    //             'cover_image' => 'nullable|array|min:1|max:10',
    //             'audio_file' => 'nullable|file|mimes:mp3|max:51200',
    //             'duration' => 'required|string',
    //             'category' => 'required|string|in:Fantasy,Romance,Motivation,Horror,Non-Fiction,Memoir,Science Fiction,Mystery,Historical Fiction',
    //             'is_public' => 'boolean',
    //         ]);

    //         Log::info('Validation passed for audiobook update', ['validated_data' => $validated]);

    //         // Handle cover images
    //         if ($request->hasFile('cover_image')) {
    //             // Delete old cover images
    //             $oldImages = json_decode($audiobook->cover_image, true);
    //             if (is_array($oldImages)) {
    //                 foreach ($oldImages as $image) {
    //                     Storage::disk('public')->delete($image);
    //                 }
    //             }

    //             // Store new cover images
    //             $coverPaths = [];
    //             foreach ($request->file('cover_image') as $image) {
    //                 $path = $image->store('audiobooks/covers', 'public');
    //                 $coverPaths[] = $path;
    //             }
    //             $validated['cover_image'] = json_encode($coverPaths);
    //         } else {
    //             // Retain old cover images if no new ones are uploaded
    //             $validated['cover_image'] = $audiobook->cover_image;
    //         }

    //         // Handle audio file
    //         if ($request->hasFile('audio_file')) {
    //             // Delete old audio file
    //             Storage::disk('public')->delete($audiobook->audio_file);
                
    //             // Store new audio file
    //             $audioPath = $request->file('audio_file')->store('audiobooks/audio', 'public');
    //             $validated['audio_file'] = $audioPath;
    //         } else {
    //             // Retain old audio file if no new one is uploaded
    //             $validated['audio_file'] = $audiobook->audio_file;
    //         }

    //         $audiobook->update($validated);

    //         Log::info('Audiobook updated successfully', ['audiobook_id' => $audiobook->id]);

    //         return response()->json(['message' => 'Audiobook updated successfully']);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         Log::error('Validation error during audiobook update', [
    //             'errors' => $e->errors(),
    //             'request_data' => $request->all(),
    //         ]);
    //         return response()->json(['errors' => $e->errors()], 422);
    //     } catch (\Exception $e) {
    //         Log::error('Error updating audiobook', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //             'audiobook_id' => $audiobook->id ?? null,
    //         ]);
    //         return response()->json(['error' => 'Failed to update audiobook: ' . $e->getMessage()], 500);
    //     }
    // }

    public function destroy(Audiobook $audiobook)
    {
        $this->authorize('delete', $audiobook);

        try {
            // Delete cover images
            $coverImages = json_decode($audiobook->cover_image, true);
            if (is_array($coverImages)) {
                foreach ($coverImages as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            // Delete audio file
            Storage::disk('public')->delete($audiobook->audio_file);

            // Delete audiobook record
            $audiobook->delete();

            return response()->json(['message' => 'Audiobook deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting audiobook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'audiobook_id' => $audiobook->id,
            ]);
            return response()->json(['error' => 'Failed to delete audiobook: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Starting audiobook upload', [
                'request_data' => $request->all(),
                'has_cover' => $request->hasFile('cover_image'),
                'has_audio' => $request->hasFile('audio_file'),
            ]);

            Log::debug('Incoming request for audiobook store:', $request->all());

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'required|string|max:255',
                'description' => 'nullable|string|max:2000',
                'cover_image.*' => 'required|image|mimes:jpeg,jpg,png|max:51200', // 50MB max per image
                'cover_image' => 'required|array|min:1|max:10', // Max 10 images
                'audio_file' => 'required|file|mimes:mp3|max:51200', // 50MB max
                'duration' => 'required|string',
                'category' => 'required|string|in:Fantasy,Romance,Motivation,Horror,Non-Fiction,Memoir,Science Fiction,Mystery,Historical Fiction',
                'is_public' => 'boolean',
                'generated_code' => 'nullable|string|max:255',
            ], [
                'cover_image.*.mimes' => 'The cover image must be a file of type: jpeg, jpg, png.',
                'cover_image.*.max' => 'The cover image may not be greater than 50MB.',
                'cover_image.required' => 'Please select at least one cover image.',
                'cover_image.array' => 'The cover image must be an array.',
                'cover_image.min' => 'Please select at least one cover image.',
                'cover_image.max' => 'You can upload maximum 10 images.',
                'duration.required' => 'Audio duration is required.',
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
                Log::info('Audio file stored successfully', [
                    'path' => $audioPath,
                    'original_name' => $request->file('audio_file')->getClientOriginalName(),
                    'mime_type' => $request->file('audio_file')->getMimeType(),
                    'size' => $request->file('audio_file')->getSize()
                ]);
            } catch (\Exception $e) {
                Log::error('Error storing audio file', [
                    'error' => $e->getMessage(),
                    'file' => $request->file('audio_file')->getClientOriginalName(),
                    'mime_type' => $request->file('audio_file')->getMimeType(),
                    'size' => $request->file('audio_file')->getSize()
                ]);
                throw new \Exception('Failed to store audio file: ' . $e->getMessage());
            }

            $audiobook = Audiobook::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'author' => $validated['author'],
                'description' => $validated['description'] ?? null,
                'cover_image' => json_encode($coverPaths),
                'audio_file' => $audioPath,
                'duration' => $validated['duration'],
                'category' => $validated['category'],
                'is_public' => $validated['is_public'] ?? false,
                'generated_code' => $validated['generated_code'] ?? null,
            ]);

            Log::info('Audiobook created successfully', ['audiobook_id' => $audiobook->id]);

            return redirect()->back()->with('success', 'Audiobook published successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error during audiobook upload', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
            ]);
            return response()->json(['errors' => $e->errors()], 422);
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
        $user = auth()->user();

        // Check if the audiobook is public
        if ($audiobook->is_public) {
            return response()->json([
                'audiobook' => $audiobook->load(['user', 'comments.user', 'favoritedBy']),
            ]);
        }

        // Check if the user owns the audiobook
        if ($audiobook->user_id === $user->id) {
            return response()->json([
                'audiobook' => $audiobook->load(['user', 'comments.user', 'favoritedBy']),
            ]);
        }

        // Check if the audiobook is in any of the user's rooms
        $userRooms = $user->joinedRooms()->with('audiobooks')->get();
        foreach ($userRooms as $room) {
            if ($room->audiobooks->contains($audiobook->id)) {
                return response()->json([
                    'audiobook' => $audiobook->load(['user', 'comments.user', 'favoritedBy']),
                ]);
            }
        }

        // If none of the above conditions are met, deny access
        abort(403, 'You do not have permission to access this audiobook.');
    }

    public function toggleFavorite(Audiobook $audiobook)
    {
        // Check if the audiobook is public or belongs to the current user
        if (!$audiobook->is_public && $audiobook->user_id !== auth()->id()) {
            abort(403);
        }

        $user = auth()->user();
        $isFavorited = $audiobook->favoritedBy()->where('user_id', $user->id)->exists();

        if ($isFavorited) {
            $audiobook->favoritedBy()->detach($user->id);
        } else {
            $audiobook->favoritedBy()->attach($user->id);
        }

        return response()->json([
            'success' => true,
            'is_favorite' => !$isFavorited
        ]);
    }

    public function all()
    {
        // Get all public audiobooks grouped by category
        $audiobooks = Audiobook::where('is_public', true)
            ->with('user')
            ->latest()
            ->get()
            ->groupBy('category');

        // Get unique categories
        $categories = Audiobook::where('is_public', true)
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('audiobooks/all', [
            'audiobooks' => $audiobooks,
            'categories' => $categories
        ]);
    }

    public function download(Audiobook $audiobook): StreamedResponse
    {
        // Check authorization
        $user = auth()->user();

        // If audiobook is public, allow download
        if ($audiobook->is_public) {
            return $this->streamFile($audiobook);
        }

        // If user owns the audiobook, allow download
        if ($audiobook->user_id === $user->id) {
            return $this->streamFile($audiobook);
        }

        // Check if the audiobook is in any of the user's rooms
        $userRooms = $user->joinedRooms()->with('audiobooks')->get();
        foreach ($userRooms as $room) {
            if ($room->audiobooks->contains($audiobook->id)) {
                return $this->streamFile($audiobook);
            }
        }

        // If none of the above conditions are met, deny access
        abort(403, 'You do not have permission to download this audiobook.');
    }

    private function streamFile(Audiobook $audiobook): StreamedResponse
    {
        $filePath = 'public/' . $audiobook->audio_file;

        if (!Storage::exists($filePath)) {
            abort(404, 'Audiobook file not found.');
        }

        $fileName = basename($audiobook->audio_file);

        return Storage::download($filePath, $fileName, [
            'Content-Type' => Storage::mimeType($filePath),
            'Content-Disposition' => 'attachment; filename="' . $fileName . '";',
        ]);
    }

    public function searchByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $audiobook = Audiobook::where('generated_code', $request->code)->first();

        if (!$audiobook) {
            return response()->json(['error' => 'Audiobook not found.'], 404);
        }

        return response()->json(['audiobook' => $audiobook->load(['user', 'favoritedBy', 'comments.user'])]);
    }
} 