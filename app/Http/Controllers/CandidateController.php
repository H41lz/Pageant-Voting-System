<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
{
    public function index()
    {
        // This method is protected by admin middleware
        return Candidate::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'description']);
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('candidates', $imageName, 'public');
                $data['image'] = Storage::url($imagePath);
            }

            $candidate = Candidate::create($data);
            
            return response()->json([
                'message' => 'Candidate created successfully',
                'candidate' => $candidate
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create candidate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Candidate $candidate)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'description']);
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($candidate->image) {
                    $oldImagePath = str_replace('/storage/', '', $candidate->image);
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('candidates', $imageName, 'public');
                $data['image'] = Storage::url($imagePath);
            }

            $candidate->update($data);
            
            return response()->json([
                'message' => 'Candidate updated successfully',
                'candidate' => $candidate
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update candidate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Candidate $candidate)
    {
        try {
            // Delete associated image if exists
            if ($candidate->image) {
                $imagePath = str_replace('/storage/', '', $candidate->image);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            
            $candidate->delete();
            
            return response()->json([
                'message' => 'Candidate deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete candidate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function publicIndex()
    {
        // Public endpoint for viewing candidates (no authentication required)
        return Candidate::orderBy('created_at', 'desc')->get();
    }

    public function show(Candidate $candidate)
    {
        // Show individual candidate (admin only)
        return response()->json($candidate);
    }
}