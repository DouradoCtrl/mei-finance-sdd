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
     * Display a listing of the resource.
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
     * Store a newly created resource in storage.
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
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        return $this->successResponse(
            new UserResource($user),
            'Usuário detalhado com sucesso.'
        );
    }

    /**
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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
