<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ConfirmTransactionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transactions' => 'required|array|min:1',
            'transactions.*.transaction_date' => 'required|date_format:Y-m-d',
            'transactions.*.description' => 'required|string',
            'transactions.*.amount' => 'required|numeric',
            'transactions.*.source' => 'required|string|in:checking_account,credit_card',
            'transactions.*.classification' => 'required|string|in:pending,business_pj,personal_pf,transfer',
            'transactions.*.fit_id' => 'nullable|string',
            'transactions.*.bank_name' => 'nullable|string',
            'transactions.*.alias' => 'nullable|string',
        ];
    }
}
