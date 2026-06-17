<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use ApiResponse;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Listar e pesquisar usuários de forma paginada.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search']);
        $users = $this->userService->list($filters);

        return $this->successResponse(
            UserResource::collection($users)->response()->getData(true),
            'Usuários listados com sucesso.'
        );
    }

    /**
     * Criar um novo usuário (administrador ou contador).
     */
    public function store(UserStoreRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return $this->successResponse(
            new UserResource($user),
            'Usuário criado com sucesso.',
            201
        );
    }

    /**
     * Exibir os detalhes de um usuário específico.
     */
    public function show(User $user): JsonResponse
    {
        return $this->successResponse(
            new UserResource($user),
            'Usuário detalhado com sucesso.'
        );
    }

    /**
     * Atualizar os dados de um usuário existente.
     */
    public function update(UserUpdateRequest $request, User $user): JsonResponse
    {
        try {
            $updatedUser = $this->userService->update($user, $request->validated());

            return $this->successResponse(
                new UserResource($updatedUser),
                'Usuário atualizado com sucesso.'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }

    /**
     * Excluir um usuário do sistema.
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            $this->userService->delete($user);

            return $this->successResponse(
                null,
                'Usuário excluído com sucesso.'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }
}
