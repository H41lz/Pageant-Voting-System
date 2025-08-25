<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CandidateController extends Controller
{
    public function index()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Admins only'], 403);
        }
        
        Log::info('CandidateController: Fetching all candidates');
        return Candidate::all();
    }

    public function store(StoreCandidateRequest $request)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Admins only'], 403);
        }
        
        Log::info('CandidateController: Creating candidate', $request->validated());
        
        try {
            $candidate = Candidate::create($request->validated());
            Log::info('CandidateController: Candidate created successfully', ['id' => $candidate->id]);
            return response()->json($candidate, 201);
        } catch (\Exception $e) {
            Log::error('CandidateController: Failed to create candidate', [
                'error' => $e->getMessage(),
                'data' => $request->validated()
            ]);
            throw $e;
        }
    }

    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Admins only'], 403);
        }
        
        Log::info('CandidateController: Updating candidate', [
            'id' => $candidate->id,
            'data' => $request->validated()
        ]);
        
        try {
            $candidate->update($request->validated());
            Log::info('CandidateController: Candidate updated successfully', ['id' => $candidate->id]);
            return response()->json($candidate);
        } catch (\Exception $e) {
            Log::error('CandidateController: Failed to update candidate', [
                'id' => $candidate->id,
                'error' => $e->getMessage(),
                'data' => $request->validated()
            ]);
            throw $e;
        }
    }

    public function destroy(Candidate $candidate)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Admins only'], 403);
        }
        
        Log::info('CandidateController: Deleting candidate', ['id' => $candidate->id]);
        
        try {
            $candidate->delete();
            Log::info('CandidateController: Candidate deleted successfully', ['id' => $candidate->id]);
            return response()->json(['message' => 'Candidate deleted']);
        } catch (\Exception $e) {
            Log::error('CandidateController: Failed to delete candidate', [
                'id' => $candidate->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function publicIndex()
    {
        Log::info('CandidateController: Fetching public candidates');
        return Candidate::all();
    }

    public function updateImage(Request $request, Candidate $candidate)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Admins only'], 403);
        }
        
        Log::info('CandidateController: Updating candidate image', [
            'id' => $candidate->id,
            'has_image' => $request->hasFile('image')
        ]);
        
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                
                // Validate file
                $request->validate([
                    'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
                ]);
                
                // Generate unique filename
                $fileName = time() . '_' . $file->getClientOriginalName();
                
                // Move file to public/candidates-images directory
                $file->move(public_path('candidates-images'), $fileName);
                
                // Update candidate with new image path
                $candidate->update([
                    'name' => $request->input('name', $candidate->name),
                    'description' => $request->input('description', $candidate->description),
                    'image' => '/candidates-images/' . $fileName
                ]);
                
                Log::info('CandidateController: Image updated successfully', [
                    'id' => $candidate->id,
                    'image_path' => '/candidates-images/' . $fileName
                ]);
                
                return response()->json($candidate);
            } else {
                return response()->json(['message' => 'No image file provided'], 400);
            }
        } catch (\Exception $e) {
            Log::error('CandidateController: Failed to update candidate image', [
                'id' => $candidate->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}