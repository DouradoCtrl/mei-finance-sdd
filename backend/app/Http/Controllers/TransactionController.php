<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParseRequest;
use App\Http\Requests\ConfirmTransactionsRequest;
use App\Http\Requests\ClassifyRequest;
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
     * Retorna a lista de transações do usuário logado com filtros opcionais.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Transaction::where('user_id', $user->id);

        if ($request->filled('source')) {
            $query->where('source', $request->query('source'));
        }

        if ($request->filled('classification')) {
            $query->where('classification', $request->query('classification'));
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->get();

        return $this->successResponse(
            \App\Http\Resources\TransactionResource::collection($transactions),
            'Transações recuperadas com sucesso.'
        );
    }

    /**
     * Processa o extrato enviado (formato texto ou OFX).
     */
    public function parse(ParseRequest $request)
    {
        $validated = $request->validated();
        $source = $validated['source'];

        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        $transactions = $this->parserService->parseOfx($content, $source);

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

    /**
     * Exclui uma transação.
     */
    public function destroy(Request $request, int $id)
    {
        $deleted = $this->transactionService->deleteTransaction($request->user(), $id);

        if (!$deleted) {
            return $this->errorResponse('Transação não encontrada ou acesso não autorizado.', 404);
        }

        return $this->successResponse(null, 'Transação excluída com sucesso.');
    }

    /**
     * Reclassifica uma transação existente.
     */
    public function classify(ClassifyRequest $request, int $id)
    {
        $validated = $request->validated();
        $transaction = $this->transactionService->updateClassification(
            $request->user(),
            $id,
            $validated['classification']
        );

        if (!$transaction) {
            return $this->errorResponse('Transação não encontrada ou acesso não autorizado.', 404);
        }

        return $this->successResponse(
            new \App\Http\Resources\TransactionResource($transaction),
            'Transação reclassificada com sucesso.'
        );
    }
}
