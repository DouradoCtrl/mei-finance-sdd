<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Retorna uma resposta JSON de sucesso padronizada.
     */
    protected function successResponse($data = null, ?string $message = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'sucesso' => true,
            'mensagem' => $message,
            'dados' => $data
        ], $code);
    }

    /**
     * Retorna uma resposta JSON de erro padronizada.
     */
    protected function errorResponse(string $message, int $code = 400, $data = null): JsonResponse
    {
        return response()->json([
            'sucesso' => false,
            'erro' => $message,
            'dados' => $data
        ], $code);
    }
}
