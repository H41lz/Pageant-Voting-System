<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Candidate;
use App\Http\Requests\VoteRequest;
use App\Http\Requests\PurchaseVoteRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    public function store(VoteRequest $request)
    {
        $user = $request->user();
        $type = $request->type;
        
        // Check if user has already voted today (any type, any candidate)
        $todayVote = Vote::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfDay())
            ->first();
            
        if ($todayVote) {
            Log::info('User attempted to vote twice in one day', [
                'user_id' => $user->id,
                'existing_vote_id' => $todayVote->id,
                'attempted_candidate_id' => $request->candidate_id
            ]);
            
            return response()->json([
                'message' => 'You have already voted today. You can only vote once per day.',
                'error' => 'daily_limit_exceeded',
                'next_vote_date' => Carbon::now()->addDay()->startOfDay()->toISOString()
            ], 403);
        }
        
        // Create the vote
        $vote = Vote::create([
            'user_id' => $user->id,
            'candidate_id' => $request->candidate_id,
            'type' => $type,
        ]);
        
        // Get updated vote counts for the candidate
        $candidate = Candidate::find($request->candidate_id);
        $freeVotes = $candidate->votes()->where('type', 'free')->count();
        $paidVotes = $candidate->votes()->where('type', 'paid')->count();
        $totalVotes = $freeVotes + $paidVotes;
        
        Log::info('Vote cast successfully', [
            'user_id' => $user->id,
            'candidate_id' => $request->candidate_id,
            'candidate_name' => $candidate->name,
            'vote_type' => $type,
            'vote_id' => $vote->id,
            'updated_vote_counts' => [
                'free_votes' => $freeVotes,
                'paid_votes' => $paidVotes,
                'total_votes' => $totalVotes
            ]
        ]);
        
        return response()->json([
            'message' => 'Vote cast successfully! You have used your daily vote.',
            'vote' => $vote,
            'daily_limit_reached' => true,
            'next_vote_date' => Carbon::tomorrow('UTC')->startOfDay()->toISOString(),
            'updated_vote_counts' => [
                'free_votes' => $freeVotes,
                'paid_votes' => $paidVotes,
                'total_votes' => $totalVotes
            ]
        ]);
    }

    public function history(Request $request)
    {
        $votes = $request->user()->votes()->with('candidate')->latest()->get();
        return response()->json($votes);
    }

    public function purchase(PurchaseVoteRequest $request)
    {
        $user = $request->user();
        
        // Check if user has already voted today (any type, any candidate)
        $todayVote = Vote::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfDay())
            ->first();
            
        if ($todayVote) {
            return response()->json([
                'message' => 'You have already voted today. You can only vote once per day.',
                'error' => 'daily_limit_exceeded',
                'next_vote_date' => Carbon::tomorrow('UTC')->startOfDay()->toISOString()
            ], 403);
        }
        
        // Create the paid votes
        $votes = [];
        for ($i = 0; $i < $request->quantity; $i++) {
            $votes[] = Vote::create([
                'user_id' => $user->id,
                'candidate_id' => $request->candidate_id,
                'type' => 'paid',
            ]);
        }
        
        // Bonus vote
        $votes[] = Vote::create([
            'user_id' => $user->id,
            'candidate_id' => $request->candidate_id,
            'type' => 'paid',
        ]);
        
        Log::info('Paid votes purchased successfully', [
            'user_id' => $user->id,
            'candidate_id' => $request->candidate_id,
            'total_votes' => count($votes)
        ]);
        
        return response()->json([
            'message' => 'Paid votes purchased with bonus! You have used your daily vote.',
            'total_votes' => count($votes),
            'votes' => $votes,
            'daily_limit_reached' => true,
            'next_vote_date' => Carbon::tomorrow('UTC')->startOfDay()->toISOString()
        ]);
    }

    public function adminVotes(Request $request)
    {
        $query = Vote::with(['user', 'candidate']);
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        return response()->json($query->latest()->get());
    }
    
    // New method to check if user can vote today
    public function canVote(Request $request)
    {
        $user = $request->user();
        
        $todayVote = Vote::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfDay())
            ->first();
            
        $canVote = !$todayVote;
        $nextVoteDate = null;
        
        if (!$canVote) {
            $nextVoteDate = Carbon::tomorrow('UTC')->startOfDay()->toISOString();
        }
        
        return response()->json([
            'can_vote' => $canVote,
            'next_vote_date' => $nextVoteDate,
            'today_vote' => $todayVote ? [
                'candidate_name' => $todayVote->candidate->name,
                'vote_type' => $todayVote->type,
                'voted_at' => $todayVote->created_at
            ] : null
        ]);
    }
}