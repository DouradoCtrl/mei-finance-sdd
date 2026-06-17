<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    /**
     * Register a new accountant user.
     *
     * @param array $data
     * @return User
     */
    public function registerAccountant(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'accountant',
            'active' => true,
            'crc' => $data['crc'],
            'office_name' => $data['office_name'],
        ]);
    }

    /**
     * List and paginate users with filters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('name')->paginate(15);
    }

    /**
     * Create a new user record.
     *
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->role = $data['role'];
        $user->active = $data['active'] ?? true;

        if ($data['role'] === 'accountant') {
            $user->crc = $data['crc'] ?? null;
            $user->office_name = $data['office_name'] ?? null;
        } else {
            $user->crc = null;
            $user->office_name = null;
        }

        $user->save();

        return $user;
    }

    /**
     * Update an existing user record.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function update(User $user, array $data): User
    {
        // Impede a inativação do próprio administrador logado
        if (auth()->id() === $user->id && isset($data['active']) && !$data['active']) {
            throw ValidationException::withMessages([
                'active' => ['Não é permitido inativar o seu próprio usuário logado.']
            ]);
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];
        $user->active = $data['active'] ?? $user->active;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if ($data['role'] === 'accountant') {
            $user->crc = $data['crc'] ?? null;
            $user->office_name = $data['office_name'] ?? null;
        } else {
            $user->crc = null;
            $user->office_name = null;
        }

        $user->save();

        return $user;
    }

    /**
     * Delete a user record.
     *
     * @param User $user
     * @return void
     * @throws ValidationException
     */
    public function delete(User $user): void
    {
        if (auth()->id() === $user->id) {
            throw ValidationException::withMessages([
                'id' => ['Não é permitido excluir o seu próprio usuário logado.']
            ]);
        }

        $user->delete();
    }
}
