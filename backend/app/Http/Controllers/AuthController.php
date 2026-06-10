<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
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

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Usuário cadastrado com sucesso',
            'token' => $token,
            'usuario' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'cnpj' => $user->cnpj,
            ]
        ], 201);
    }

    /**
     * Autentica um usuário MEI.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'sucesso' => false,
                'erro' => 'E-mail ou senha incorretos.'
            ], 401);
        }

        $token = $user->createToken('NextJSToken')->plainTextToken;

        return response()->json([
            'sucesso' => true,
            'token' => $token,
            'usuario' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'cnpj' => $user->cnpj,
            ]
        ]);
    }

    /**
     * Realiza o logout, revogando o token ativo.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Token revogado e logout realizado com sucesso.'
        ]);
    }
}
