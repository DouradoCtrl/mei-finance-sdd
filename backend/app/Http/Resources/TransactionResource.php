<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transaction_date' => $this->transaction_date?->format('Y-m-d'),
            'description' => $this->description,
            'alias' => $this->alias,
            'amount' => (float) $this->amount,
            'source' => $this->source,
            'bank_name' => $this->bank_name,
            'classification' => $this->classification,
            'fit_id' => $this->fit_id,
        ];
    }
}
