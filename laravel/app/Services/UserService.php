<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
}
