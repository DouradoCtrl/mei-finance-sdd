<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Processa o extrato enviado (formato texto ou OFX).
     */
    public function parse(Request $request)
    {
        return response()->json(['message' => 'Placeholder parse']);
    }

    /**
     * Salva as transações classificadas no banco.
     */
    public function confirm(Request $request)
    {
        return response()->json(['message' => 'Placeholder confirm']);
    }
}
