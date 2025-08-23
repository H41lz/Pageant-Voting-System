<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'votes_count' => 'required|integer|min:1|max:10'
        ]);

        $user = Auth::user();
        $candidate = Candidate::findOrFail($request->candidate_id);

        // Check if user has already voted for this candidate
        $existingVote = Vote::where('user_id', $user->id)
            ->where('candidate_id', $request->candidate_id)
            ->first();

        if ($existingVote) {
            // Update existing vote
            $existingVote->votes_count += $request->votes_count;
            $existingVote->save();
        } else {
            // Create new vote
            Vote::create([
                'user_id' => $user->id,
                'candidate_id' => $request->candidate_id,
                'votes_count' => $request->votes_count,
            ]);
        }

        return response()->json([
            'message' => 'Vote cast successfully',
            'votes_cast' => $request->votes_count,
            'candidate' => $candidate->name
        ]);
    }

    public function history(Request $request)
    {
        $user = Auth::user();
        $votes = Vote::with('candidate')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($votes);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'votes_count' => 'required|integer|min:1|max:100'
        ]);

        // This is a placeholder for purchase logic
        // In a real app, you'd integrate with payment gateway
        return response()->json([
            'message' => 'Votes purchased successfully',
            'votes_purchased' => $request->votes_count,
            'total_cost' => $request->votes_count * 1.00 // $1 per vote
        ]);
    }

    public function adminVotes(Request $request)
    {
        $votes = Vote::with(['user', 'candidate'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($votes);
    }
}