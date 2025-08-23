<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseVoteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'candidate_id' => 'required|exists:candidates,id',
            'quantity' => 'required|integer|min:1',
        ];
    }
}