<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'transaction_date', 'description', 'alias', 'amount', 'source', 'bank_name', 'classification', 'fit_id'])]
class Transaction extends Model
{
    /**
     * Os valores padrão para os atributos do modelo.
     *
     * @var array
     */
    protected $attributes = [
        'classification' => 'pending',
    ];

    /**
     * Casts de atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'amount' => 'float',
        ];
    }

    /**
     * Relacionamento com o usuário proprietário da transação.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
