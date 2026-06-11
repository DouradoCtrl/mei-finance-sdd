<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParseRequest;
use App\Http\Requests\ConfirmTransactionsRequest;
use App\Services\BankStatementParserService;
use App\Services\TransactionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    use ApiResponse;

    protected BankStatementParserService $parserService;
    protected TransactionService $transactionService;

    public function __construct(
        BankStatementParserService $parserService,
        TransactionService $transactionService
    ) {
        $this->parserService = $parserService;
        $this->transactionService = $transactionService;
    }

    /**
     * Processa o extrato enviado (formato texto ou OFX).
     */
    public function parse(ParseRequest $request)
    {
        $validated = $request->validated();
        $source = $validated['source'];
        $format = $validated['format'];
        $transactions = [];

        if ($format === 'ofx') {
            $file = $request->file('file');
            $content = file_get_contents($file->getRealPath());
            $transactions = $this->parserService->parseOfx($content, $source);
        } else {
            $rawText = $validated['raw_text'] ?? '';
            $transactions = $this->parserService->parseText($rawText, $source);
        }

        // Checagem de duplicidade antes de retornar ao frontend
        $user = $request->user();
        foreach ($transactions as &$tx) {
            if ($tx['fit_id']) {
                $tx['is_duplicate'] = \App\Models\Transaction::where('user_id', $user->id)
                    ->where('fit_id', $tx['fit_id'])
                    ->exists();
            } else {
                $tx['is_duplicate'] = \App\Models\Transaction::where('user_id', $user->id)
                    ->where('transaction_date', $tx['transaction_date'])
                    ->where('description', $tx['description'])
                    ->where('amount', $tx['amount'])
                    ->exists();
            }
        }

        return $this->successResponse($transactions, 'Extrato processado com sucesso.');
    }

    /**
     * Salva as transações classificadas no banco.
     */
    public function confirm(ConfirmTransactionsRequest $request)
    {
        $validated = $request->validated();
        $this->transactionService->saveTransactions($request->user(), $validated['transactions']);

        return $this->successResponse(null, 'Transações salvas e conciliação efetuada com sucesso.', 201);
    }
}
