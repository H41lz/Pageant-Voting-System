<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    public function index()
    {
        return Candidate::orderBy('created_at', 'desc')->get();
    }

    public function store(StoreCandidateRequest $request)
    {
        $data = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('candidates', 'public');
            $data['image'] = Storage::url($imagePath);
        }
        
        $candidate = Candidate::create($data);
        return response()->json($candidate, 201);
    }

    public function show(Candidate $candidate)
    {
        return response()->json($candidate);
    }

    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        $data = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($candidate->image) {
                $oldImagePath = str_replace('/storage/', '', $candidate->image);
                Storage::disk('public')->delete($oldImagePath);
            }
            
            $imagePath = $request->file('image')->store('candidates', 'public');
            $data['image'] = Storage::url($imagePath);
        }
        
        $candidate->update($data);
        return response()->json($candidate);
    }

    public function destroy(Candidate $candidate)
    {
        // Delete image if it exists
        if ($candidate->image) {
            $imagePath = str_replace('/storage/', '', $candidate->image);
            Storage::disk('public')->delete($imagePath);
        }
        
        // Delete related votes first
        $candidate->votes()->delete();
        $candidate->delete();
        
        return response()->json(['message' => 'Candidate deleted successfully']);
    }

    public function publicIndex()
    {
        return Candidate::orderBy('name', 'asc')->get();
    }
}