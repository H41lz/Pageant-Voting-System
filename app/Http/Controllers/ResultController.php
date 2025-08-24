<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Support\Facades\Log;

class ResultController extends Controller
{
    // Show vote results for all candidates
    public function index()
    {
        $candidates = Candidate::all();
        $results = $candidates->map(function ($c) {
            $free = $c->votes()->where('type', 'free')->count();
            $paid = $c->votes()->where('type', 'paid')->count();
            
            Log::info('Vote count for candidate', [
                'candidate_id' => $c->id,
                'candidate_name' => $c->name,
                'free_votes' => $free,
                'paid_votes' => $paid,
                'total_votes' => $free + $paid
            ]);
            
            return [
                'candidate' => $c,
                'free_votes' => $free,
                'paid_votes' => $paid,
                'total_votes' => $free + $paid,
            ];
        });
        return response()->json($results);
    }
    
    // Get vote counts for a specific candidate (for admin panel)
    public function getCandidateVotes($candidateId)
    {
        $candidate = Candidate::findOrFail($candidateId);
        $free = $candidate->votes()->where('type', 'free')->count();
        $paid = $candidate->votes()->where('type', 'paid')->count();
        
        return response()->json([
            'candidate_id' => $candidateId,
            'free_votes' => $free,
            'paid_votes' => $paid,
            'total_votes' => $free + $paid,
        ]);
    }
}