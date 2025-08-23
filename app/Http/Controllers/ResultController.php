<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResultController extends Controller
{
    public function index()
    {
        $results = Candidate::leftJoin('votes', 'candidates.id', '=', 'votes.candidate_id')
            ->select(
                'candidates.id',
                'candidates.name',
                'candidates.description',
                'candidates.image',
                DB::raw('COALESCE(SUM(votes.votes_count), 0) as total_votes'),
                DB::raw('COUNT(DISTINCT votes.user_id) as unique_voters')
            )
            ->groupBy('candidates.id', 'candidates.name', 'candidates.description', 'candidates.image')
            ->orderBy('total_votes', 'desc')
            ->get();

        return response()->json($results);
    }
}