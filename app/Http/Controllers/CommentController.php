<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Audiobook;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'audiobook_id' => 'required|exists:audiobooks,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'content' => $validated['content'],
            'user_id' => auth()->id(),
            'audiobook_id' => $validated['audiobook_id'],
        ]);

        return response()->json($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        // Check if user is the comment owner
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
