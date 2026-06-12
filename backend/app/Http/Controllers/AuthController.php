<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Traits\ApiResponse;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Registra um novo usuário MEI.
     */
    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return $this->successResponse([
            'token' => $result['token'],
            'usuario' => new UserResource($result['user'])
        ], 'Usuário cadastrado com sucesso', 201);
    }

    /**
     * Autentica um usuário MEI.
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return $this->errorResponse('E-mail ou senha incorretos.', 401);
        }

        if (isset($result['inactive']) && $result['inactive']) {
            return $this->errorResponse('Sua conta está desativada. Entre em contato com o suporte.', 403);
        }

        return $this->successResponse([
            'token' => $result['token'],
            'usuario' => new UserResource($result['user'])
        ], 'Login realizado com sucesso.', 200);
    }

    /**
     * Realiza o logout, revogando o token ativo.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Token revogado e logout realizado com sucesso.');
    }
}
