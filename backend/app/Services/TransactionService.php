<?php

namespace App\Services;

use App\Models\User;
use App\Models\Transaction;

class TransactionService
{
    /**
     * Confirma e salva as transações de um usuário, evitando duplicidades.
     *
     * @param User $user
     * @param array $transactionsData
     * @return void
     */
    public function saveTransactions(User $user, array $transactionsData): void
    {
        foreach ($transactionsData as $txData) {
            $fitId = $txData['fit_id'] ?? null;

            if ($fitId) {
                // Se tem fit_id, checa duplicidade pelo fit_id e user_id
                $exists = Transaction::where('user_id', $user->id)
                    ->where('fit_id', $fitId)
                    ->exists();
            } else {
                // Caso contrário, checa duplicidade pelos campos de fallback
                $exists = Transaction::where('user_id', $user->id)
                    ->where('transaction_date', $txData['transaction_date'])
                    ->where('description', $txData['description'])
                    ->where('amount', $txData['amount'])
                    ->exists();
            }

            if (!$exists) {
                Transaction::create([
                    'user_id' => $user->id,
                    'transaction_date' => $txData['transaction_date'],
                    'description' => $txData['description'],
                    'amount' => $txData['amount'],
                    'source' => $txData['source'],
                    'classification' => $txData['classification'],
                    'fit_id' => $fitId,
                ]);
            }
        }
    }

    /**
     * Exclui uma transação se ela pertencer ao usuário informado.
     */
    public function deleteTransaction(User $user, int $transactionId): bool
    {
        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $transactionId)
            ->first();

        if ($transaction) {
            return (bool) $transaction->delete();
        }

        return false;
    }

    /**
     * Atualiza a classificação de uma transação se ela pertencer ao usuário informado.
     */
    public function updateClassification(User $user, int $transactionId, string $classification): ?Transaction
    {
        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $transactionId)
            ->first();

        if ($transaction) {
            $transaction->update(['classification' => $classification]);
            return $transaction;
        }

        return null;
    }
}
