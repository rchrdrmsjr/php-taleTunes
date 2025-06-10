<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function mine()
    {
        $user = auth()->user();
        
        // Get rooms owned by the user
        $ownedRooms = Room::where('owner_id', $user->id)
            ->with(['owner', 'members'])
            ->latest()
            ->get();

        // Get rooms where user is a member but not owner
        $joinedRooms = $user->joinedRooms()
            ->where('owner_id', '!=', $user->id)
            ->with(['owner', 'members'])
            ->latest()
            ->get();

        return Inertia::render('rooms/mine', [
            'ownedRooms' => $ownedRooms,
            'joinedRooms' => $joinedRooms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $room = Room::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'room_code' => strtoupper(substr(md5(uniqid()), 0, 6)),
            'owner_id' => auth()->id(),
            'is_active' => true,
        ]);

        // Add owner as a member with 'owner' role
        $room->members()->attach(auth()->id(), [
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        return redirect()->back();
    }

    public function show(Room $room)
    {
        $room->load(['owner', 'members', 'audiobooks.user']);
        
        return Inertia::render('rooms/show', [
            'room' => $room,
            'isOwner' => $room->isOwner(auth()->user()),
            'isModerator' => $room->isModerator(auth()->user()),
        ]);
    }

    public function join(Request $request)
    {
        $validated = $request->validate([
            'room_code' => 'required|string|size:6',
        ]);

        $room = Room::where('room_code', $validated['room_code'])->first();

        if (!$room) {
            return back()->withErrors(['error' => 'Room not found. Please check the room code and try again.']);
        }

        if ($room->isMember(auth()->user())) {
            return back()->withErrors(['error' => 'You are already a member of this room.']);
        }

        $room->members()->attach(auth()->id(), [
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return redirect()->back();
    }

    public function leave(Room $room)
    {
        if ($room->isOwner(auth()->user())) {
            return back()->withErrors(['error' => 'Room owners cannot leave their rooms.']);
        }

        $room->members()->detach(auth()->id());
        return redirect()->back();
    }

    public function update(Request $request, Room $room)
    {
        $this->authorize('update', $room);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $room->update($validated);

        return back()->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room)
    {
        if (!$room->isOwner(auth()->user())) {
            abort(403);
        }

        $room->delete();
        return redirect()->back();
    }
} 