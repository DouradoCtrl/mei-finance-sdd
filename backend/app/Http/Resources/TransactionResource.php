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
            'amount' => (float) $this->amount,
            'source' => $this->source,
            'classification' => $this->classification,
            'fit_id' => $this->fit_id,
        ];
    }
}
