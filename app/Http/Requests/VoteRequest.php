<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'candidate_id' => 'required|exists:candidates,id',
            'type' => 'required|in:free,paid',
        ];
    }
}