<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Hash;
use App\Traits\ApiResponse;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Registra um novo usuário MEI.
     */
    public function register(RegisterRequest $request)
    {
        $cnpj = $request->cnpj;
        if ($cnpj) {
            // Remove qualquer caractere não numérico do CNPJ
            $cnpj = preg_replace('/\D/', '', $cnpj);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'cnpj' => $cnpj,
        ]);

        $token = $user->createToken('NextJSToken')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'usuario' => new UserResource($user)
        ], 'Usuário cadastrado com sucesso', 201);
    }

    /**
     * Autentica um usuário MEI.
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('E-mail ou senha incorretos.', 401);
        }

        $token = $user->createToken('NextJSToken')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'usuario' => new UserResource($user)
        ]);
    }

    /**
     * Realiza o logout, revogando o token ativo.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Token revogado e logout realizado com sucesso.');
    }
}
